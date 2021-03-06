// Generated by BUCKLESCRIPT VERSION 4.0.18, PLEASE EDIT WITH CARE
'use strict';

var Path = require("path");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Rebase = require("@glennsl/rebase/lib/js/src/Rebase.bs.js");
var Js_dict = require("bs-platform/lib/js/js_dict.js");
var Caml_format = require("bs-platform/lib/js/caml_format.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Util$AgdaMode = require("../../Util.bs.js");
var Range$AgdaMode = require("../Range.bs.js");

function unindent(lines) {
  var newLineIndices = Rebase.$$Array[/* map */0]((function (param) {
          return param[2];
        }), Rebase.$$Array[/* filter */10]((function (param) {
              var line = param[0];
              var nextLine = param[1];
              var sort = (/^Sort \S*/);
              var delimeter = (/^\u2014{4}/g);
              var completeJudgement = (/^(?:(?:[^\(\{\s]+\s+\:)|Have\:|Goal\:)\s* \S*/);
              var reallyLongTermIdentifier = (/^\S+$/);
              var restOfTheJudgement = (/^\s*\:\s* \S*/);
              if (sort.test(line) || delimeter.test(line) || reallyLongTermIdentifier.test(line) && Rebase.Option[/* exists */9]((function (line) {
                        return restOfTheJudgement.test(line);
                      }), nextLine)) {
                return true;
              } else {
                return completeJudgement.test(line);
              }
            }), Rebase.$$Array[/* mapi */27]((function (line, index) {
                  return /* tuple */[
                          line,
                          Rebase.$$Array[/* get */17](lines, index + 1 | 0),
                          index
                        ];
                }), lines)));
  return Rebase.$$Array[/* map */0]((function (param) {
                return Rebase.$$String[/* joinWith */11]("\n", Rebase.List[/* fromArray */12](Rebase.$$Array[/* slice */25](param[0], param[1], lines)));
              }), Rebase.$$Array[/* mapi */27]((function (index, i) {
                    var match = Rebase.$$Array[/* get */17](newLineIndices, i + 1 | 0);
                    if (match !== undefined) {
                      return /* tuple */[
                              index,
                              match
                            ];
                    } else {
                      return /* tuple */[
                              index,
                              Rebase.$$Array[/* length */16](lines) + 1 | 0
                            ];
                    }
                  }), newLineIndices));
}

var filepath = /* String */Block.variant("String", 1, [(function (raw) {
        var parsed = Path.parse(raw.replace("\n", ""));
        var joined = Rebase.$$String[/* joinWith */11]("/", Rebase.List[/* fromArray */12](Path.join(parsed.dir, parsed.base).split(Path.sep)));
        if (joined.charCodeAt(0) === 8234.0) {
          return Rebase.Option[/* some */11](joined.slice(1).trim());
        } else {
          return Rebase.Option[/* some */11](joined.trim());
        }
      })]);

var range_000 = (/^(\S+)\:(?:(\d+)\,(\d+)\-(\d+)\,(\d+)|(\d+)\,(\d+)\-(\d+))$/);

function range_001(captured) {
  var srcFile = Rebase.Option[/* flatten */20](Rebase.$$Array[/* get */17](captured, 1));
  var sameRow = Rebase.Option[/* isSome */13](Rebase.Option[/* flatten */20](Rebase.$$Array[/* get */17](captured, 6)));
  if (sameRow) {
    return Rebase.Option[/* flatMap */5]((function (row) {
                  return Rebase.Option[/* flatMap */5]((function (colStart) {
                                return Rebase.Option[/* flatMap */5]((function (colEnd) {
                                              return /* Range */Block.simpleVariant("Range", [
                                                        srcFile,
                                                        /* :: */Block.simpleVariant("::", [
                                                            /* record */Block.record([
                                                                "start",
                                                                "end_"
                                                              ], [
                                                                Block.record([
                                                                    "pos",
                                                                    "line",
                                                                    "col"
                                                                  ], [
                                                                    undefined,
                                                                    Caml_format.caml_int_of_string(row),
                                                                    Caml_format.caml_int_of_string(colStart)
                                                                  ]),
                                                                Block.record([
                                                                    "pos",
                                                                    "line",
                                                                    "col"
                                                                  ], [
                                                                    undefined,
                                                                    Caml_format.caml_int_of_string(row),
                                                                    Caml_format.caml_int_of_string(colEnd)
                                                                  ])
                                                              ]),
                                                            /* [] */0
                                                          ])
                                                      ]);
                                            }), Rebase.Option[/* flatten */20](Rebase.$$Array[/* get */17](captured, 8)));
                              }), Rebase.Option[/* flatten */20](Rebase.$$Array[/* get */17](captured, 7)));
                }), Rebase.Option[/* flatten */20](Rebase.$$Array[/* get */17](captured, 6)));
  } else {
    return Rebase.Option[/* flatMap */5]((function (rowStart) {
                  return Rebase.Option[/* flatMap */5]((function (colStart) {
                                return Rebase.Option[/* flatMap */5]((function (rowEnd) {
                                              return Rebase.Option[/* flatMap */5]((function (colEnd) {
                                                            return /* Range */Block.simpleVariant("Range", [
                                                                      srcFile,
                                                                      /* :: */Block.simpleVariant("::", [
                                                                          /* record */Block.record([
                                                                              "start",
                                                                              "end_"
                                                                            ], [
                                                                              Block.record([
                                                                                  "pos",
                                                                                  "line",
                                                                                  "col"
                                                                                ], [
                                                                                  undefined,
                                                                                  Caml_format.caml_int_of_string(rowStart),
                                                                                  Caml_format.caml_int_of_string(colStart)
                                                                                ]),
                                                                              Block.record([
                                                                                  "pos",
                                                                                  "line",
                                                                                  "col"
                                                                                ], [
                                                                                  undefined,
                                                                                  Caml_format.caml_int_of_string(rowEnd),
                                                                                  Caml_format.caml_int_of_string(colEnd)
                                                                                ])
                                                                            ]),
                                                                          /* [] */0
                                                                        ])
                                                                    ]);
                                                          }), Rebase.Option[/* flatten */20](Rebase.$$Array[/* get */17](captured, 5)));
                                            }), Rebase.Option[/* flatten */20](Rebase.$$Array[/* get */17](captured, 4)));
                              }), Rebase.Option[/* flatten */20](Rebase.$$Array[/* get */17](captured, 3)));
                }), Rebase.Option[/* flatten */20](Rebase.$$Array[/* get */17](captured, 2)));
  }
}

var range = /* Regex */Block.variant("Regex", 0, [
    range_000,
    range_001
  ]);

var expr = /* String */Block.variant("String", 1, [(function (raw) {
        return Rebase.Option[/* some */11](Rebase.$$Array[/* mapi */27]((function (token, i) {
                          var match = i % 3;
                          if (match !== 1) {
                            if (match !== 2) {
                              return /* Plain */Block.variant("Plain", 0, [token]);
                            } else {
                              return /* Underscore */Block.variant("Underscore", 2, [token]);
                            }
                          } else {
                            return /* QuestionMark */Block.variant("QuestionMark", 1, [token]);
                          }
                        }), Rebase.$$String[/* trim */8](raw).split((/(\?\d+)|(\_\d+[^\}\)\s]*)/))));
      })]);

var ofType_000 = (/^([^\:]*) \: ((?:\n|.)+)/);

function ofType_001(captured) {
  return Rebase.Option[/* flatMap */5]((function (type_) {
                return Rebase.Option[/* flatMap */5]((function (term) {
                              return /* OfType */Block.variant("OfType", 0, [
                                        term,
                                        type_
                                      ]);
                            }), Util$AgdaMode.Parser[/* at */3](1, expr, captured));
              }), Util$AgdaMode.Parser[/* at */3](2, expr, captured));
}

var ofType = /* Regex */Block.variant("Regex", 0, [
    ofType_000,
    ofType_001
  ]);

var justType_000 = (/^Type ((?:\n|.)+)/);

function justType_001(captured) {
  return Rebase.Option[/* map */0]((function (type_) {
                return /* JustType */Block.variant("JustType", 1, [type_]);
              }), Util$AgdaMode.Parser[/* at */3](1, expr, captured));
}

var justType = /* Regex */Block.variant("Regex", 0, [
    justType_000,
    justType_001
  ]);

var justSort_000 = (/^Sort ((?:\n|.)+)/);

function justSort_001(captured) {
  return Rebase.Option[/* map */0]((function (sort) {
                return /* JustSort */Block.variant("JustSort", 2, [sort]);
              }), Util$AgdaMode.Parser[/* at */3](1, expr, captured));
}

var justSort = /* Regex */Block.variant("Regex", 0, [
    justSort_000,
    justSort_001
  ]);

var others = /* String */Block.variant("String", 1, [(function (raw) {
        return Rebase.Option[/* map */0]((function (raw$prime) {
                      return /* Others */Block.variant("Others", 3, [raw$prime]);
                    }), Util$AgdaMode.Parser[/* parse */1](expr, raw));
      })]);

var OutputConstraint = /* module */Block.localModule([
    "ofType",
    "justType",
    "justSort",
    "others"
  ], [
    ofType,
    justType,
    justSort,
    others
  ]);

var outputConstraint = Util$AgdaMode.Parser[/* choice */4](/* array */[
      ofType,
      justType,
      justSort,
      others
    ]);

var outputWithoutRange = /* String */Block.variant("String", 1, [(function (raw) {
        return Rebase.Option[/* map */0]((function (x) {
                      return /* Output */Block.simpleVariant("Output", [
                                x,
                                undefined
                              ]);
                    }), Util$AgdaMode.Parser[/* parse */1](outputConstraint, raw));
      })]);

var outputWithRange_000 = (/((?:\n|.)*\S+)\s*\[ at ([^\]]+) \]/);

