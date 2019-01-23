/* Command Dispatcher */

type normalization =
  | Simplified
  | Instantiated
  | Normalised;
type inputSymbolType =
  | Ordinary
  | CurlyBracket
  | Bracket
  | Parenthesis
  | DoubleQuote
  | SingleQuote
  | BackQuote;
type command =
  | Load
  | Quit
  | Restart
  | Abort
  | Compile
  | ToggleDisplayOfImplicitArguments
  | SolveConstraints
  | ShowConstraints
  | ShowGoals
  | NextGoal
  | PreviousGoal
  | ToggleDocking
  | WhyInScope
  | SearchAbout(normalization)
  | InferType(normalization)
  | ModuleContents(normalization)
  | ComputeNormalForm(normalization)
  | Give
  | Refine
  | Auto
  | Case
  | GoalType(normalization)
  | Context(normalization)
  | GoalTypeAndContext(normalization)
  | GoalTypeAndInferredType(normalization)
  | InputSymbol(inputSymbolType)
  | QuerySymbol
  | GoToDefinition;

/* let needConnection = fun
   | Quit */
/* 'Quit',
   'ToggleDocking',
   'InputSymbol',
   'InputSymbolCurlyBracket',
   'InputSymbolBracket',
   'InputSymbolParenthesis',
   'InputSymbolDoubleQuote',
   'InputSymbolSingleQuote',
   'InputSymbolBackQuote',
   'QuerySymbol' */

/* let dispatch = (command, instance) => {}; */

let parse =
  fun
  | "load" => Load
  | "quit" => Quit
  | "restart" => Restart
  | "abort" => Abort
  | "compile" => Compile
  | "toggle-display-of-implicit-arguments" => ToggleDisplayOfImplicitArguments
  | "solve-constraints" => SolveConstraints
  | "show-constraints" => ShowConstraints
  | "show-goals" => ShowGoals
  | "next-goal" => NextGoal
  | "previous-goal" => PreviousGoal
  | "toggle-docking" => ToggleDocking
  | "why-in-scope" => WhyInScope
  | "search-about[Simplified]" => SearchAbout(Simplified)
  | "search-about[Instantiated]" => SearchAbout(Instantiated)
  | "search-about[Normalised]" => SearchAbout(Normalised)
  | "infer-type[Simplified]" => InferType(Simplified)
  | "infer-type[Instantiated]" => InferType(Instantiated)
  | "infer-type[Normalised]" => InferType(Normalised)
  | "module-contents[Simplified]" => ModuleContents(Simplified)
  | "module-contents[Instantiated]" => ModuleContents(Instantiated)
  | "module-contents[Normalised]" => ModuleContents(Normalised)
  | "compute-normal-form[DefaultCompute]" => ComputeNormalForm(Simplified)
  | "compute-normal-form[IgnoreAbstract]" => ComputeNormalForm(Instantiated)
  | "compute-normal-form[UseShowInstance]" => ComputeNormalForm(Normalised)
  | "give" => Give
  | "refine" => Refine
  | "auto" => Auto
  | "case" => Case
  | "goal-type[Simplified]" => GoalType(Simplified)
  | "goal-type[Instantiated]" => GoalType(Instantiated)
  | "goal-type[Normalised]" => GoalType(Normalised)
  | "context[Simplified]" => Context(Simplified)
  | "context[Instantiated]" => Context(Instantiated)
  | "context[Normalised]" => Context(Normalised)
  | "goal-type-and-context[Simplified]" => GoalTypeAndContext(Simplified)
  | "goal-type-and-context[Instantiated]" => GoalTypeAndContext(Instantiated)
  | "goal-type-and-context[Normalised]" => GoalTypeAndContext(Normalised)
  | "goal-type-and-inferred-type[Simplified]" =>
    GoalTypeAndInferredType(Simplified)
  | "goal-type-and-inferred-type[Instantiated]" =>
    GoalTypeAndInferredType(Instantiated)
  | "goal-type-and-inferred-type[Normalised]" =>
    GoalTypeAndInferredType(Normalised)
  | "input-symbol" => InputSymbol(Ordinary)
  | "input-symbol-curly-bracket" => InputSymbol(CurlyBracket)
  | "input-symbol-bracket" => InputSymbol(Bracket)
  | "input-symbol-parenthesis" => InputSymbol(Parenthesis)
  | "input-symbol-double-quote" => InputSymbol(DoubleQuote)
  | "input-symbol-single-quote" => InputSymbol(SingleQuote)
  | "input-symbol-back-quote" => InputSymbol(BackQuote)
  | "query-symbol" => QuerySymbol
  | "go-to-definition" => GoToDefinition
  | _ => Load;

let dispatch = (command, connection: Connection.t): Js.Promise.t(string) => {
  switch (command) {
  | Load =>
    connection
    |> Connection.send(
         {j|IOTCM "/Users/banacorn/agda/test/A.agda" NonInteractive Direct ( Cmd_load "/Users/banacorn/agda/test/A.agda" [])\n|j},
       )
  | _ => Js.Promise.resolve("")
  };
};

let names = [|
  "load",
  "quit",
  "restart",
  "abort",
  "compile",
  "toggle-display-of-implicit-arguments",
  "solve-constraints",
  "show-constraints",
  "show-goals",
  "next-goal",
  "previous-goal",
  "toggle-docking",
  "why-in-scope",
  "search-about[Simplified]",
  "search-about[Instantiated]",
  "search-about[Normalised]",
  "infer-type[Simplified]",
  "infer-type[Instantiated]",
  "infer-type[Normalised]",
  "module-contents[Simplified]",
  "module-contents[Instantiated]",
  "module-contents[Normalised]",
  "compute-normal-form[DefaultCompute]",
  "compute-normal-form[IgnoreAbstract]",
  "compute-normal-form[UseShowInstance]",
  "give",
  "refine",
  "auto",
  "case",
  "goal-type[Simplified]",
  "goal-type[Instantiated]",
  "goal-type[Normalised]",
  "context[Simplified]",
  "context[Instantiated]",
  "context[Normalised]",
  "goal-type-and-context[Simplified]",
  "goal-type-and-context[Instantiated]",
  "goal-type-and-context[Normalised]",
  "goal-type-and-inferred-type[Simplified]",
  "goal-type-and-inferred-type[Instantiated]",
  "goal-type-and-inferred-type[Normalised]",
  "input-symbol",
  "input-symbol-curly-bracket",
  "input-symbol-bracket",
  "input-symbol-parenthesis",
  "input-symbol-double-quote",
  "input-symbol-single-quote",
  "input-symbol-back-quote",
  "query-symbol",
  "go-to-definition",
|];