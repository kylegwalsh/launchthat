"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var core_1 = require("@material-ui/core");
require("./Radio.scss");
/**
 * A radio button
 */
exports.Radio = function (props) {
    return (React.createElement(core_1.Radio, { classes: { root: "radio " + (props.className ? props.className : ''), checked: 'radio--checked' }, checked: props.checked, value: props.value, onChange: props.onChange, disabled: props.disabled }));
};
//# sourceMappingURL=Radio.js.map