function outputWithRange_001(captured) {
  var partial_arg = Util$AgdaMode.Parser[/* parse */1];
  return Rebase.Option[/* map */0]((function (oc) {
                var partial_arg = Util$AgdaMode.Parser[/* parse */1];
                var r = Rebase.Option[/* flatMap */5]((function (param) {
                        return partial_arg(range, param);
                      }), Rebase.Option[/* flatten */20](Rebase.$$Array[/* get */17](captured, 2)));
                return /* Output */Block.simpleVariant("Output", [
                          oc,
                          r
                        ]);
              }), Rebase.Option[/* flatMap */5]((function (param) {
                    return partial_arg(outputConstraint, param);
                  }), Rebase.Option[/* flatten */20](Rebase.$$Array[/* get */17](captured, 1))));
}

var outputWithRange = /* Regex */Block.variant("Regex", 0, [
    outputWithRange_000,
    outputWithRange_001
  ]);

var Output = /* module */Block.localModule([
    "outputWithoutRange",
    "outputWithRange"
  ], [
    outputWithoutRange,
    outputWithRange
  ]);

var output = /* String */Block.variant("String", 1, [(function (raw) {
        var rangeRe = (/\[ at (\S+\:(?:\d+\,\d+\-\d+\,\d+|\d+\,\d+\-\d+)) \]$/);
        var hasRange = rangeRe.test(raw);
        if (hasRange) {
          return Util$AgdaMode.Parser[/* parse */1](outputWithRange, raw);
        } else {
          return Util$AgdaMode.Parser[/* parse */1](outputWithoutRange, raw);
        }
      })]);

