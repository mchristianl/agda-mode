// Generated by BUCKLESCRIPT VERSION 4.0.5, PLEASE EDIT WITH CARE
'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var Block = require("bs-platform/lib/js/block.js");
var $$String = require("bs-platform/lib/js/string.js");
var Js_option = require("bs-platform/lib/js/js_option.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Js_primitive = require("bs-platform/lib/js/js_primitive.js");

function allGoalsWarnings(title, body) {
  var shitpile = body.split("\n");
  var hasMetas = Js_option.isSome(Js_primitive.null_to_opt(title.match((/Goals/))));
  var hasWarnings = Js_option.isSome(Js_primitive.null_to_opt(title.match((/Warnings/))));
  var hasErrors = Js_option.isSome(Js_primitive.null_to_opt(title.match((/Errors/))));
  var indexOfWarnings = shitpile.findIndex((function (s) {
          return Js_option.isSome(Js_primitive.null_to_opt(s.slice(5, 13).match((/Warnings/))));
        }));
  var indexOfErrors = shitpile.findIndex((function (s) {
          return Js_option.isSome(Js_primitive.null_to_opt(s.slice(5, 11).match((/Errors/))));
        }));
  if (hasMetas) {
    if (hasWarnings) {
      if (hasErrors) {
        return /* record */Block.record([
                  "metas",
                  "warnings",
                  "errors"
                ], [
                  shitpile.slice(0, indexOfWarnings),
                  shitpile.slice(indexOfWarnings + 1 | 0, indexOfErrors),
                  shitpile.slice(indexOfErrors + 1 | 0)
                ]);
      } else {
        return /* record */Block.record([
                  "metas",
                  "warnings",
                  "errors"
                ], [
                  shitpile.slice(0, indexOfWarnings),
                  shitpile.slice(indexOfWarnings + 1 | 0),
                  []
                ]);
      }
    } else if (hasErrors) {
      return /* record */Block.record([
                "metas",
                "warnings",
                "errors"
              ], [
                shitpile.slice(0, indexOfErrors),
                [],
                shitpile.slice(indexOfErrors + 1 | 0)
              ]);
    } else {
      return /* record */Block.record([
                "metas",
                "warnings",
                "errors"
              ], [
                shitpile,
                [],
                []
              ]);
    }
  } else if (hasWarnings) {
    if (hasErrors) {
      return /* record */Block.record([
                "metas",
                "warnings",
                "errors"
              ], [
                [],
                shitpile.slice(0, indexOfErrors),
                shitpile.slice(indexOfErrors + 1 | 0)
              ]);
    } else {
      return /* record */Block.record([
                "metas",
                "warnings",
                "errors"
              ], [
                [],
                shitpile,
                []
              ]);
    }
  } else if (hasErrors) {
    return /* record */Block.record([
              "metas",
              "warnings",
              "errors"
            ], [
              [],
              [],
              shitpile
            ]);
  } else {
    return /* record */Block.record([
              "metas",
              "warnings",
              "errors"
            ], [
              [],
              [],
              []
            ]);
  }
}

function goalTypeContext(body) {
  var shitpile = body.split("\n");
  var indexOfHave = shitpile.findIndex((function (s) {
          return Js_option.isSome(Js_primitive.null_to_opt(s.match((/^Have/))));
        }));
  var indexOfDelimeter = shitpile.findIndex((function (s) {
          return Js_option.isSome(Js_primitive.null_to_opt(s.match((/\u2014{60}/g))));
        }));
  var parseGoalOrHave = function (lines) {
    return $$String.concat("\n", $$Array.to_list(lines)).slice(5);
  };
  if (indexOfHave === -1) {
    return /* record */Block.record([
              "goal",
              "have",
              "metas"
            ], [
              parseGoalOrHave(shitpile.slice(0, indexOfDelimeter)),
              undefined,
              shitpile.slice(indexOfDelimeter + 1 | 0)
            ]);
  } else {
    return /* record */Block.record([
              "goal",
              "have",
              "metas"
            ], [
              parseGoalOrHave(shitpile.slice(0, indexOfHave)),
              parseGoalOrHave(shitpile.slice(indexOfHave, indexOfDelimeter)),
              shitpile.slice(indexOfDelimeter + 1 | 0)
            ]);
  }
}

function concatLines(lines) {
  var newLineIndices = $$Array.map((function (param) {
          return param[2];
        }), lines.map((function (line, index) {
                if (lines.length > (index + 1 | 0)) {
                  return /* tuple */[
                          line,
                          Caml_array.caml_array_get(lines, index + 1 | 0),
                          index
                        ];
                } else {
                  return /* tuple */[
                          line,
                          undefined,
                          index
                        ];
                }
              })).filter((function (param) {
              var line = param[0];
              var nextLine = param[1];
              var sort = (/^Sort \S*/);
              var completeJudgement = (/^[^\(\{\s]+\s+\:\s* \S*/);
              var reallyLongTermIdentifier = (/^\S+$/);
              var restOfTheJudgement = (/^\s*\:\s* \S*/);
              if (sort.test(line) || reallyLongTermIdentifier.test(line) && Js_option.isSomeValue((function (_, line) {
                        return restOfTheJudgement.test(line);
                      }), "", nextLine)) {
                return true;
              } else {
                return completeJudgement.test(line);
              }
            })));
  return $$Array.map((function (param) {
                return $$String.concat("\n", $$Array.to_list(lines.slice(param[0], param[1])));
              }), newLineIndices.map((function (index, i) {
                    if (newLineIndices.length === (i + 1 | 0)) {
                      return /* tuple */[
                              index,
                              newLineIndices.length + 1 | 0
                            ];
                    } else {
                      return /* tuple */[
                              index,
                              Caml_array.caml_array_get(newLineIndices, i + 1 | 0)
                            ];
                    }
                  })));
}

var Parser = /* module */Block.localModule([
    "allGoalsWarnings",
    "goalTypeContext",
    "concatLines"
  ], [
    allGoalsWarnings,
    goalTypeContext,
    concatLines
  ]);

var jsParseAllGoalsWarnings = allGoalsWarnings;

var jsParseGoalTypeContext = goalTypeContext;

var jsConcatLines = concatLines;

exports.Parser = Parser;
exports.jsParseAllGoalsWarnings = jsParseAllGoalsWarnings;
exports.jsParseGoalTypeContext = jsParseGoalTypeContext;
exports.jsConcatLines = jsConcatLines;
/* No side effect */