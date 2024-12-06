"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_toggle_1 = require("react-toggle");
require("./Toggle.scss");
/**
 * A toggle component to change the active status of something
 */
exports.Toggle = function (props) {
    return (React.createElement("div", { className: "toggle__container " + (props.className ? props.className : '') },
        props.label &&
            React.createElement("label", { className: 'toggle__label' }, props.label),
        React.createElement("div", { className: 'toggle__innerContainer' },
            React.createElement(react_toggle_1.default, { checked: props.value, icons: false, onChange: props.onClick, disabled: props.disabled }))));
};
//# sourceMappingURL=Toggle.js.map