var plainText = /* String */Block.variant("String", 1, [(function (raw) {
        return Rebase.Option[/* some */11](Rebase.$$Array[/* mapi */27]((function (token, i) {
                          var match = i % 2;
                          if (match !== 1) {
                            return /* Left */Block.variant("Left", 0, [token]);
                          } else {
                            return Rebase.Option[/* mapOr */18]((function (x) {
                                          return /* Right */Block.variant("Right", 1, [x]);
                                        }), /* Left */Block.variant("Left", 0, [token]), Util$AgdaMode.Parser[/* parse */1](range, token));
                          }
                        }), raw.split((/(\S+\:(?:\d+\,\d+\-\d+\,\d+|\d+\,\d+\-\d+))/))));
      })]);

function warningOrErrors(isWarning) {
  return /* String */Block.variant("String", 1, [(function (raw) {
                return Rebase.Option[/* map */0]((function (body) {
                              if (isWarning) {
                                return /* Warning */Block.variant("Warning", 0, [body]);
                              } else {
                                return /* Error */Block.variant("Error", 1, [body]);
                              }
                            }), Util$AgdaMode.Parser[/* parse */1](plainText, raw));
              })]);
}

var warning = warningOrErrors(true);

var error = warningOrErrors(false);

var partial_arg = Util$AgdaMode.Dict[/* split */1];

