"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./CustomRowRender.scss");
/**
 * A custom toolbar when items are selected for the table component
 */
exports.customRowRender = function (props) {
    return (React.createElement("div", { className: "customRowRender " + (props.className ? props.className : '') }, props.children));
};
// HELPERS
//# sourceMappingURL=CustomRowRender.js.map