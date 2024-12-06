"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./IconCircle.scss");
/**
 * Component that includes an icon in a circle
 */
exports.IconCircle = function (props) {
    return (React.createElement("div", { className: "iconCircle " + (props.className ? props.className : ''), style: { backgroundColor: props.color } }, props.icon));
};
//# sourceMappingURL=IconCircle.js.map