function partiteMetas(param) {
  return partial_arg("metas", (function (rawMetas) {
                var metas = unindent(rawMetas);
                var indexOfHiddenMetas = Rebase.Option[/* map */0]((function (prim) {
                        return prim[0];
                      }), Rebase.$$Array[/* findIndex */29]((function (s) {
                            return Rebase.Option[/* isSome */13](Util$AgdaMode.Parser[/* parse */1](outputWithRange, s));
                          }), metas));
                return Util$AgdaMode.Dict[/* partite */0]((function (param) {
                              var i = param[1];
                              if (indexOfHiddenMetas !== undefined) {
                                if (i === indexOfHiddenMetas) {
                                  return "hiddenMetas";
                                } else if (i === 0) {
                                  return "interactionMetas";
                                } else {
                                  return undefined;
                                }
                              } else if (i === 0) {
                                return "interactionMetas";
                              } else {
                                return undefined;
                              }
                            }), metas);
              }), param);
}

function partiteWarningsOrErrors(key) {
  var partial_arg = Util$AgdaMode.Dict[/* update */2];
  return (function (param) {
      return partial_arg(key, (function (raw) {
                    var partial_arg = (/^\u2014{4}/);
                    var hasDelimeter = Rebase.Option[/* isSome */13](Rebase.Option[/* flatMap */5]((function (param) {
                                return Caml_option.null_to_opt(param.match(partial_arg));
                              }), Rebase.$$Array[/* get */17](raw, 0)));
                    var lines = hasDelimeter ? raw.slice(1) : raw;
                    var markWarningStart = function (line) {
                      return Rebase.Option[/* isSome */13](Util$AgdaMode.Parser[/* parse */1](range, line));
                    };
                    var glueBack = function (xs) {
                      var partial_arg = (/at$/);
                      return Rebase.Option[/* isSome */13](Rebase.Option[/* flatMap */5]((function (param) {
                                        return Caml_option.null_to_opt(param.match(partial_arg));
                                      }), Rebase.$$Array[/* get */17](xs, Rebase.$$Array[/* length */16](xs) - 1 | 0)));
                    };
                    return Rebase.$$Array[/* map */0]((function (xs) {
                                  return Rebase.$$String[/* joinWith */11]("\n", Rebase.List[/* fromArray */12](xs));
                                }), Util$AgdaMode.Array_[/* mergeWithNext */2](glueBack)(Util$AgdaMode.Array_[/* partite */1](markWarningStart, lines)));
                  }), param);
    });
}

