"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var useState = React.useState, useEffect = React.useEffect;
var core_1 = require("@material-ui/core");
var __1 = require("../");
// tslint:disable-next-line: no-submodule-imports
var md_1 = require("react-icons/md");
require("./CheckboxList.scss");
/**
 * A list of check boxes
 */
exports.CheckboxList = function (props) {
    // Track which rows are open (if they even exist)
    var _a = useState([]), rowsOpen = _a[0], setRowsOpen = _a[1];
    /**
     * Initialize row state when component mounts
     */
    useEffect(function () {
        // New row tracking object
        var newRowsOpen = [];
        // Initialize array of closed rows (insert false)
        props.values.forEach(function (value) {
            newRowsOpen.push(false);
        });
        // Set state
        setRowsOpen(newRowsOpen);
    }, []);
    /**
     * Function to change open state of each item's row
     * @param index - index of row that was clicked
     */
    var onRowClick = function (index) {
        // New row tracking object
        var newRowsOpen = rowsOpen.slice();
        // Change row's open state
        newRowsOpen[index] = !newRowsOpen[index];
        // Update state
        setRowsOpen(newRowsOpen);
    };
    /**
     * Generate list of check boxes
     */
    var generateList = function () {
        return props.values.map(function (value, index) {
            return (React.createElement("div", { key: index, className: 'checkboxList__columnWrapper' },
                React.createElement("div", { className: "checkboxList__rowWrapper " + (props.className && props.className.row ? props.className.row : '') },
                    React.createElement(core_1.FormControlLabel, { label: value.label, control: React.createElement(__1.Checkbox, { radioStyle: props.radioStyle, className: "" + (props.className && props.className.checkBox ? props.className.checkBox : ''), checked: value.checked, onChange: props.onChange, value: value.value, disabled: props.disabled }) }),
                    React.createElement("div", { className: 'checkboxList__right' },
                        value.chip &&
                            React.createElement(__1.Chip, { className: 'checkboxList__chip', type: value.chip.type, label: value.chip.label }),
                        value.row && rowsOpen.length &&
                            React.createElement(md_1.MdKeyboardArrowDown, { className: "checkboxList__arrow checkboxList__arrow--" + (rowsOpen[index] ? 'open' : 'closed'), onClick: function () { return onRowClick(index); } }))),
                React.createElement("div", { className: "checkboxList__expandableRow checkboxList__expandableRow--" + (rowsOpen[index] ? 'open' : 'closed') }, props.values[index].row)));
        });
    };
    return (React.createElement("div", null,
        React.createElement(core_1.FormControl, { component: 'div', className: "checkboxList " + (props.className && props.className.formControl ? props.className.formControl : '') + " formControl" },
            props.label && React.createElement(__1.Label, { text: props.label }),
            React.createElement(core_1.FormGroup, null, generateList()))));
};
//# sourceMappingURL=CheckboxList.js.map