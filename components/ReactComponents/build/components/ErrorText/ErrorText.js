"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./ErrorText.scss");
/**
 * Red text used to denote errors
 */
exports.ErrorText = function (props) {
    return (React.createElement("label", { className: 'errorText' }, props.text));
};
//# sourceMappingURL=ErrorText.js.map