function allGoalsWarnings(title, body) {
  var partiteAllGoalsWarnings = function (title, body) {
    var lines = body.split("\n");
    var hasMetas = Rebase.Option[/* isSome */13](Caml_option.null_to_opt(title.match((/Goals/))));
    var hasWarnings = Rebase.Option[/* isSome */13](Caml_option.null_to_opt(title.match((/Warnings/))));
    var hasErrors = Rebase.Option[/* isSome */13](Caml_option.null_to_opt(title.match((/Errors/))));
    var markMetas = function (param) {
      var match = hasMetas && param[1] === 0;
      if (match) {
        return "metas";
      }
      
    };
    var markWarnings = function (param) {
      if (hasWarnings) {
        if (hasMetas) {
          return Rebase.Option[/* map */0]((function (param) {
                        return "warnings";
                      }), Caml_option.null_to_opt(param[0].slice(5, 13).match((/Warnings/))));
        } else {
          var match = param[1] === 0;
          if (match) {
            return "warnings";
          } else {
            return undefined;
          }
        }
      }
      
    };
    var markErrors = function (param) {
      if (hasErrors) {
        var match = hasMetas || hasWarnings;
        if (match) {
          return Rebase.Option[/* map */0]((function (param) {
                        return "errors";
                      }), Caml_option.null_to_opt(param[0].slice(5, 11).match((/Errors/))));
        } else {
          var match$1 = param[1] === 0;
          if (match$1) {
            return "errors";
          } else {
            return undefined;
          }
        }
      }
      
    };
    return Util$AgdaMode.Dict[/* partite */0]((function (line) {
                  return Rebase.Option[/* or_ */15](Rebase.Option[/* or_ */15](markMetas(line), markWarnings(line)), markErrors(line));
                }), lines);
  };
  var dictionary = partiteWarningsOrErrors("errors")(partiteWarningsOrErrors("warnings")(partiteMetas(partiteAllGoalsWarnings(title, body))));
  var interactionMetas = Rebase.Option[/* mapOr */18]((function (metas) {
          return Util$AgdaMode.Parser[/* parseArray */2](outputWithoutRange, metas);
        }), /* array */[], Js_dict.get(dictionary, "interactionMetas"));
  var hiddenMetas = Rebase.Option[/* mapOr */18]((function (metas) {
          return Util$AgdaMode.Parser[/* parseArray */2](outputWithRange, metas);
        }), /* array */[], Js_dict.get(dictionary, "hiddenMetas"));
  var warnings = Rebase.Option[/* mapOr */18]((function (entries) {
          return Util$AgdaMode.Parser[/* parseArray */2](warning, entries);
        }), /* array */[], Js_dict.get(dictionary, "warnings"));
  var errors = Rebase.Option[/* mapOr */18]((function (entries) {
          return Util$AgdaMode.Parser[/* parseArray */2](error, entries);
        }), /* array */[], Js_dict.get(dictionary, "errors"));
  return /* record */Block.record([
            "interactionMetas",
            "hiddenMetas",
            "warnings",
            "errors"
          ], [
            interactionMetas,
            hiddenMetas,
            warnings,
            errors
          ]);
}

function goalTypeContext(raw) {
  var markGoal = function (param) {
    return Rebase.Option[/* map */0]((function (param) {
                  return "goal";
                }), Caml_option.null_to_opt(param[0].match((/^Goal:/))));
  };
  var markHave = function (param) {
    return Rebase.Option[/* map */0]((function (param) {
                  return "have";
                }), Caml_option.null_to_opt(param[0].match((/^Have:/))));
  };
  var markMetas = function (param) {
    return Rebase.Option[/* map */0]((function (param) {
                  return "metas";
                }), Caml_option.null_to_opt(param[0].match((/\u2014{60}/g))));
  };
  var partial_arg = Util$AgdaMode.Dict[/* partite */0];
  var partiteGoalTypeContext = function (param) {
    return partial_arg((function (line) {
                  return Rebase.Option[/* or_ */15](Rebase.Option[/* or_ */15](markGoal(line), markHave(line)), markMetas(line));
                }), param);
  };
  var partial_arg$1 = Util$AgdaMode.Dict[/* update */2];
  var removeDelimeter = function (param) {
    return partial_arg$1("metas", (function (param) {
                  return param.slice(1);
                }), param);
  };
  var lines = raw.split("\n");
  var dictionary = partiteMetas(Curry._1(removeDelimeter, Curry._1(partiteGoalTypeContext, lines)));
  var goal = Rebase.Option[/* map */0]((function (x) {
          return /* Goal */Block.simpleVariant("Goal", [x]);
        }), Rebase.Option[/* flatMap */5]((function (line) {
              return Util$AgdaMode.Parser[/* parse */1](expr, Rebase.$$String[/* joinWith */11]("\n", Rebase.List[/* fromArray */12](line)).slice(5));
            }), Js_dict.get(dictionary, "goal")));
  var have = Rebase.Option[/* map */0]((function (x) {
          return /* Have */Block.simpleVariant("Have", [x]);
        }), Rebase.Option[/* flatMap */5]((function (line) {
              return Util$AgdaMode.Parser[/* parse */1](expr, Rebase.$$String[/* joinWith */11]("\n", Rebase.List[/* fromArray */12](line)).slice(5));
            }), Js_dict.get(dictionary, "have")));
  var interactionMetas = Rebase.Option[/* mapOr */18]((function (metas) {
          return Util$AgdaMode.Parser[/* parseArray */2](outputWithoutRange, metas);
        }), /* array */[], Js_dict.get(dictionary, "interactionMetas"));
  var hiddenMetas = Rebase.Option[/* mapOr */18]((function (metas) {
          return Util$AgdaMode.Parser[/* parseArray */2](outputWithRange, metas);
        }), /* array */[], Js_dict.get(dictionary, "hiddenMetas"));
  return /* record */Block.record([
            "goal",
            "have",
            "interactionMetas",
            "hiddenMetas"
          ], [
            goal,
            have,
            interactionMetas,
            hiddenMetas
          ]);
}

