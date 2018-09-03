// Generated by BUCKLESCRIPT VERSION 4.0.5, PLEASE EDIT WITH CARE
'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var ReactDOMRe = require("reason-react/lib/js/src/ReactDOMRe.js");
var ReasonReact = require("reason-react/lib/js/src/ReasonReact.js");

var component = ReasonReact.statelessComponent("Link");

function make($staropt$star, $staropt$star$1, $staropt$star$2, emit, children) {
  var range = $staropt$star !== undefined ? $staropt$star : /* NoRange */0;
  var jump = $staropt$star$1 !== undefined ? $staropt$star$1 : false;
  var hover = $staropt$star$2 !== undefined ? $staropt$star$2 : false;
  return /* record */Block.record([
            "debugName",
            "reactClassInternal",
            "handedOffState",
            "willReceiveProps",
            "didMount",
            "didUpdate",
            "willUnmount",
            "willUpdate",
            "shouldUpdate",
            "render",
            "initialState",
            "retainedProps",
            "reducer",
            "jsElementWrapped"
          ], [
            component[/* debugName */0],
            component[/* reactClassInternal */1],
            component[/* handedOffState */2],
            component[/* willReceiveProps */3],
            component[/* didMount */4],
            component[/* didUpdate */5],
            component[/* willUnmount */6],
            component[/* willUpdate */7],
            component[/* shouldUpdate */8],
            (function () {
                return ReactDOMRe.createElementVariadic("span", {
                            className: "link",
                            onClick: (function () {
                                if (jump) {
                                  return Curry._2(emit, /* JumpToRange */0, range);
                                } else {
                                  return 0;
                                }
                              }),
                            onMouseOut: (function () {
                                if (hover) {
                                  return Curry._2(emit, /* MouseOut */2, range);
                                } else {
                                  return 0;
                                }
                              }),
                            onMouseOver: (function () {
                                if (hover) {
                                  return Curry._2(emit, /* MouseOver */1, range);
                                } else {
                                  return 0;
                                }
                              })
                          }, children);
              }),
            component[/* initialState */10],
            component[/* retainedProps */11],
            component[/* reducer */12],
            component[/* jsElementWrapped */13]
          ]);
}

var jsComponent = ReasonReact.wrapReasonForJs(component, (function (jsProps) {
        return make(jsProps.rangeGet, jsProps.jumpGet, jsProps.hoverGet, jsProps.emitGet, /* array */[]);
      }));

var answer = 43;

var noRange = /* NoRange */0;

exports.answer = answer;
exports.component = component;
exports.noRange = noRange;
exports.make = make;
exports.jsComponent = jsComponent;
/* component Not a pure module */