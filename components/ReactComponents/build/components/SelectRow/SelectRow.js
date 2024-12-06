"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var memo = React.memo;
var __1 = require("../");
// tslint:disable-next-line: no-submodule-imports
var md_1 = require("react-icons/md");
require("./SelectRow.scss");
/**
 * A select row component (used to make selections in a list)
 */
exports.SelectRow = memo(function (props, ref) {
    /**
     * If the row with the input is the last row, we need to add a new one before recording event
     * @param value - value from input change event
     * @param isTarget - whether the field was the target field
     * @param addRow - function to add a new row
     * @param select - whether the select was used
     */
    var checkInput = function (value, addRow) {
        // Set target value
        if (props.onChange) {
            props.onChange(value);
            // See if we need to add a new row
            if (!!addRow)
                addRow();
        }
    };
    return (React.createElement("div", { className: "row " + (props.className ? props.className : '') },
        React.createElement("div", { className: 'column' },
            React.createElement(__1.Select, { disabled: props.disabled, value: props.value, onChange: function (value) { return checkInput(value, props.addRow); }, required: true, options: props.options, error: props.error })),
        !props.disabled &&
            React.createElement("div", { className: "selectRow__iconColumn" }, generateIcons(props.deleteRow, props.addRow))));
});
// HELPERS
/**
 * Generate the icons next to the field (if needed)
 * @param deleteRow - function used to delete the row
 * @param addRow - function used to add a new row
 */
var generateIcons = function (deleteRow, addRow) {
    // If add row function is provided, show add icon
    if (!!addRow)
        return React.createElement(md_1.MdAddCircle, { className: 'selectRow__addIcon', onClick: addRow });
    // Otherwise, if delete function is provided, show delete icon
    if (!!deleteRow)
        return React.createElement(md_1.MdCancel, { className: 'selectRow__deleteIcon', onClick: deleteRow });
    return;
};
//# sourceMappingURL=SelectRow.js.map