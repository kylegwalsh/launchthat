"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var __1 = require("../");
var react_select_1 = require("react-select");
require("../Input/Input.scss");
require("./Select.scss");
/**
 * A select input
 */
exports.Select = function (props) {
    var selectedOption;
    // If a value is selected, determine which option it matches
    if (props.value) {
        for (var i = 0; i < props.options.length; i++) {
            if (props.options[i].value === props.value) {
                selectedOption = props.options[i];
                break;
            }
        }
    }
    /**
     * Return value to onChange function
     * @param option - the option from the select component
     */
    var onChange = function (option) {
        if (props.onChange)
            props.onChange(option.value);
    };
    return (React.createElement("div", { className: "input__container " + ((props.className && props.className.container) ? props.className.container : '') },
        props.label &&
            React.createElement(__1.Label, { text: props.label, required: props.required }),
        React.createElement(react_select_1.default, { className: "\n          select\n          " + ((props.className && props.className.input) ? props.className.input : '') + "\n          " + (props.error ? 'error' : '') + "\n        ", value: selectedOption, 
            // @ts-ignore
            onChange: onChange, isDisabled: props.disabled, autoFocus: props.autoFocus, options: props.options, isSearchable: props.search, isMulti: props.multi, inputId: props.id, onBlur: props.onBlur, classNamePrefix: 'select', placeholder: props.placeholder }),
        props.error &&
            React.createElement(__1.ErrorText, { text: props.error })));
};
//# sourceMappingURL=Select.js.map