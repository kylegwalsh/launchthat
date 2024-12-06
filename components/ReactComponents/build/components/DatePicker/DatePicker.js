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
var useState = React.useState;
// tslint:disable-next-line: no-submodule-imports
require("react-dates/initialize");
// tslint:disable-next-line: no-submodule-imports
require("react-dates/lib/css/_datepicker.css");
var react_dates_1 = require("react-dates");
var moment = require("moment");
var PresetDateRanges_1 = require("./components/PresetDateRanges/PresetDateRanges");
require("./DatePicker.scss");
;
/**
 * A generic date picker component
 */
exports.DatePicker = function (props) {
    var _a = useState(null), focusedInput = _a[0], setFocusedInput = _a[1];
    /**
     * Set focused input when focused
     * @param focus
     */
    var onFocusChange = function (focus) {
        setFocusedInput(focus);
    };
    var renderPresets = function () {
        return (React.createElement(PresetDateRanges_1.PresetDateRanges, { setFocusedInput: setFocusedInput, startDate: props.startDate, endDate: props.endDate, onDatesChange: props.onDatesChange }));
    };
    return (React.createElement(react_dates_1.DateRangePicker, __assign({}, props, { noBorder: true, showClearDates: props.showClearDates, renderCalendarInfo: renderPresets, minimumNights: 0, focusedInput: focusedInput, startDate: props.startDate, isOutsideRange: function (day) { return (moment.utc().diff(day) < 0) || moment.utc().isSame(day, 'day'); }, startDateId: props.startDateId ? props.startDateId : 'start-date', endDateId: props.endDateId ? props.endDateId : 'end-date', endDate: props.endDate, onDatesChange: function (_a) {
            var startDate = _a.startDate, endDate = _a.endDate;
            return props.onDatesChange(startDate, endDate);
        }, onFocusChange: onFocusChange })));
};
//# sourceMappingURL=DatePicker.js.map