"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
// const { useState } = React;
var Chip_1 = require("@material-ui/core/Chip");
var styles_1 = require("@material-ui/core/styles");
var defaultFilterListStyles = {
    root: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
    },
    displayNone: {
        display: 'none',
    },
    chip: {
        margin: '8px 8px 8px 0px',
    },
};
// tslint:disable-next-line: variable-name
var _CustomFilterList = function (props) {
    var classes = props.classes, filters = props.filters, clearFilter = props.clearFilter;
    return (React.createElement("div", { className: classes.root }, 
    // Loop over the filter list and create filters based on key in the filter list component
    // then map them to the filters inside of the arrays (This method should be backwards compatible in case
    // we can switch to a future implementation utilizing the mui datatable component directly)
    Object.keys(filters).map(function (column, index) {
        var value = filters[column].value;
        var type = filters[column].type;
        if (value !== '' || type === 'isBlank' || type === 'notBlank') {
            var filter = filters[column].label + " " + filters[column].type + " " + filters[column].value;
            return (React.createElement(Chip_1.default, { key: index, className: classes.chip, label: filter, onDelete: function () { return clearFilter(column, props.filters, props.setFilter); } }));
        }
        return;
    })));
};
exports.CustomFilterList = styles_1.withStyles(defaultFilterListStyles, { name: 'MUIDataTableFilterList' })(_CustomFilterList);
//# sourceMappingURL=CustomFilterList.js.map