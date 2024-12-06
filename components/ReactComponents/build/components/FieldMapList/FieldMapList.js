"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var PureComponent = React.PureComponent, createRef = React.createRef;
exports.PureComponent = PureComponent;
var components_1 = require("./components");
require("./FieldMapList.scss");
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
/**
 * A list of field map rows
 */
var FieldMapList = /** @class */ (function (_super) {
    __extends(FieldMapList, _super);
    function FieldMapList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            fieldMap: [],
            refs: [],
            count: 0,
            options: _this.props.options,
        };
        /**
         * Function used by parent to init the field map in this component
         */
        _this.initFieldMap = function (initialFieldMap) {
            var _a, _b;
            if (_this.props.useCategories) {
                var newFieldMap_1 = [];
                var refs_1 = [];
                var count_1 = 0;
                initialFieldMap.forEach(function (map) {
                    var _a, _b;
                    // Get the category name
                    var mapName = Object.keys(map)[0];
                    // Create an array to store the refs of the fields
                    var fieldsRefs = [];
                    // Create a fields array
                    var fields = [];
                    for (var _i = 0, _c = Object.values(map)[0]; _i < _c.length; _i++) {
                        var field = _c[_i];
                        fields.push(__assign({ id: count_1++ }, field));
                        // Create new reference for this field map row
                        fieldsRefs.push(createRef());
                    }
                    // Push an empty row for the selection
                    if (!_this.props.disabled && !_this.props.disableAdditions) {
                        fields.push({
                            id: count_1++,
                            target: "",
                            output: '',
                        });
                    }
                    // Push on the updated fields to out field map
                    newFieldMap_1.push((_a = {},
                        _a[mapName] = fields,
                        _a.id = count_1++,
                        _a));
                    // Create a ref map that is the same as the updated field map
                    refs_1.push((_b = {},
                        _b[mapName] = fieldsRefs,
                        _b.ref = createRef(),
                        _b));
                });
                if (!_this.props.disabled && !_this.props.disableAdditions) {
                    // Push on a blank category and category ref
                    newFieldMap_1.push((_a = {}, _a["blank_row" + (count_1 + 1)] = [{ id: count_1++, target: "" + (count_1 - 1), output: '' }], _a.id = count_1++, _a));
                    refs_1.push((_b = {}, _b["blank_row" + (count_1 - 1)] = [], _b.ref = createRef(), _b));
                }
                _this.setState({
                    fieldMap: newFieldMap_1,
                    count: count_1,
                    refs: refs_1,
                });
            }
            else {
                var newFieldMap = initialFieldMap.slice();
                var refs_2 = [];
                var count_2 = 0;
                newFieldMap.forEach(function (map) {
                    // Assign id
                    map.id = count_2++;
                    // Create new reference for this field map row
                    refs_2.push(createRef());
                });
                if (!_this.props.disabled && !_this.props.disableAdditions) {
                    // Add empty row to end
                    newFieldMap.push({
                        id: count_2++,
                        target: '',
                        output: '',
                    });
                }
                _this.setState({
                    fieldMap: newFieldMap,
                    count: count_2,
                    refs: refs_2,
                });
            }
        };
        /**
         * @param result - The result object of the drag and drop
         */
        _this.onDragEnd = function (result) {
            var temp = _this.state.fieldMap.slice(0);
            var tempRefs = _this.state.refs.slice(0);
            // dropped nowhere
            if (!result.destination) {
                return;
            }
            // The value for the source and destination from react beautiful dnd
            var source = result.source;
            var destination = result.destination;
            // did not move anywhere - can bail early
            if (source.droppableId === destination.droppableId &&
                source.index === destination.index) {
                return;
            }
            // reordering column
            if (result.type === 'COLUMN') {
                var reordered_1 = _this.reorder(temp, source.index, destination.index);
                var reorderedRefs_1 = _this.reorder(tempRefs, source.index, destination.index);
                _this.setState({ fieldMap: reordered_1, refs: reorderedRefs_1 });
                return;
            }
            // Create a reordered field maps
            var reordered = _this.reorderFieldMap(temp, source, destination);
            var reorderedRefs = _this.reorderFieldMap(tempRefs, source, destination, true);
            _this.setState({ fieldMap: reordered, refs: reorderedRefs });
        };
        /**
         * @param fieldMap - The fieldMap/refs we want to reorder
         * @param source - The source object from the react beautiful dnd
         * @param destination - The destination object from the react beautiful dnd
         * @param refs - A boolean to determine if we are operating on refs
         */
        _this.reorderFieldMap = function (fieldMap, source, destination, refs) {
            var _a, _b, _c, _d, _e, _f;
            // The array of the current field values
            var current = [];
            // Create a index to track the index of the current list inside of the fieldMap
            var currentIndex = -1;
            // Create an index to track the index of the next list inside of the fieldMap
            var nextIndex = -1;
            // An array of the next field values(Same as current if the lists are the same)
            var next = [];
            // Loop through the fieldmap to access the object values of the category for switching
            for (var i = 0; i < fieldMap.length; i++) {
                var categoryName = Object.keys(fieldMap[i])[0];
                if (categoryName === source.droppableId) {
                    currentIndex = i;
                    current = fieldMap[i][categoryName];
                }
                if (categoryName === destination.droppableId) {
                    nextIndex = i;
                    next = fieldMap[i][categoryName];
                }
            }
            // Get the target draggable item we are operating on
            var target = current[source.index];
            // If you are dropping the items inside of the same list
            if (source.droppableId === destination.droppableId) {
                // Reorder the current list with the reorder function
                var reordered = _this.reorder(current, source.index, destination.index);
                var categoryObject = void 0;
                // If it's a ref set a special object
                if (refs) {
                    // Create the object for the refs
                    categoryObject = (_a = {},
                        _a[source.droppableId] = reordered,
                        _a.ref = fieldMap[currentIndex].ref,
                        _a);
                }
                else {
                    // Create an new object with the reordered list
                    categoryObject = (_b = {},
                        _b[source.droppableId] = reordered,
                        _b.id = fieldMap[currentIndex].id,
                        _b);
                }
                // Set the fieldmap with the current index equal to the new object
                fieldMap[currentIndex] = categoryObject;
                return fieldMap;
            }
            // Remove the target element from the current list
            current.splice(source.index, 1);
            // Add the target element to the next list
            next.splice(destination.index, 0, target);
            var categoryObjectCurrent;
            var categoryObjectNext;
            if (refs) {
                // Create a new category object to update the current list for refs
                categoryObjectCurrent = (_c = {},
                    _c[source.droppableId] = current,
                    _c.ref = fieldMap[currentIndex].ref,
                    _c);
                // Create a new category object to update the next list for refs
                categoryObjectNext = (_d = {},
                    _d[destination.droppableId] = next,
                    _d.ref = fieldMap[nextIndex].ref,
                    _d);
            }
            else {
                // Create a new category object to update the current list
                categoryObjectCurrent = (_e = {},
                    _e[source.droppableId] = current,
                    _e.id = fieldMap[currentIndex].id,
                    _e);
                // Create a new category object to update the next list
                categoryObjectNext = (_f = {},
                    _f[destination.droppableId] = next,
                    _f.id = fieldMap[nextIndex].id,
                    _f);
            }
            // Update the fieldMap
            fieldMap[currentIndex] = categoryObjectCurrent;
            fieldMap[nextIndex] = categoryObjectNext;
            return fieldMap;
        };
        /**
         * @param list - a list to reorder
         * @param startIndex - the index where the element is coming from
         * @param endIndex -  the index where the element should end
         */
        _this.reorder = function (list, startIndex, endIndex) {
            var result = Array.from(list);
            var removed = result.splice(startIndex, 1)[0];
            result.splice(endIndex, 0, removed);
            return result;
        };
        /**
         * Retrieve all values for parent
         */
        _this.retrieveFieldMap = function () {
            var _a;
            // Intialize a new field map
            var formattedFieldMap = [];
            // Check if you are using categories
            if (_this.props.useCategories) {
                // Loop through the categories inside of the ref array
                for (var _i = 0, _b = _this.state.refs; _i < _b.length; _i++) {
                    var category = _b[_i];
                    // Set the name of the category from the category object
                    var categoryName = Object.keys(category)[0];
                    // Intialize the new fields
                    var formattedFields = [];
                    // Loop through the refs inside of each category
                    for (var _c = 0, _d = category[categoryName]; _c < _d.length; _c++) {
                        var ref = _d[_c];
                        formattedFields.push(ref.current.getValues());
                    }
                    // Set the new variables
                    var categoryValue = category.ref.current.getValues().category;
                    var idValue = category.ref.current.getValues().id;
                    // Push on the formatted variables to the field map if the category is not empty and has children
                    if (categoryValue !== '' || category[categoryName].length !== 0) {
                        formattedFieldMap.push((_a = {},
                            _a[categoryValue] = formattedFields,
                            _a.id = idValue,
                            _a));
                    }
                }
                return formattedFieldMap;
            }
            else {
                for (var _e = 0, _f = _this.state.refs; _e < _f.length; _e++) {
                    var ref = _f[_e];
                    // @ts-ignore
                    formattedFieldMap.push(ref.current.getValues());
                }
                console.log('Formatted in list', formattedFieldMap);
                return formattedFieldMap;
            }
        };
        /**
         * Generate field map rows
         */
        // @ts-ignore
        _this.generateRows = function () {
            // Make sure field map is set
            if (_this.state.fieldMap.length > 0) {
                // Return moveable category version
                if (_this.props.useCategories) {
                    // Use a short hand variable 
                    var categories_1 = _this.state.fieldMap;
                    // Set the length of the categories
                    var categoriesLength_1 = categories_1.length;
                    return (React.createElement(react_beautiful_dnd_1.DragDropContext, { onDragEnd: _this.onDragEnd },
                        React.createElement(react_beautiful_dnd_1.Droppable, { droppableId: 'board', type: 'COLUMN', direction: 'vertical' }, function (provided) { return (React.createElement("div", __assign({ ref: provided.innerRef }, provided.droppableProps),
                            categories_1.map(function (category, catIndex) {
                                // Set the category name
                                var categoryName = Object.keys(category)[0];
                                // Check for any errors in the category
                                var error;
                                if (_this.props.errors)
                                    error = _this.props.errors[category.id];
                                // Create the field map column that represents a category
                                return (React.createElement(components_1.FieldMapColumn, { labels: _this.props.labels, index: catIndex, key: category.id, id: category.id, error: error, isDragDisabled: _this.props.disabled || false, disabled: _this.props.disabled, disabledAdditions: _this.props.disableAdditions, ref: _this.state.refs[catIndex] ? _this.state.refs[catIndex].ref : undefined, category: categoryName, deleteCategory: catIndex !== categoriesLength_1 - 1 ? function () { return _this.deleteCategory(catIndex); } : undefined, addCategory: catIndex === categoriesLength_1 - 1 ? _this.addCategory : undefined },
                                    React.createElement(react_beautiful_dnd_1.Droppable, { droppableId: categoryName === '' ? 'blank row' : categoryName, type: 'FIELDS' }, function (dropProvided, dropSnapshot) { return (React.createElement("div", __assign({ className: "fieldMapList__wrapper " + (dropSnapshot.isDraggingOver ? 'fieldMapList__wrapper--isDraggingOver' : '') }, dropProvided.droppableProps),
                                        React.createElement("div", { ref: dropProvided.innerRef },
                                            category[categoryName].map(function (row, index) {
                                                // Set the fields and determine there length
                                                var fields = category[categoryName];
                                                var fieldLength = fields.length;
                                                // Check to see if the row should be draggable or not
                                                var notDraggable = false;
                                                if (index === fieldLength - 1)
                                                    notDraggable = true;
                                                // Check for errors of the field
                                                var error;
                                                if (_this.props.errors)
                                                    error = _this.props.errors[row.id];
                                                return (React.createElement(components_1.FieldMapRowDraggable, { key: row.id, ref: _this.state.refs[catIndex][categoryName][index], disableAll: _this.props.disabled, disabled: row.disabled, disableAdditions: _this.props.disableAdditions, isDragDisabled: _this.props.disabled || notDraggable, draggingOver: dropSnapshot.isDraggingOver, id: row.id, index: index, autofillOff: _this.props.autofillOff, category: categoryName, target: row.target, output: row.output, errors: error, showLabel: index === 0, deleteRow: _this.props.disabled ? undefined
                                                        : (index !== fieldLength - 1 ? function () { return _this.deleteRow(index, categoryName); } : undefined), addRow: _this.props.disabled ? undefined
                                                        : (index === fieldLength - 1 ? function () { return _this.addRow(categoryName); } : undefined), options: _this.props.options }));
                                            }),
                                            dropProvided.placeholder))); })));
                            }),
                            provided.placeholder)); })));
                }
                // Return normal static version
                else {
                    return _this.state.fieldMap.map(function (row, index) {
                        // Set any errors
                        console.log('Tried to generate the field maps without categories');
                        var error;
                        if (_this.props.errors)
                            error = _this.props.errors[row.id];
                        return (React.createElement(components_1.FieldMapRow, { key: row.id, ref: _this.state.refs[index], disableAll: _this.props.disabled, disableAdditions: _this.props.disableAdditions, disabled: row.disabled, id: row.id, labels: _this.props.labels, target: row.target, autofillOff: _this.props.autofillOff, output: row.output, errors: error, showLabel: index === 0, deleteRow: _this.props.disabled ? undefined
                                : (index !== _this.state.fieldMap.length - 1 ? function () { return _this.deleteRow(index); } : undefined), addRow: _this.props.disabled ? undefined : (index === _this.state.fieldMap.length - 1 ? function () { return _this.addRow(); } : undefined), options: _this.props.options }));
                    });
                }
            }
        };
        /**
         * Add a category to the field map
         */
        _this.addCategory = function () {
            var _a, _b;
            // Intialize placeholder variables
            var newFieldMap = _this.state.fieldMap.slice();
            var newRefs = _this.state.refs.slice();
            var newField = { id: _this.state.count + 1, target: "" + (_this.state.count + 1), output: '' };
            // Add an empty row with a blank row category name
            newFieldMap.push((_a = {},
                _a["blank_row" + (_this.state.count + 2)] = [newField],
                _a.id = _this.state.count + 2,
                _a));
            // Create the ref to match the new category
            newRefs.push((_b = {},
                _b["blank_row" + (_this.state.count + 2)] = [],
                _b.ref = createRef(),
                _b));
            _this.setState({ fieldMap: newFieldMap, refs: newRefs, count: _this.state.count + 2 });
        };
        /**
         * A function that is used to remove a category
         * @param index - the index of the category that needs to be deleted
         */
        _this.deleteCategory = function (index) {
            // Intialize placeholder variables
            var newFieldMap = _this.state.fieldMap.slice();
            var newRefs = _this.state.refs.slice();
            // Splice the category and the ref from there arrays
            newFieldMap.splice(index, 1);
            newRefs.splice(index, 1);
            _this.setState({ fieldMap: newFieldMap, refs: newRefs });
        };
        /**
         * Function used to delete a row of data in the field map
         * @param index - which row to delete
         * @param category - The category which the row should be deleted from
         */
        _this.deleteRow = function (index, category) {
            // Check to see if we are using categories
            if (_this.props.useCategories && category) {
                // Create placeholder variables
                var newFieldMap = _this.state.fieldMap.slice();
                var newRefs = _this.state.refs.slice();
                // Find the category by name and splice the result from the refs and categories
                for (var i = 0; i < newFieldMap.length; i++) {
                    var categoryName = Object.keys(newFieldMap[i])[0];
                    if (categoryName === category) {
                        newFieldMap[i][category].splice(index, 1);
                        newRefs[i][category].splice(index, 1);
                    }
                }
                _this.setState({ fieldMap: newFieldMap, refs: newRefs });
            }
            else {
                var newFieldMap = _this.state.fieldMap.slice();
                var newRefs = _this.state.refs;
                newFieldMap.splice(index, 1);
                newRefs.splice(index, 1);
                _this.setState({ fieldMap: newFieldMap, refs: newRefs });
            }
        };
        /**
         * Add a row to either a category or just the field map if your not using categories
         * @param category - The category which the row should be added to
         */
        _this.addRow = function (category) {
            // Check to see if you are using categories
            if (_this.props.useCategories) {
                // Create placeholder variables
                var newFieldMap = _this.state.fieldMap.slice();
                var newRefs = _this.state.refs.slice();
                // Find the category by name, add a new category and ref
                for (var i = 0; i < newFieldMap.length; i++) {
                    // Set the category name for comparison
                    var categoryName = Object.keys(newFieldMap[i])[0];
                    if (categoryName === category) {
                        // If the name matches the one we want to add to push a new row to the field map
                        newFieldMap[i][category].push({
                            id: _this.state.count + 1,
                            target: "",
                            output: '',
                        });
                        newRefs[i][category].push(createRef());
                        _this.setState({ fieldMap: newFieldMap, refs: newRefs, count: _this.state.count + 1 });
                        break;
                    }
                }
            }
            else {
                var newFieldMap = _this.state.fieldMap.slice();
                var newRefs = _this.state.refs.slice();
                // Add empty row
                newFieldMap.push({
                    id: _this.state.count + 1,
                    target: '',
                    output: '',
                });
                // @ts-ignore
                newRefs.push(createRef());
                _this.setState({ fieldMap: newFieldMap, refs: newRefs, count: _this.state.count + 1 });
            }
        };
        return _this;
    }
    FieldMapList.prototype.render = function () {
        return (React.createElement("div", { className: "row m-r-0 " + (this.props.className ? this.props.className : '') },
            React.createElement("div", { className: 'column' }, this.generateRows())));
    };
    return FieldMapList;
}(PureComponent));
exports.FieldMapList = FieldMapList;
//# sourceMappingURL=FieldMapList.js.map