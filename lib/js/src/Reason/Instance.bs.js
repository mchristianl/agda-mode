// Generated by BUCKLESCRIPT VERSION 4.0.18, PLEASE EDIT WITH CARE
'use strict';

var Fs = require("fs");
var Atom = require("atom");
var Util = require("util");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Rebase = require("@glennsl/rebase/lib/js/src/Rebase.bs.js");
var Goal$AgdaMode = require("./Goal.bs.js");
var Hole$AgdaMode = require("./Hole.bs.js");
var Util$AgdaMode = require("./Util.bs.js");
var View$AgdaMode = require("./View.bs.js");
var Parser$AgdaMode = require("./Parser.bs.js");
var Command$AgdaMode = require("./Command.bs.js");
var Editors$AgdaMode = require("./Editors.bs.js");
var Connection$AgdaMode = require("./Connection.bs.js");
var Highlighting$AgdaMode = require("./Highlighting.bs.js");
var Emacs__Parser$AgdaMode = require("./View/Emacs/Emacs__Parser.bs.js");

function make(textEditor) {
  atom.views.getView(textEditor).classList.add("agda");
  var editors = Editors$AgdaMode.make(textEditor);
  return /* record */Block.record([
            "editors",
            "view",
            "highlightings",
            "goals",
            "connection"
          ], [
            editors,
            View$AgdaMode.initialize(editors),
            [],
            [],
            undefined
          ]);
}

function activate(instance) {
  return Util$AgdaMode.Event[/* resolve */9](true, instance[/* view */1][/* activatePanel */4]);
}

function destroyAll(instance) {
  Rebase.$$Array[/* forEach */8](Goal$AgdaMode.destroy, instance[/* goals */3]);
  instance[/* goals */3] = /* array */[];
  return /* () */0;
}

function instantiateAll(indices, instance) {
  destroyAll(instance);
  var textEditor = instance[/* editors */0][/* source */1];
  var filePath = textEditor.getPath();
  var textBuffer = textEditor.getBuffer();
  var source = textEditor.getText();
  var fileType = Goal$AgdaMode.FileType[/* parse */0](filePath);
  var result = Hole$AgdaMode.parse(source, indices, fileType);
  instance[/* goals */3] = Rebase.$$Array[/* map */0]((function (result) {
          var start = textBuffer.positionForCharacterIndex(result[/* originalRange */2][0]);
          var end_ = textBuffer.positionForCharacterIndex(result[/* originalRange */2][1]);
          var range = new Atom.Range(start, end_);
          textEditor.setTextInBufferRange(range, result[/* content */3]);
          return Goal$AgdaMode.make(instance[/* editors */0][/* source */1], result[/* index */0], result[/* modifiedRange */1]);
        }), result);
  return /* () */0;
}

var Goals = /* module */Block.localModule([
    "destroyAll",
    "instantiateAll"
  ], [
    destroyAll,
    instantiateAll
  ]);

function add(annotation, instance) {
  var textEditor = instance[/* editors */0][/* source */1];
  var textBuffer = textEditor.getBuffer();
  var startPoint = textBuffer.positionForCharacterIndex(annotation[/* start */0] - 1 | 0);
  var endPoint = textBuffer.positionForCharacterIndex(annotation[/* end_ */1] - 1 | 0);
  var range = new Atom.Range(startPoint, endPoint);
  var marker = textEditor.markBufferRange(range);
  instance[/* highlightings */2].push(marker);
  var types = annotation[/* types */2].join(" ");
  textEditor.decorateMarker(marker, {
        type: "highlight",
        class: "highlight-decoration " + types
      });
  return /* () */0;
}

function addFromFile(filepath, instance) {
  var readFile = Util.promisify((function (prim, prim$1) {
          Fs.readFile(prim, prim$1);
          return /* () */0;
        }));
  return Util$AgdaMode.$$Promise[/* catch */7]((function (err) {
                console.log(err);
                console.log("cannot read the indirect highlighting file: " + filepath);
                return Util$AgdaMode.$$Promise[/* resolve */1](/* () */0);
              }), Util$AgdaMode.$$Promise[/* then_ */6]((function (content) {
                    Rebase.Result[/* forEach */9]((function (annotations) {
                            return Rebase.$$Array[/* forEach */8]((function (annotation) {
                                          return add(annotation, instance);
                                        }), Rebase.$$Array[/* filter */10](Highlighting$AgdaMode.Annotation[/* shouldHighlight */3], annotations));
                          }), Rebase.Result[/* map */0]((function (tokens) {
                                if (tokens.tag) {
                                  return Highlighting$AgdaMode.Annotation[/* parseIndirectHighlighting */2](tokens[0]);
                                } else {
                                  return /* array */[];
                                }
                              }), Emacs__Parser$AgdaMode.SExpression[/* parse */4](content.toString())));
                    return Util$AgdaMode.$$Promise[/* resolve */1](/* () */0);
                  }), readFile(filepath)));
}

