"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var core_1 = require("@material-ui/core");
var __1 = require("../");
require("./RadioList.scss");
/**
 * A list of radio buttons
 */
exports.RadioList = function (props) {
    /**
     * Generate a list of radios
     */
    var generateList = function () {
        return props.options.map(function (option, index) {
            return (React.createElement(core_1.FormControlLabel, { label: option.label, key: index, value: option.value, control: React.createElement(__1.Radio, { className: "" + (props.className && props.className.radio ? props.className.radio : ''), checked: props.value === option.value, value: option.value, disabled: props.disabled }) }));
        });
    };
    return (React.createElement(core_1.FormControl
    // @ts-ignore
    , { 
        // @ts-ignore
        component: 'fieldset', className: "radioList " + (props.className && props.className.formControl ? props.className.formControl : '') },
        props.label && React.createElement(__1.Label, { text: props.label }),
        React.createElement(core_1.RadioGroup, { className: "radioList__radioGroup " + (props.className && props.className.radioGroup ? props.className.radioGroup : ''), value: props.value, onChange: props.onChange }, generateList())));
};
//# sourceMappingURL=RadioList.js.map