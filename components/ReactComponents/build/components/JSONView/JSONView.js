"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./JSONView.scss");
require("../Input/Input.scss");
var __1 = require("../");
var react_json_view_1 = require("react-json-view");
/**
 * A component to display JSON data in a nice format
 */
exports.JSONView = function (props) {
    return (React.createElement("div", { className: "input__container " + ((props.className && props.className.container) ? props.className.container : '') },
        props.label &&
            React.createElement(__1.Label, { text: props.label, required: props.required }),
        React.createElement("div", { className: "\n          input json\n          " + (!props.collapsibleRoot ? 'json__noCollapsibleRoot' : '') + "\n          " + (props.disabled ? 'json__disabled' : '') + "\n          " + ((props.className && props.className.input) ? props.className.input : '') + "        " },
            React.createElement(react_json_view_1.default, { enableClipboard: false, name: props.name, displayDataTypes: props.displayDataTypes, iconStyle: 'circle', src: props.data }))));
};
//# sourceMappingURL=JSONView.js.map