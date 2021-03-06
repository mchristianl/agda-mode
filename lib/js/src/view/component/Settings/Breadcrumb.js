"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const classNames = require("classnames");
class Breadcrumb extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let tier1, tier2;
        const { path, param } = this.props.uri;
        switch (path) {
            case '/Connection':
                tier1 = React.createElement("li", null,
                    React.createElement("a", { href: '#' },
                        React.createElement("span", { className: 'icon icon-plug' }, "Connection")));
                break;
            case '/Protocol':
                tier1 = React.createElement("li", null,
                    React.createElement("a", { href: '#' },
                        React.createElement("span", { className: 'icon icon-comment-discussion' }, "Protocol")));
                break;
            case '/Protocol/*':
                tier1 = React.createElement("li", null,
                    React.createElement("a", { href: '#', onClick: this.props.navigate({ path: '/Protocol' }) },
                        React.createElement("span", { className: 'icon icon-comment-discussion' }, "Protocol")));
                tier2 = React.createElement("li", null,
                    React.createElement("a", { href: '#' },
                        React.createElement("span", { className: 'icon icon-comment' },
                            "#",
                            param)));
                break;
            default:
                tier1 = null;
                tier2 = null;
        }
        return (React.createElement("nav", { className: classNames('agda-settings-breadcrumb', this.props.className) },
            React.createElement("ol", { className: 'breadcrumb' },
                React.createElement("li", null,
                    React.createElement("a", { onClick: this.props.navigate({ path: '/' }), href: '#' },
                        React.createElement("span", { className: 'icon icon-settings' }, "Settings"))),
                tier1,
                tier2)));
    }
}
exports.default = Breadcrumb;
//# sourceMappingURL=Breadcrumb.js.map