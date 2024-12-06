"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./Label.scss");
exports.Label = function (props) {
    return (React.createElement("label", { className: "label " + (props.className ? props.className : '') },
        props.text,
        " ",
        props.required && React.createElement("span", { className: 'label__required' }, "*")));
};
//# sourceMappingURL=Label.js.map