import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as fs from 'fs';
import { Agda, View } from './type';
import * as Req from './request';
import { Core } from './core';
import * as J from './parser/json';
import * as Emacs from './parser/emacs';
import * as Err from './error';

// classify responses into async and sync ones
// don't deal everything with promises
// for the nasty issue of https://github.com/petkaantonov/bluebird/issues/1326
const handleResponses = (core: Core) => (responses: Agda.Response[]): Promise<void> => {

    var promises = []; // async actions

    responses.forEach(response => {
        var promise = handleResponse(core)(response);
        if (promise) {
            promises.push(promise);
        }
    });

    return Promise.each(promises, a => a)
        .then(() => {})
        .catch(Err.Conn.NotEstablished, () => {
            core.view.setPlainText('Connection to Agda not established', '', View.Style.Warning);
        })
        .catch(Err.Conn.ConnectionError, error => {
                core.view.setPlainText(error.name, error.message, View.Style.Error);
                // core.view.store.dispatch(Action.CONNECTION.err(error.guid));
        })
        .catch(Err.QueryCancelled, () => {
            core.view.setPlainText('Query cancelled', '', View.Style.Warning);
        })
        .catch((error) => { // catch all the rest
            if (error) {
                console.log(error)
                switch (error.name) {
                    case 'Err.InvalidExecutablePathError':
                    core.view.setPlainText(error.message, error.path, View.Style.Error);
                    break;
                default:
                    core.view.setPlainText(error.name, error.message, View.Style.Error);
                }
            } else {
                core.view.setPlainText('Panic!', 'unknown error', View.Style.Error);
            }
        });
}

const handleResponse = (core: Core) => (response: Agda.Response): Promise<void> | null => {
    switch (response.kind) {
        case 'HighlightingInfo_Direct':
            const annotations = response.annotations;
            return Promise.each(annotations, (annotation) => {
                let unsolvedmeta = _.includes(annotation.type, 'unsolvedmeta');
                let terminationproblem = _.includes(annotation.type, 'terminationproblem')
                if (unsolvedmeta || terminationproblem) {
                    core.editor.highlighting.add(annotation);
                }
            }).then(() => {});

        case 'HighlightingInfo_Indirect':
            return Promise.promisify(fs.readFile)(response.filepath)
                .then(data => {
                    const annotations = core.connection.usesJSON()
                        ? J.parseIndirectAnnotations(data.toString())
                        : Emacs.parseSExpression(data.toString()).map(Emacs.parseAnnotation)
                    annotations.forEach((annotation) => {
                        let unsolvedmeta = _.includes(annotation.type, 'unsolvedmeta');
                        let terminationproblem = _.includes(annotation.type, 'terminationproblem')
                        if (unsolvedmeta || terminationproblem) {
                            core.editor.highlighting.add(annotation);
                        }
                    });
                })
        case 'Status':
            if (response.checked || response.showImplicitArguments) {
                core.view.setPlainText('Status', `Typechecked: ${response.checked}\nDisplay implicit arguments: ${response.showImplicitArguments}`);
            }
            return null;

        case 'JumpToError':
            return core.editor.onJumpToError(response.filepath, response.position);

        case 'InteractionPoints':
            return core.editor.onInteractionPoints(response.indices, response.fileType);

        case 'GiveAction':
            return core.editor.onGiveAction(response.index, response.giveResult, response.result);

        case 'MakeCase':
            return core.editor
                .onMakeCase(response.variant, response.result)
                .then(() => core.commander.dispatch({ kind: 'Load' }))

        case 'SolveAll':
            return Promise.each(response.solutions, (solution) => {
                return core.editor.onSolveAll(solution.index, solution.expression)
                    .then(goal => {
                        return  core.connection.getConnection()
                                .then(connection => [Req.give(goal)({ kind: 'Give' }, connection)])
                                .then(core.commander.sendRequests)
                                .then(handleResponses(core))
                    })
            }).then(() => {});

        case 'DisplayInfo':
            console.log(response.info)
            if (core.connection.usesJSON())
                handleJSONDisplayInfo(core, response.info);
            else
                handleEmacsDisplayInfo(core, response.info);

            return null;

        case 'RunningInfo':
            if (response.verbosity >= 2)
                core.editor.runningInfo.add(response.message)
            else
                core.view.setPlainText('Type-checking', response.message, View.Style.PlainText);
            return null;

        case 'ClearRunningInfo':
            // core.editor.runningInfo.clear();
            return null;

        case 'HighlightClear':
            return core.editor.highlighting.destroyAll();

        case 'DoneAborting':
            core.view.setPlainText('Status', `Done aborting`, View.Style.Warning);
            return null;

        default:
            console.error(`Agda.ResponseType: ${JSON.stringify(response)}`);
            return null;
    }
}

