import * as Promise from 'bluebird';
import * as _ from 'lodash';
import { inspect } from 'util';
import * as Err from './error';
// import { OutOfGoalError, EmptyGoalError, NotLoadedError, InvalidExecutablePathError } from './error';
import Goal from './editor/goal';
import { View, Agda, Connection } from './type';
import { handleResponses } from './response-handler';
import { Core } from './core';
import * as Req from './request';
import * as Action from './view/actions';
import Table from './asset/query';

function toDescription(normalization: Agda.Normalization): string {
    switch(normalization) {
        case 'Simplified':      return '';
        case 'Instantiated':    return '(no normalization)';
        case 'Normalised':      return '(full normalization)';
        default:                throw `unknown normalization: ${normalization}`;
    }
}

export default class Commander {
    private loaded: boolean;

    private history: {
        checkpoints: number[];  // checkpoint stack
        reload: boolean;        // should reload to reconcile goals
    };

    constructor(private core: Core) {
        this.dispatchCommand = this.dispatchCommand.bind(this);
        this.startCheckpoint = this.startCheckpoint.bind(this);
        this.endCheckpoint = this.endCheckpoint.bind(this);

        this.history = {
            checkpoints: [],
            reload: false
        };
    }

    //
    //  History Management
    //

    // sometimes a child command may be invoked by some parent command,
    // in that case, both the parent and the child command should be
    // regarded as a single action

    private startCheckpoint = (command: Agda.Command) => (connection: Connection): Connection => {
        this.history.checkpoints.push(this.core.editor.getTextEditor().createCheckpoint());

        if (this.history.checkpoints.length === 1) {
            // see if reloading is needed on undo
            const needReload = _.includes([
                'SolveConstraints',
                'Give',
                'Refine',
                'Auto',
                'Case'
            ], command.kind);
            this.history.reload = needReload;
        }
        return connection;
    }

    private endCheckpoint = () => {
        const checkpoint = this.history.checkpoints.pop();
        // group changes if it's a parent command
        if (this.history.checkpoints.length === 0) { // popped
            this.core.editor.getTextEditor().groupChangesSinceCheckpoint(checkpoint);
        }
    }

    //
    //  Dispatchers
    //

    dispatchUndo = () => {
        // reset goals after undo
        this.core.editor.getTextEditor().undo();
        // reload
        if (this.history.reload)
            this.dispatch({ kind: 'Load' });
    }

    dispatch = (command: Agda.Command): Promise<void> => {
        // some commands can be executed without connection to Agda
        const needNoConnection = _.includes([
                'Quit',
                'InputSymbol',
                'InputSymbolCurlyBracket',
                'InputSymbolBracket',
                'InputSymbolParenthesis',
                'InputSymbolDoubleQuote',
                'InputSymbolSingleQuote',
                'InputSymbolBackQuote',
                'QuerySymbol'
            ], command.kind);

        if (needNoConnection) {
            return this.dispatchCommand(command)(null)
                .then(handleResponses(this.core))
                .catch(Err.QueryCancelled, () => {
                    this.core.view.set('Query cancelled', [], View.Style.Warning);
                })
                .catch(this.core.connection.handleError)
        } else {
            var connection: Promise<Connection>;
            if (command.kind === 'Load') {
                // activate the view first
                const currentMountingPosition = this.core.view.store.getState().view.mountAt.current;
                this.core.view.mountPanel(currentMountingPosition);
                this.core.view.activatePanel();
                // initialize connection
                connection = this.core.connection.connect();
            } else {
                // get existing connection
                connection = this.core.connection.getConnection()
            }
            return connection
                .then(this.startCheckpoint(command))
                .then(this.dispatchCommand(command))
                .then(handleResponses(this.core))
                .finally(this.endCheckpoint)
                .catch(this.core.connection.handleError);
        }
    }

