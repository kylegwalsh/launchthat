"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./CustomToolbarSelect.scss");
/**
 * A custom toolbar when items are selected for the table component
 */
exports.CustomToolbarSelect = function (props) {
    return (React.createElement("div", { className: "customToolbarSelect " + (props.className ? props.className : '') }, props.children));
};
// HELPERS
//# sourceMappingURL=CustomToolbarSelect.js.map