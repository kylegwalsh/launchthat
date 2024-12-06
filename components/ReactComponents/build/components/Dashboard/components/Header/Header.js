"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
require("./Header.scss");
/**
 * The header of the dashboard
 */
var HeaderBase = function (props) {
    return (React.createElement("div", { className: "header primaryColor " + (props.className ? props.className : '') },
        React.createElement(react_router_dom_1.Link, { to: props.defaultRoute || '/', className: 'header__logo' },
            React.createElement("img", { src: props.logo, className: 'header__logo__image' })),
        props.otherComponents &&
            props.otherComponents));
};
// Attach router to add navigation functions
/**
 * The header of the dashboard
 */
exports.Header = react_router_dom_1.withRouter(HeaderBase);
//# sourceMappingURL=Header.js.map