function context(raw) {
  var lines = unindent(raw.split("\n"));
  return Util$AgdaMode.Parser[/* parseArray */2](output, lines);
}

function error$1(raw) {
  var lines = raw.split("\n");
  var __x = partiteWarningsOrErrors("errors")(Util$AgdaMode.Dict[/* partite */0]((function (param) {
              var match = param[1] === 0;
              if (match) {
                return "errors";
              }
              
            }), lines));
  return Rebase.Option[/* mapOr */18]((function (metas) {
                return Util$AgdaMode.Parser[/* parseArray */2](error, metas);
              }), /* array */[], Js_dict.get(__x, "errors"));
}

function whyInScope(raw) {
  var ranges = Util$AgdaMode.Array_[/* catMaybes */0](Rebase.$$Array[/* mapi */27]((function (token, i) {
              var match = i % 2;
              if (match !== 1) {
                return undefined;
              } else {
                return Util$AgdaMode.Parser[/* parse */1](range, token);
              }
            }), raw.split((/its definition at (\S+\:(?:\d+\,\d+\-\d+\,\d+|\d+\,\d+\-\d+))/g))));
  return /* tuple */[
          Rebase.Option[/* getOr */16](/* array */[], Util$AgdaMode.Parser[/* parse */1](plainText, raw)),
          ranges
        ];
}

function searchAbout(raw) {
  var lines = raw.split("\n");
  var target = Rebase.Option[/* getOr */16]("???", Rebase.Option[/* map */0]((function (param) {
              return param.slice(18);
            }), Rebase.$$Array[/* get */17](lines, 0)));
  var outputs = Util$AgdaMode.Parser[/* parseArray */2](output, unindent(Rebase.$$Array[/* map */0]((function (s) {
                  return s.slice(2);
                }), lines.slice(1))));
  return /* tuple */[
          target,
          outputs
        ];
}

function body(raw) {
  var match = raw.kind;
  var kind;
  switch (match) {
    case "AllGoalsWarnings" : 
        kind = /* AllGoalsWarnings */0;
        break;
    case "Context" : 
        kind = /* Context */2;
        break;
    case "Error" : 
        kind = /* Error */6;
        break;
    case "GoalTypeContext" : 
        kind = /* GoalTypeContext */1;
        break;
    case "SearchAbout" : 
        kind = /* SearchAbout */5;
        break;
    case "WhyInScope" : 
        kind = /* WhyInScope */4;
        break;
    default:
      kind = /* PlainText */7;
  }
  return /* record */Block.record([
            "kind",
            "header",
            "body"
          ], [
            kind,
            raw.header,
            raw.body
          ]);
}

var Response = /* module */Block.localModule([
    "partiteWarningsOrErrors",
    "allGoalsWarnings",
    "goalTypeContext",
    "context",
    "error",
    "whyInScope",
    "searchAbout",
    "body"
  ], [
    partiteWarningsOrErrors,
    allGoalsWarnings,
    goalTypeContext,
    context,
    error$1,
    whyInScope,
    searchAbout,
    body
  ]);

function parseWhyInScope(raw) {
  var match = whyInScope(raw);
  return Rebase.Option[/* map */0]((function (range) {
                return /* tuple */[
                        Range$AgdaMode.toAtomRange(range),
                        Range$AgdaMode.toAtomFilepath(range)
                      ];
              }), Rebase.$$Array[/* get */17](match[1], 0));
}

exports.unindent = unindent;
exports.filepath = filepath;
exports.range = range;
exports.expr = expr;
exports.OutputConstraint = OutputConstraint;
exports.outputConstraint = outputConstraint;
exports.Output = Output;
exports.output = output;
exports.plainText = plainText;
exports.warningOrErrors = warningOrErrors;
exports.warning = warning;
exports.error = error;
exports.partiteMetas = partiteMetas;
exports.Response = Response;
exports.parseWhyInScope = parseWhyInScope;
/* range Not a pure module */
