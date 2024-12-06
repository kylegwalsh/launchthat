"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var memo = React.memo;
var __1 = require("../");
require("./SelectList.scss");
/**
 * A list of select options
 */
exports.SelectList = memo(function (props) {
    /**
     * Generate select rows
     */
    var generateRows = function () {
        // Make sure selections is set
        if (props.selections.length > 0) {
            // Return moveable category version
            return props.selections.map(function (selection, index) {
                return (React.createElement(__1.SelectRow, { key: selection.id, value: selection.value, error: selection.error, onChange: function (value) { return props.updateRow(index, value); }, deleteRow: index !== props.selections.length - 1 ? function () { return props.deleteRow(index); } : undefined, addRow: index === props.selections.length - 1 ? function () { return props.addRow(); } : undefined, options: props.options, disabled: props.disabled }));
            });
        }
        return;
    };
    return (React.createElement("div", { className: "row m-r-0 " + (props.className ? props.className : '') },
        React.createElement("div", { className: 'column' }, generateRows())));
});
//# sourceMappingURL=SelectList.js.map