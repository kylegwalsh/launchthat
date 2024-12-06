"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./PresetDateRanges.scss");
var moment = require("moment");
var __1 = require("../../../");
;
var today = moment.utc().subtract(1, 'days');
var defaultDateRanges = [
    {
        text: 'Last Week',
        startDate: moment.utc().subtract(1, 'weeks').startOf('week'),
        endDate: moment.utc().subtract(1, 'weeks').endOf('week'),
    },
    {
        text: 'Last Month',
        startDate: moment.utc().subtract(1, 'months').startOf('months'),
        endDate: moment.utc().subtract(1, 'months').endOf('month'),
    },
    {
        text: 'This Month',
        startDate: moment.utc().startOf('month'),
        endDate: today,
    },
    {
        text: 'Past 7 Days',
        startDate: moment.utc().subtract(8, 'days'),
        endDate: today,
    },
    {
        text: 'Past 30 Days',
        startDate: moment.utc().subtract(31, 'days'),
        endDate: today,
    },
    {
        text: 'Past 60 Days',
        startDate: moment.utc().subtract(61, 'days'),
        endDate: today,
    },
    {
        text: 'Past 90 Days',
        startDate: moment.utc().subtract(91, 'days'),
        endDate: today,
    },
    {
        text: 'This Year',
        startDate: moment.utc().startOf('year'),
        endDate: today,
    },
    {
        text: 'All-time',
        startDate: moment.utc('2017-01-01'),
        endDate: today,
    },
];
// const setFocus = (rangeText: string) => {
//   switch (rangeText) {
//   case 'Last Week':
//     return 'endDate';
//   case 'Last Month':
//     return 'endDate';
//   case 'This Month':
//     return 'endDate';
//   case 'Past 7 Days':
//     return 'endDate';
//   case 'Past 30 Days':
//     return 'endDate';
//   default:
//     return 'startDate';
//   }
// };
exports.PresetDateRanges = function (props) {
    var dateRanges = props.presets ? props.presets : defaultDateRanges;
    var options = dateRanges.map(function (a) { return ({ value: a.text, label: a.text }); });
    var onSelect = function (value) {
        for (var _i = 0, dateRanges_1 = dateRanges; _i < dateRanges_1.length; _i++) {
            var range = dateRanges_1[_i];
            if (value === range.text) {
                props.onDatesChange(range.startDate, range.endDate);
                var focus_1 = 'startDate';
                props.setFocusedInput(focus_1);
            }
        }
    };
    var getValue = function () {
        for (var _i = 0, dateRanges_2 = dateRanges; _i < dateRanges_2.length; _i++) {
            var range = dateRanges_2[_i];
            if (moment.utc(range.startDate).isSame(props.startDate === null ? undefined : props.startDate, 'day')
                && moment.utc(range.endDate).isSame(props.endDate === null ? undefined : props.endDate, 'day'))
                return range.text;
        }
    };
    return (React.createElement("div", { className: "presetDateRangePicker__panel" },
        React.createElement(__1.Select, { onChange: onSelect, placeholder: 'Select a date: ', className: { container: 'presetDateRangePicker__select' }, value: getValue(), options: options })));
};
//# sourceMappingURL=PresetDateRanges.js.map