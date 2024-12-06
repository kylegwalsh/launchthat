"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var __1 = require("../");
// tslint:disable-next-line: no-submodule-imports
var md_1 = require("react-icons/md");
require("./Input.scss");
/**
 * An input component
 */
exports.Input = function (props) {
    return (React.createElement("div", { className: "input__container " + ((props.className && props.className.container) ? props.className.container : '') },
        props.label &&
            React.createElement(__1.Label, { text: props.label, required: props.required }),
        React.createElement("div", { className: 'input__innerContainer' },
            React.createElement("input", { id: props.id, className: "\n            input\n            " + ((props.className && props.className.input) ? props.className.input : '') + "\n            " + (props.error ? 'error' : '') + "\n            " + (props.info ? 'input__infoApplied' : '') + "\n          ", value: props.value, onChange: props.onChange, placeholder: props.placeholder, readOnly: props.readOnly, disabled: props.disabled, maxLength: props.maxLength, autoComplete: props.autoComplete === 'off' ? 'new-password' : props.autoComplete, autoFocus: props.autoFocus, required: props.required, onBlur: props.onBlur, type: props.type }),
            props.info &&
                React.createElement("span", { className: 'input__infoWrapper', "data-tip": props.info },
                    React.createElement(md_1.MdInfoOutline, { className: 'input__info' }))),
        props.error &&
            React.createElement(__1.ErrorText, { text: props.error })));
};
//# sourceMappingURL=Input.js.map