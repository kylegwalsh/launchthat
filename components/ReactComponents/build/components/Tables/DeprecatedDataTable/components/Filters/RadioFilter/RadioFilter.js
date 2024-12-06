"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var useState = React.useState, useEffect = React.useEffect;
var __1 = require("../../../../..");
require("./RadioFilter.scss");
exports.RadioFilter = function (props) {
    var _a = useState(''), filterValue = _a[0], setFilterValue = _a[1];
    /**
     * On the first filter render check if filters are applied
     */
    useEffect(function () {
        for (var filter in props.filters) {
            // If the filter key is equal to the column name set the value
            if (filter === props.columnName) {
                setFilterValue(props.filters[filter].value);
            }
        }
    }, []);
    /**
     * Handle change in values for
     * @param value - value of endpoint clicked
     */
    var setValue = function (value) {
        // Initialize a new selection object
        setFilterValue(value);
    };
    /**
     * Apply the filter to the table with the right props
     */
    var applyFilter = function () {
        // Apply the final filter value if there is one
        if (filterValue.length)
            props.applyFilter('equals', filterValue, props.columnName, props.columnLabel, props.filters, props.setFilter);
        props.closeFilter();
    };
    /**
     * Clear the filter from the table
     */
    var clearFilter = function () {
        props.clearFilter(props.columnName, props.filters, props.setFilter);
        props.closeFilter();
    };
    return (React.createElement("div", { className: "column align-center radioFilter__column" },
        React.createElement(__1.RadioList, { value: filterValue, className: { radio: 'radioFilter__radio', formControl: 'radioFilter__checkboxList' }, onChange: function (event) { return setValue(event.target.value); }, options: props.filterValues }),
        React.createElement("div", { className: "row radioFilter__buttonRow" },
            React.createElement(__1.Button, { onClick: applyFilter, className: 'radioFilter__button m-l-0' }, "Apply"),
            React.createElement(__1.Button, { onClick: clearFilter, className: 'radioFilter__button m-r-0' }, "Clear"))));
};
//# sourceMappingURL=RadioFilter.js.map