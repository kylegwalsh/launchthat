"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var useState = React.useState, memo = React.memo, forwardRef = React.forwardRef, useImperativeHandle = React.useImperativeHandle;
var __1 = require("../../../");
// tslint:disable-next-line: no-submodule-imports
var md_1 = require("react-icons/md");
require("./FieldMapRow.scss");
/**
 * A field map row component (used to map inputs to outputs)
 */
exports.FieldMapRow = memo(forwardRef(function (props, ref) {
    // Manage values locally
    // @ts-ignore
    var _a = useState(props.id), id = _a[0], setId = _a[1];
    var _b = useState(props.target), target = _b[0], setTarget = _b[1];
    var _c = useState(props.output), output = _c[0], setOutput = _c[1];
    useImperativeHandle(ref, function () { return ({
        getValues: function () {
            var values = { target: target, output: output };
            if (id !== undefined)
                values.id = id;
            return values;
        },
    }); }, [id, target, output]);
    /**
     * If the row with the input is the last row, we need to add a new one before recording event
     * @param value - value from input change event
     * @param isTarget - whether the field was the target field
     * @param addRow - function to add a new row
     * @param select - whether the select was used
     */
    var checkInput = function (value, isTarget, addRow) {
        // Set output value
        if (!isTarget)
            setOutput(value);
        // Set target value
        if (isTarget) {
            setTarget(value);
            // Pre-populate output if it was empty
            // Remove the auto populate feature
            if (!output && props.options && !props.autofillOff)
                setOutput(value);
        }
        // See if we need to add a new row
        if (!!addRow && !props.disableAdditions) {
            addRow();
        }
    };
    return (React.createElement("div", { className: "row " + (props.className ? props.className : '') },
        React.createElement("div", { className: 'column' },
            props.options &&
                React.createElement(__1.Select, { label: props.showLabel ? (props.labels && props.labels.target) ? props.labels.target : 'Input' : undefined, value: target, disabled: props.disableAll || (props.disabled && props.disabled.target), onChange: function (value) { return checkInput(value, true, props.addRow); }, options: props.options, error: props.errors ? props.errors.target : undefined }),
            !props.options &&
                React.createElement(__1.Input, { label: props.showLabel ? (props.labels && props.labels.target) ? props.labels.target : 'Input' : undefined, disabled: props.disableAll || (props.disabled && props.disabled.target), value: target, onChange: function (event) { return checkInput(event.target.value, true, props.addRow); }, error: props.errors ? props.errors.target : undefined })),
        React.createElement("div", { className: 'column' },
            React.createElement(__1.Input, { label: props.showLabel ? (props.labels && props.labels.output) ? props.labels.output : 'Output' : undefined, disabled: props.disableAll || (props.disabled && props.disabled.output), value: output, onChange: function (event) { return checkInput(event.target.value, false, props.addRow); }, error: props.errors ? props.errors.output : undefined })),
        !props.disableAdditions &&
            React.createElement("div", { className: "fieldMapRow__iconColumn " + (props.showLabel ? 'fieldMapRow__iconColumn__iconEnd' : '') }, generateIcons(props.deleteRow, props.addRow))));
}));
// HELPERS
/**
 * Generate the icons next to the field (if needed)
 * @param deleteRow - function used to delete the row
 * @param addRow - function used to add a new row
 */
// @ts-ignore
var generateIcons = function (deleteRow, addRow) {
    // If add row function is provided, show add icon
    if (!!addRow)
        return React.createElement(md_1.MdAddCircle, { className: 'fieldMapRow__addIcon', onClick: addRow });
    // Otherwise, if delete function is provided, show delete icon
    if (!!deleteRow)
        return React.createElement(md_1.MdCancel, { className: 'fieldMapRow__deleteIcon', onClick: deleteRow });
};
//# sourceMappingURL=FieldMapRow.js.map