function destroyAll$1(instance) {
  Rebase.$$Array[/* forEach */8]((function (prim) {
          prim.destroy();
          return /* () */0;
        }), instance[/* highlightings */2]);
  instance[/* highlightings */2] = /* array */[];
  return /* () */0;
}

var Highlightings = /* module */Block.localModule([
    "add",
    "addFromFile",
    "destroyAll"
  ], [
    add,
    addFromFile,
    destroyAll$1
  ]);

function connect(instance) {
  var inquireConnection = function (error, instance) {
    activate(instance);
    var p = Util$AgdaMode.$$Promise[/* then_ */6]((function (param) {
            Util$AgdaMode.Event[/* resolve */9](/* Connection */1, instance[/* view */1][/* navigateSettingsView */11]);
            var promise = Util$AgdaMode.Event[/* once */8](instance[/* view */1][/* onInquireConnection */7]);
            Util$AgdaMode.Event[/* resolve */9](/* tuple */[
                  error,
                  ""
                ], instance[/* view */1][/* inquireConnection */6]);
            return promise;
          }), Util$AgdaMode.Event[/* once */8](instance[/* view */1][/* onSettingsView */10]));
    Util$AgdaMode.Event[/* resolve */9](true, instance[/* view */1][/* activateSettingsView */9]);
    return p;
  };
  var getAgdaPath = function (param) {
    var storedPath = Parser$AgdaMode.filepath(atom.config.get("agda-mode.agdaPath"));
    if (Rebase.$$String[/* isEmpty */5](storedPath)) {
      return Connection$AgdaMode.autoSearch("agda");
    } else {
      return Promise.resolve(storedPath);
    }
  };
  var getMetadata = function (instance, path) {
    return Util$AgdaMode.$$Promise[/* catch */7]((function (param) {
                  return Connection$AgdaMode.handleValidationError((function (err) {
                                return Util$AgdaMode.$$Promise[/* then_ */6]((function (param) {
                                              return getMetadata(instance, param);
                                            }), inquireConnection(/* Validation */Block.variant("Validation", 1, [
                                                  path,
                                                  err
                                                ]), instance));
                              }), param);
                }), Connection$AgdaMode.validateAndMake(path));
  };
  var match = instance[/* connection */4];
  if (match !== undefined) {
    return Util$AgdaMode.$$Promise[/* resolve */1](match);
  } else {
    return Util$AgdaMode.$$Promise[/* then_ */6](Connection$AgdaMode.wire, Util$AgdaMode.$$Promise[/* then_ */6]((function (param) {
                      var instance$1 = instance;
                      var connection = param;
                      instance$1[/* connection */4] = connection;
                      atom.config.set("agda-mode.agdaPath", connection[/* metadata */0][/* path */0]);
                      Util$AgdaMode.Event[/* resolve */9](connection, instance$1[/* view */1][/* updateConnection */5]);
                      return Util$AgdaMode.$$Promise[/* resolve */1](connection);
                    }), Util$AgdaMode.$$Promise[/* then_ */6](Connection$AgdaMode.connect, Util$AgdaMode.$$Promise[/* then_ */6]((function (param) {
                              return getMetadata(instance, param);
                            }), Util$AgdaMode.$$Promise[/* catch */7]((function (param) {
                                  return Connection$AgdaMode.handleAutoSearchError((function (err) {
                                                return inquireConnection(/* AutoSearch */Block.variant("AutoSearch", 0, [err]), instance);
                                              }), param);
                                }), getAgdaPath(/* () */0))))));
  }
}

function disconnect(instance) {
  var match = instance[/* connection */4];
  if (match !== undefined) {
    Connection$AgdaMode.disconnect(match);
    instance[/* connection */4] = undefined;
    return /* () */0;
  } else {
    return /* () */0;
  }
}