    private dispatchCommand = (command: Agda.Command): (connection: Connection) => Promise<Agda.Response[]> => {
        switch(command.kind) {
            case 'Load':          return this.load;
            case 'Quit':          return this.quit;
            case 'Restart':       return this.restart;
            case 'Abort':         return this.abort;
            case 'ToggleDocking': return this.toggleDocking;
            case 'Compile':       return this.compile;
            case 'ToggleDisplayOfImplicitArguments':
                return this.toggleDisplayOfImplicitArguments;
            case 'SolveConstraints':
                return this.solveConstraints;
            case 'ShowConstraints':
                return this.showConstraints;
            case 'ShowGoals':
                return this.showGoals;
            case 'NextGoal':      return this.nextGoal;
            case 'PreviousGoal':  return this.previousGoal;
            case 'WhyInScope':    return this.whyInScope;
            case 'InferType':
                return this.inferType(command.normalization);
            case 'ModuleContents':
                return this.moduleContents(command.normalization);
            case 'ComputeNormalForm':
                return this.computeNormalForm(command.computeMode);
            case 'Give':          return this.give;
            case 'Refine':        return this.refine;
            case 'Auto':          return this.auto;
            case 'Case':          return this.case;
            case 'GoalType':
                return this.goalType(command.normalization);
            case 'Context':
                return this.context(command.normalization);
            case 'GoalTypeAndContext':
                return this.goalTypeAndContext(command.normalization);
            case 'GoalTypeAndInferredType':
                return this.goalTypeAndInferredType(command.normalization);
            case 'InputSymbol':   return this.inputSymbol;
            case 'InputSymbolCurlyBracket':
                return this.inputSymbolInterceptKey(command.kind, '{');
            case 'InputSymbolBracket':
                return this.inputSymbolInterceptKey(command.kind, '[');
            case 'InputSymbolParenthesis':
                return this.inputSymbolInterceptKey(command.kind, '(');
            case 'InputSymbolDoubleQuote':
                return this.inputSymbolInterceptKey(command.kind, '"');
            case 'InputSymbolSingleQuote':
                return this.inputSymbolInterceptKey(command.kind, '\'');
            case 'InputSymbolBackQuote':
                return this.inputSymbolInterceptKey(command.kind, '`');
            case 'QuerySymbol':   return this.querySymbol;
            default:    throw `undispatched command type\n${JSON.stringify(command)}`
        }
    }

    //
    //  Commands
    //
    private load = (connection: Connection): Promise<Agda.Response[]> => {
        // force save before load
        return this.core.editor.save()
            .then(() => connection)
            .then(Req.load)
            .then(result => {
                this.loaded = true;
                return result;
            })

    }

    private quit = (connection: Connection): Promise<Agda.Response[]> => {
        this.core.view.deactivatePanel();
        const currentMountingPosition = this.core.view.store.getState().view.mountAt.current;
        this.core.view.unmountPanel(currentMountingPosition);
        if (this.loaded) {
            this.loaded = false;
            this.core.editor.goal.removeAll();
            this.core.editor.highlighting.destroyAll();
            this.core.connection.disconnect();
        }
        return Promise.resolve([]);
    }

    private restart = (connection: Connection): Promise<Agda.Response[]> => {
        return this.quit(connection)
            .then(() => connection)
            .then(this.load);
    }

    private abort = Req.abort;

    private toggleDocking = (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.view.toggleDocking()
            .then(() => Promise.resolve([]));
    }

    private compile = Req.compile;
    private toggleDisplayOfImplicitArguments = Req.toggleDisplayOfImplicitArguments;
    private solveConstraints = Req.solveConstraints('Instantiated')
    private showConstraints = Req.showConstraints
    private showGoals = Req.showGoals

    private nextGoal = (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.editor.jumpToNextGoal()
            .then(() => Promise.resolve([]));
    }

    private previousGoal = (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.editor.jumpToPreviousGoal()
            .then(() => Promise.resolve([]));
    }

    //
    //  The following commands may have a goal-specific version
    //

    private whyInScope = (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.view.query('Scope info', [], View.Style.PlainText, 'name:')
            .then((expr) => {
                return this.core.editor.goal.pointing()
                    .then(goal => Req.whyInScope(expr, goal)(connection))
                    .catch(Err.OutOfGoalError, () => Req.whyInScopeGlobal(expr)(connection))
            });
    }

    private inferType = (normalization: Agda.Normalization) => (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.editor.goal.pointing()
            .then(goal => {
                // goal-specific
                if (goal.isEmpty()) {
                    return this.core.view.query(`Infer type ${toDescription(normalization)}`, [], View.Style.PlainText, 'expression to infer:')
                        .then(expr => Req.inferType(normalization, expr, goal)(connection))
                } else {
                    return Req.inferType(normalization, goal.getContent(), goal)(connection);
                }
            })
            .catch(() => {
                // global command
                return this.core.view.query(`Infer type ${toDescription(normalization)}`, [], View.Style.PlainText, 'expression to infer:')
                    .then(expr => Req.inferTypeGlobal(normalization, expr)(connection))
            })
    }


    private moduleContents = (normalization: Agda.Normalization) => (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.view.query(`Module contents ${toDescription(normalization)}`, [], View.Style.PlainText, 'module name:')
            .then(expr => {
                return this.core.editor.goal.pointing()
                    .then(goal => this.core.connection
                        .getConnection()
                        .then(Req.moduleContents(normalization, expr, goal))
                    )
                    .catch((error) => {
                        return this.core.connection
                            .getConnection()
                            .then(Req.moduleContentsGlobal(normalization, expr))
                    });
            })
    }


    private computeNormalForm = (computeMode: Agda.ComputeMode) => (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.editor.goal.pointing()
            .then((goal) => {
                if (goal.isEmpty()) {
                    return this.core.view.query(`Compute normal form`, [], View.Style.PlainText, 'expression to normalize:')
                        .then(expr => Req.computeNormalForm(computeMode, expr, goal)(connection))
                } else {
                    return Req.computeNormalForm(computeMode, goal.getContent(), goal)(connection)
                }
            })
            .catch(Err.OutOfGoalError, () => {
                return this.core.view.query(`Compute normal form`, [], View.Style.PlainText, 'expression to normalize:')
                    .then(expr => Req.computeNormalFormGlobal(computeMode, expr)(connection))
            })

    }

