"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var core_1 = require("@material-ui/core");
require("./Checkbox.scss");
// tslint:disable-next-line: no-submodule-imports
var RadioButtonUnchecked_1 = require("@material-ui/icons/RadioButtonUnchecked");
// tslint:disable-next-line: no-submodule-imports
var RadioButtonChecked_1 = require("@material-ui/icons/RadioButtonChecked");
/**
 * A checkbox component
 */
exports.Checkbox = function (props) {
    return (React.createElement(core_1.Checkbox, { icon: props.radioStyle && React.createElement(RadioButtonUnchecked_1.default, null), checkedIcon: props.radioStyle && React.createElement(RadioButtonChecked_1.default, null), className: "checkBox\n        " + (props.className && props.className ? props.className : '') + "\n        " + (props.checked ? 'checkBox--checked' : '') + "\n      ", checked: props.checked, onChange: props.onChange, value: props.value, disabled: props.disabled }));
};
//# sourceMappingURL=Checkbox.js.map