"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var core_1 = require("@material-ui/core");
require("./Button.scss");
/**
 * A basic button
 */
exports.Button = function (props) {
    return (React.createElement(core_1.Button, { disabled: props.disabled, onClick: props.onClick, className: "button " + (props.className ? props.className : '') }, props.children));
};
//# sourceMappingURL=Button.js.map