    //
    //  The following commands only working in the context of a specific goal
    //

    private give = (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.editor.goal.pointing()
            .then((goal) => {
                if (goal.isEmpty()) {
                    return this.core.view.query('Give', [], View.Style.PlainText, 'expression to give:')
                        .then(goal.setContent);
                } else {
                    return goal;
                }
            })
            .then(goal => Req.give(goal)(connection))
            .catch(Err.OutOfGoalError, () => {
                this.core.view.set('Out of goal', ['`Give` is a goal-specific command, please place the cursor in a goal'], View.Style.Error);
                return []
            })
    }

    private refine = (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.editor.goal.pointing()
            .then(goal => Req.refine(goal)(connection))
            .catch(Err.OutOfGoalError, () => {
                this.core.view.set('Out of goal', ['`Refine` is a goal-specific command, please place the cursor in a goal'], View.Style.Error);
                return []
            })
    }

    private auto = (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.editor.goal.pointing()
            .then(goal => Req.auto(goal)(connection))
            .catch(Err.OutOfGoalError, () => {
                this.core.view.set('Out of goal', ['`Auto` is a goal-specific command, please place the cursor in a goal'], View.Style.Error);
                return []
            })
    }

    private case = (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.editor.goal.pointing()
            .then((goal) => {
                if (goal.isEmpty()) {
                    return this.core.view.query('Case', [], View.Style.PlainText, 'the argument to case:')
                        .then(goal.setContent);
                } else {
                    return goal;
                }
            })
            .then(goal => Req.makeCase(goal)(connection))
            .catch(Err.OutOfGoalError, () => {
                this.core.view.set('Out of goal', ['`Case` is a goal-specific command, please place the cursor in a goal'], View.Style.Error);
                return []
            })
    }

    private goalType = (normalization: Agda.Normalization) => (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.editor.goal.pointing()
            .then(goal => Req.goalType(normalization, goal)(connection))
            .catch(Err.OutOfGoalError, () => {
                this.core.view.set('Out of goal', ['"Goal Type" is a goal-specific command, please place the cursor in a goal'], View.Style.Error);
                return []
            })
    }

    private context = (normalization: Agda.Normalization) => (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.editor.goal.pointing()
            .then(goal => Req.context(normalization, goal)(connection))
            .catch(Err.OutOfGoalError, () => {
                this.core.view.set('Out of goal', ['"Context" is a goal-specific command, please place the cursor in a goal'], View.Style.Error);
                return []
            })
    }

    private goalTypeAndContext = (normalization: Agda.Normalization) => (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.editor.goal.pointing()
            .then(goal => Req.goalTypeAndContext(normalization, goal)(connection))
            .catch(Err.OutOfGoalError, () => {
                this.core.view.set('Out of goal', ['"Goal Type & Context" is a goal-specific command, please place the cursor in a goal'], View.Style.Error);
                return []
            })
    }

    private goalTypeAndInferredType = (normalization: Agda.Normalization) => (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.editor.goal.pointing()
            .then(goal => Req.goalTypeAndInferredType(normalization, goal)(connection))
            .catch(Err.OutOfGoalError, () => {
                this.core.view.set('Out of goal', ['"Goal Type & Inferred Type" is a goal-specific command, please place the cursor in a goal'], View.Style.Error);
                return []
            })
    }

    private inputSymbol = (connection: Connection): Promise<Agda.Response[]> => {
        if (atom.config.get('agda-mode.inputMethod')) {
            if (!this.loaded) {
                const currentMountingPosition = this.core.view.store.getState().view.mountAt.current;
                this.core.view.mountPanel(currentMountingPosition);
                this.core.view.activatePanel();
                this.core.view.set('Not loaded', [], View.Style.PlainText);
            }
            this.core.inputMethod.activate();
        } else {
            this.core.view.editors.getFocusedEditor().insertText('\\');
        }
        return Promise.resolve([]);
    }

    private querySymbol = (connection: Connection): Promise<Agda.Response[]> => {
        return this.core.view.query(`Query Unicode symbol input sequences`, [], View.Style.PlainText, 'symbol:')
            .then(symbol => {
                const sequences = Table[symbol.codePointAt(0)] || [];
                this.core.view.set(
                    `Input sequence for ${symbol}`,
                    sequences,
                    View.Style.PlainText);
                    return [];
            });
    }

    private inputSymbolInterceptKey = (kind, key: string) => (connection: Connection): Promise<Agda.Response[]> => {
        this.core.inputMethod.interceptAndInsertKey(key);
        return Promise.resolve([]);
    }
}