function handleEmacsDisplayInfo(core: Core, response: Agda.Info)  {
    switch (response.kind) {
        case 'CompilationOk':
            core.view.setPlainText('CompilationOk', response.emacsMessage, View.Style.Info);
            break;
        case 'Constraints':
            core.view.setEmacsConstraints(response.constraints);
            break;
        case 'AllGoalsWarnings':
            core.view.setEmacsAllGoalsWarnings(response.emacsTitle, response.emacsMessage);
            break;
        case 'Error':
            core.view.setEmacsError(response.emacsMessage);
            break;
        case 'Auto':
            core.view.setEmacsSolutions(response.payload);
            break;
        case 'ModuleContents':
            core.view.setPlainText('Module Contents', response.payload, View.Style.Info);
            break;
        case 'WhyInScope':
            if (core.commander.currentCommand.kind === "GotoDefinition") {
                core.view.setEmacsGoToDefinition(response.payload);
            } else {
                core.view.setEmacsWhyInScope(response.payload);
            }
            break;
        case 'NormalForm':
            core.view.setPlainText('Normal Form', response.payload, View.Style.Info);
            break;
        case 'GoalType':
            core.view.setEmacsGoalTypeContext('Goal Type and Context', response.payload);
            break;
        case 'CurrentGoal':
            core.view.setPlainText('Current Goal', response.payload, View.Style.Info);
            break;
        case 'InferredType':
            core.view.setPlainText('Inferred Type', response.payload, View.Style.Info);
            break;
        case 'Context':
            core.view.setEmacsContext(response.payload);
            break;
        case 'Intro':
            core.view.setPlainText('Intro', 'No introduction forms found');
            break;
        case 'Time':
        case 'SearchAbout':
        case 'HelperFunction':
            core.view.setPlainText(response.kind, response.payload);
        case 'Version':
            core.view.setPlainText(response.kind, '');
    }
}

function handleJSONDisplayInfo(core: Core, info: Agda.Info)  {
    switch (info.kind) {
        case 'CompilationOk':
            core.view.setPlainText('CompilationOk', 'TBD', View.Style.Warning);
            break;
        case 'Constraints':
            core.view.setPlainText('Constraints', 'TBD', View.Style.Warning);
            break;
        case 'AllGoalsWarnings':
            core.view.setJSONAllGoalsWarnings(info.metas, info.emacsMessage);
            break;
        case 'Error':
            core.view.setJSONError(info.error, info.emacsMessage);
            break;
        case 'Auto':
            core.view.setEmacsSolutions(info.payload);
            break;
        case 'WhyInScope':
            if (core.commander.currentCommand.kind === "GotoDefinition") {
                // const result = Emacs.parseWhyInScope(info.payload);
                // if (result) {
                //     const range = new Range(
                //         [result.range.intervals[0].start[0], result.range.intervals[0].start[1]],
                //         [result.range.intervals[0].end[0], result.range.intervals[0].end[1]]
                //     );
                //     core.editor.jumpToRange(range, result.range.source);
                // } else {
                //     core.view.setPlainText('Go to Definition', 'not in scope', View.Style.Info);
                // }
            } else {
                core.view.setPlainText('Scope Info', info.payload, View.Style.Info);
            }
            break;
        case 'NormalForm':
            core.view.setPlainText('Normal Form', info.payload, View.Style.Info);
            break;
        case 'GoalType':
            // core.view.setEmacsGoalTypeContext('Goal Type and Context', Emacs.parseGoalTypeContext(info.payload));
            break;
        case 'CurrentGoal':
            core.view.setPlainText('Current Goal', info.payload, View.Style.Info);
            break;
        case 'InferredType':
            core.view.setPlainText('Inferred Type', info.payload, View.Style.Info);
            break;
        case 'Context':
            // core.view.setEmacsGoalTypeContext('Context', Emacs.parseGoalTypeContext(info.payload));
            break;
        case 'ModuleContents':
            core.view.setPlainText('Module Contents', info.payload, View.Style.Info);
        case 'HelperFunction':
        case 'Time':
        case 'Intro':
        case 'SearchAbout':
            core.view.setPlainText(info.kind, info.payload, View.Style.PlainText);
            break;
        case 'Version':
            core.view.setPlainText(info.kind, '', View.Style.PlainText);
            break;
    }
}

export {
    handleResponses
}
