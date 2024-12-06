"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var useState = React.useState, memo = React.memo, forwardRef = React.forwardRef, useImperativeHandle = React.useImperativeHandle;
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
require("./FieldMapColumn.scss");
var __1 = require("../../../");
// tslint:disable-next-line: no-submodule-imports
var md_1 = require("react-icons/md");
exports.FieldMapColumn = memo(forwardRef(function (props, ref) {
    var index = props.index;
    // @ts-ignore
    var _a = useState(props.id), id = _a[0], setId = _a[1];
    var _b = useState(props.category.includes('blank_row') ? '' : props.category), category = _b[0], setCategory = _b[1];
    useImperativeHandle(ref, function () { return ({
        getValues: function () {
            console.log(category);
            var values = { category: category };
            if (id !== undefined)
                values.id = id;
            return values;
        },
    }); }, [category, id]);
    /**
     * If the row with the input is the last row, we need to add a new one before recording event
     * @param value - value from input change event
     * @param isTarget - whether the field was the target field
     * @param addRow - function to add a new row
     * @param select - whether the select was used
     */
    var checkInput = function (value) {
        // Set the value of the category
        setCategory(value);
    };
    /**
     * Generate the icons next to the field (if needed)
     * @param deleteRow - function used to delete the row
     * @param addRow - function used to add a new row
     */
    // @ts-ignore
    var generateIcons = function (deleteCategory, addCategory) {
        // If add row function is provided, show add icon
        if (!!addCategory)
            return React.createElement(md_1.MdAddCircle, { className: 'fieldMapColumn__addIcon', onClick: addCategory });
        // Otherwise, if delete function is provided, show delete icon
        if (!!deleteCategory)
            return React.createElement(md_1.MdCancel, { className: 'fieldMapColumn__deleteIcon', onClick: deleteCategory });
    };
    return (React.createElement(react_beautiful_dnd_1.Draggable, { isDragDisabled: props.isDragDisabled, key: props.id, draggableId: props.category, index: index }, function (provided, snapshot) { return (React.createElement("div", __assign({ key: props.id, className: 'fieldMapColumn__container', ref: provided.innerRef }, provided.draggableProps),
        React.createElement("div", { className: "fieldMapColumn__header " + (snapshot.isDragging ? 'fieldMapColumn__header--isDragging' : '') },
            React.createElement("div", __assign({}, provided.dragHandleProps, { className: "fieldMapColumn__iconColumn" }),
                React.createElement(md_1.MdDragHandle, { className: "fieldMapColumn__dragIcon" })),
            React.createElement("div", __assign({ className: "fieldMapColumn__inputWrapper" }, provided.dragHandleProps),
                React.createElement(__1.Input, { value: category, disabled: props.disabled, placeholder: 'Add in a category', className: { container: "fieldMapColumn__titleInputContainer", input: "fieldMapColumn__title" }, onChange: function (event) { return checkInput(event.target.value); }, error: props.error ? props.error : undefined })),
            (!props.disabled || !props.disabledAdditions) &&
                React.createElement("div", { className: "fieldMapColumn__iconColumn" }, generateIcons(props.deleteCategory, props.addCategory))),
        React.createElement(React.Fragment, null,
            React.createElement("div", { className: 'fieldMapColumn__labelWrapper' },
                React.createElement("div", { className: 'row' },
                    React.createElement("div", { className: "fieldMapColumn__iconColumn" },
                        React.createElement(md_1.MdDragHandle, { className: "fieldMapColumn__dragIcon fieldMapColumn__iconNotVisible" })),
                    React.createElement("div", { className: 'column' },
                        React.createElement(__1.Label, { className: 'fieldMapColumn__label', text: props.labels && props.labels.target ? props.labels.target : 'Input' })),
                    React.createElement("div", { className: 'column' },
                        React.createElement(__1.Label, { className: 'fieldMapColumn__label', text: props.labels && props.labels.output ? props.labels.output : 'Output' })),
                    React.createElement("div", { className: "fieldMapColumn__iconColumn" },
                        React.createElement(md_1.MdAddCircle, { className: "fieldMapColumn__addIcon fieldMapColumn__iconNotVisible" })))),
            // The items that appear in the list of draggable rows
            props.children))); }));
}));
//# sourceMappingURL=FieldMapColumn.js.map