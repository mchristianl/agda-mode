// Generated by BUCKLESCRIPT VERSION 4.0.18, PLEASE EDIT WITH CARE
'use strict';

var Block = require("bs-platform/lib/js/block.js");
var React = require("react");
var ReasonReact = require("reason-react/lib/js/src/ReasonReact.js");

function MakePair(Config) {
  var _pair = React.createContext(Config[/* defaultValue */0]);
  var make = function (value, children) {
    return ReasonReact.wrapJsForReason(_pair.Provider, {
                value: value
              }, children);
  };
  var Provider = /* module */Block.localModule(["make"], [make]);
  var make$1 = function (children) {
    return ReasonReact.wrapJsForReason(_pair.Consumer, { }, children);
  };
  var Consumer = /* module */Block.localModule(["make"], [make$1]);
  return /* module */Block.localModule([
            "_pair",
            "Provider",
            "Consumer"
          ], [
            _pair,
            Provider,
            Consumer
          ]);
}

function defaultValue(param, param$1) {
  return /* () */0;
}

var _pair = React.createContext(defaultValue);

function make(value, children) {
  return ReasonReact.wrapJsForReason(_pair.Provider, {
              value: value
            }, children);
}

var Provider = /* module */Block.localModule(["make"], [make]);

function make$1(children) {
  return ReasonReact.wrapJsForReason(_pair.Consumer, { }, children);
}

var Consumer = /* module */Block.localModule(["make"], [make$1]);

var Emitter = /* module */Block.localModule([
    "_pair",
    "Provider",
    "Consumer"
  ], [
    _pair,
    Provider,
    Consumer
  ]);

exports.MakePair = MakePair;
exports.Emitter = Emitter;
/* _pair Not a pure module */