function get(instance) {
  var match = instance[/* connection */4];
  if (match !== undefined) {
    return Util$AgdaMode.$$Promise[/* resolve */1](match);
  } else {
    return connect(instance);
  }
}

var Connections = /* module */Block.localModule([
    "connect",
    "disconnect",
    "get"
  ], [
    connect,
    disconnect,
    get
  ]);

function deactivate(instance) {
  return Util$AgdaMode.Event[/* resolve */9](false, instance[/* view */1][/* activatePanel */4]);
}

function destroy(instance) {
  deactivate(instance);
  return Curry._1(instance[/* view */1][/* destroy */12][0], /* () */0);
}

function prepareCommand(command, instance) {
  var prepare = function (command, instance) {
    return Util$AgdaMode.$$Promise[/* then_ */6]((function (connection) {
                  return Util$AgdaMode.$$Promise[/* resolve */1](/* record */Block.record([
                                "connection",
                                "filepath",
                                "command"
                              ], [
                                connection,
                                instance[/* editors */0][/* source */1].getPath(),
                                command
                              ]));
                }), get(instance));
  };
  if (typeof command === "number") {
    switch (command) {
      case 0 : 
          return Util$AgdaMode.$$Promise[/* then_ */6]((function (param) {
                        return prepare(/* Load */0, instance);
                      }), instance[/* editors */0][/* source */1].save());
      case 1 : 
          disconnect(instance);
          destroyAll(instance);
          destroyAll$1(instance);
          return Util$AgdaMode.$$Promise[/* resolve */1](undefined);
      case 2 : 
          disconnect(instance);
          return prepare(/* Load */0, instance);
      default:
        return prepare(/* Load */0, instance);
    }
  } else if (command.tag === 8) {
    var enabled = atom.config.get("agda-mode.inputMethod");
    if (enabled) {
      switch (command[0]) {
        case 0 : 
            Util$AgdaMode.Event[/* resolve */9](true, instance[/* view */1][/* activatePanel */4]);
            Util$AgdaMode.Event[/* resolve */9](true, instance[/* view */1][/* activateInputMethod */13]);
            break;
        case 1 : 
            Util$AgdaMode.Event[/* resolve */9]("{", instance[/* view */1][/* interceptAndInsertKey */14]);
            break;
        case 2 : 
            Util$AgdaMode.Event[/* resolve */9]("[", instance[/* view */1][/* interceptAndInsertKey */14]);
            break;
        case 3 : 
            Util$AgdaMode.Event[/* resolve */9]("(", instance[/* view */1][/* interceptAndInsertKey */14]);
            break;
        case 4 : 
            Util$AgdaMode.Event[/* resolve */9]("\"", instance[/* view */1][/* interceptAndInsertKey */14]);
            break;
        case 5 : 
            Util$AgdaMode.Event[/* resolve */9]("'", instance[/* view */1][/* interceptAndInsertKey */14]);
            break;
        case 6 : 
            Util$AgdaMode.Event[/* resolve */9]("`", instance[/* view */1][/* interceptAndInsertKey */14]);
            break;
        
      }
    } else {
      Editors$AgdaMode.Focus[/* get */0](instance[/* editors */0]).insertText("\\");
    }
    return Util$AgdaMode.$$Promise[/* resolve */1](undefined);
  } else {
    return prepare(/* Load */0, instance);
  }
}

function dispatch(command, instance) {
  return Util$AgdaMode.$$Promise[/* then_ */6]((function (prepared) {
                if (prepared !== undefined) {
                  var cmd = prepared;
                  var s = Command$AgdaMode.Packed[/* serialize */0](cmd);
                  return Util$AgdaMode.$$Promise[/* map */0](Rebase.Option[/* some */11], Connection$AgdaMode.send(s, cmd[/* connection */0]));
                } else {
                  return Util$AgdaMode.$$Promise[/* resolve */1](undefined);
                }
              }), prepareCommand(command, instance));
}

function dispatchUndo(_instance) {
  console.log("Undo");
  return /* () */0;
}

var Event = 0;

exports.Event = Event;
exports.make = make;
exports.activate = activate;
exports.Goals = Goals;
exports.Highlightings = Highlightings;
exports.Connections = Connections;
exports.deactivate = deactivate;
exports.destroy = destroy;
exports.prepareCommand = prepareCommand;
exports.dispatch = dispatch;
exports.dispatchUndo = dispatchUndo;
/* fs Not a pure module */