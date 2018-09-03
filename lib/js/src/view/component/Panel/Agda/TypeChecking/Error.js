"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const TypeError_1 = require("./TypeError");
class Error extends React.Component {
    render() {
        const { error, emacsMessage } = this.props;
        switch (error.kind) {
            case 'TypeError': return React.createElement(TypeError_1.default, { error: error.typeError, range: error.range, call: error.call, emacsMessage: emacsMessage });
            case 'Exception': return React.createElement("p", { className: "error" },
                emacsMessage,
                React.createElement("br", null));
            case 'IOException': return React.createElement("p", { className: "error" },
                emacsMessage,
                React.createElement("br", null));
            case 'PatternError': return React.createElement("p", { className: "error" }, "Pattern violation (you shouldn't see this)");
        }
    }
}
exports.default = Error;
//# sourceMappingURL=Error.js.map