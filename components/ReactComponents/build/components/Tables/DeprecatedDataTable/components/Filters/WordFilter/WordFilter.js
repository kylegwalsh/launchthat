"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var useState = React.useState, useEffect = React.useEffect;
var __1 = require("../../../../../");
require("./WordFilter.scss");
var wordOptions = [
    {
        value: 'contains',
        label: 'Contains',
    },
    {
        value: 'equals',
        label: 'Equals',
    },
    {
        value: 'notContain',
        label: 'Does not contain',
    },
    {
        value: 'isBlank',
        label: 'Is blank',
    },
    {
        value: 'notBlank',
        label: 'Is not blank',
    },
];
exports.WordFilter = function (props) {
    var _a = useState(''), filterText = _a[0], setFilterText = _a[1];
    var _b = useState(wordOptions[0].value), filterOption = _b[0], setFilterOption = _b[1];
    /**
     * Check for previous filter on rerender
     */
    useEffect(function () {
        for (var filter in props.filters) {
            // If the filter key equals the column name set the values
            if (filter === props.columnName) {
                setFilterText(props.filters[filter].value);
                setFilterOption(props.filters[filter].type);
            }
        }
    }, []);
    /**
     * Apply the filter to the table
     */
    var applyFilter = function () {
        if (filterText !== '' || filterOption === 'isBlank' || filterOption === 'notBlank') {
            props.applyFilter(filterOption, filterText, props.columnName, props.columnLabel, props.filters, props.setFilter);
        }
        props.closeFilter();
    };
    /**
     * Clear the filter with the props that it was passed and in the local filter
     */
    var clearFilter = function () {
        setFilterText('');
        setFilterOption('');
        props.clearFilter(props.columnName, props.filters, props.setFilter);
        props.closeFilter();
    };
    /**
     * Set the filter text
     * @param event - The event pass by the input field
     */
    var setText = function (event) {
        setFilterText(event.target.value);
    };
    return (React.createElement("div", { className: "column align-center wordFilter__column" },
        React.createElement(__1.Select, { onChange: function (value) { return setFilterOption(value); }, className: { container: "wordFilter__select" }, value: filterOption, options: wordOptions }),
        React.createElement(__1.Input, { disabled: filterOption === 'isBlank' || filterOption === 'notBlank', value: filterText, onChange: function (event) { return setText(event); }, className: { container: 'wordFilter__input m-t-0' } }),
        React.createElement("div", { className: "row wordFilter__buttonRow" },
            React.createElement(__1.Button, { onClick: applyFilter, className: 'wordFilter__button m-l-0' }, "Apply"),
            React.createElement(__1.Button, { onClick: clearFilter, className: 'wordFilter__button m-r-0' }, "Clear"))));
};
//# sourceMappingURL=WordFilter.js.map