"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var useState = React.useState, useEffect = React.useEffect;
var __1 = require("../../../../../");
require("./NumberFilter.scss");
var numberOptions = [
    {
        value: '=',
        label: 'Equals',
    },
    {
        value: '!=',
        label: 'Does not equal',
    },
    {
        value: '>',
        label: 'Greater than',
    },
    {
        value: '>=',
        label: 'Greater than or equal to',
    },
    {
        value: '<',
        label: 'Less than',
    },
    {
        value: '<=',
        label: 'Less than or equal to',
    },
    {
        value: 'between',
        label: 'Between',
    },
];
exports.NumberFilter = function (props) {
    var _a = useState(''), filterText = _a[0], setFilterText = _a[1];
    var _b = useState(''), filterTextBetween = _b[0], setFilterTextBetween = _b[1];
    var _c = useState(numberOptions[0].value), filterOption = _c[0], setFilterOption = _c[1];
    /**
     * Set filter if there is a previous filter
     */
    useEffect(function () {
        for (var filter in props.filters) {
            // Check if column name equals the filter key and set values
            if (filter === props.columnName) {
                // If the filter type is between handle the special case by splitting the
                // value on the comma
                if (props.filters[filter].type === 'between') {
                    var split = props.filters[filter].value.split(',');
                    setFilterOption(props.filters[filter].type);
                    setFilterText(split[0]);
                    setFilterTextBetween(split[1]);
                }
                else {
                    setFilterOption(props.filters[filter].type);
                    setFilterText(props.filters[filter].value);
                }
            }
        }
    }, []);
    /**
     * Apply the filter to the table
     */
    var applyFilter = function () {
        if (filterText !== '' && filterOption !== 'between') {
            props.applyFilter(filterOption, filterText, props.columnName, props.columnLabel, props.filters, props.setFilter);
        }
        else if (filterText !== '' && filterOption === 'between' && filterTextBetween !== '') {
            var text = filterText + ',' + filterTextBetween;
            props.applyFilter(filterOption, text, props.columnName, props.columnLabel, props.filters, props.setFilter);
        }
        props.closeFilter();
    };
    /**
     * Clear the filter from the filter and the table
     */
    var clearFilter = function () {
        setFilterText('');
        setFilterOption('');
        props.clearFilter(props.columnName, props.filters, props.setFilter);
        props.closeFilter();
    };
    /**
     * Set the text for the filter only if the value is a number
     */
    var setText = function (event) {
        if (/^-?\d*\.?\d*$/.test(event.target.value))
            setFilterText(event.target.value);
    };
    /**
     * Set the text for the between filter if that's the selected option
     */
    var setTextBetween = function (event) {
        if (/^-?\d*\.?\d*$/.test(event.target.value))
            setFilterTextBetween(event.target.value);
    };
    return (React.createElement("div", { className: "column align-center numberFilter__column" },
        React.createElement(__1.Select, { onChange: function (value) { return setFilterOption(value); }, className: { container: "numberFilter__select" }, value: filterOption, disabled: props.equals, options: props.equals ? [numberOptions[0]] : numberOptions }),
        React.createElement(__1.Input, { placeholder: filterOption === 'between' ? 'start' : '', value: filterText, onChange: function (event) { return setText(event); }, className: { container: 'numberFilter__input m-t-0' } }),
        (filterOption === 'between') &&
            React.createElement(__1.Input, { placeholder: 'end', value: filterTextBetween, onChange: function (event) { return setTextBetween(event); }, className: { container: 'numberFilter__input m-t-0' } }),
        React.createElement("div", { className: "row numberFilter__buttonRow" },
            React.createElement(__1.Button, { onClick: applyFilter, className: 'numberFilter__button m-l-0' }, "Apply"),
            React.createElement(__1.Button, { onClick: clearFilter, className: 'numberFilter__button m-r-0' }, "Clear"))));
};
//# sourceMappingURL=NumberFilter.js.map