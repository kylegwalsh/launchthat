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
var react_router_dom_1 = require("react-router-dom");
var components_1 = require("./components");
// tslint:disable-next-line: no-submodule-imports
var md_1 = require("react-icons/md");
// import { TableCell } from '@material-ui/core';
// import ReactTooltip from 'react-tooltip';
var styles_1 = require("@material-ui/core/styles");
require("./App.scss");
require("./styles/styles.scss");
// Handle filters on table
var onDatesChange = function (startDate, endDate) {
    console.log('Start date: ', startDate, ' End Date: ', endDate);
};
var MUITheme = styles_1.createMuiTheme({
    overrides: {
        MUIDataTableToolbar: {
            left: {
                flex: '1 1 10%',
            },
            actions: {
                flex: '1 1 90%',
            },
        },
        MUIDataTableSelectCell: {
            fixedHeader: {
                backgroundColor: 'white',
                zIndex: '101 !important',
            },
        },
        MuiToolbar: {
            root: {
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
            },
        },
        MUIDataTableHeadCell: {
            root: {
                fontSize: 15,
            },
        },
        // MUIDataTable: {
        //   responsiveScroll: {
        //     // overflowX: 'none',
        //     // height: 'auto',
        //     // maxHeight: 'auto',
        //   },
        // },
        MuiCheckbox: {
            root: {
                padding: 0,
            },
        },
        MuiTableRow: {
            root: {
                height: 'auto',
            },
        },
        MUIDataTableBodyCell: {
            root: {
                minWidth: 120,
                paddingTop: 0,
                paddingBottom: 0,
            },
        },
        MuiTableCell: {
            root: {
                padding: 0,
                paddingRight: 4,
                paddingLeft: 4,
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                borderRight: '1px solid rgba(224, 224, 224, 1)',
            },
        },
    },
});
/**
 * Apply a filter on the table
 * @param type - The type of the filter being used (equals, less than, etc.)
 * @param value - The value passed back to compare to
 * @param columnName - The name of the column the filter should be applied to
 * @param columnLabel - The column label for (For aesthetic purposes)
 */
// tslint:disable-next-line: max-line-length
var applyFilter = function (type, value, columnName, columnLabel, filters, setFilter) {
    var newFilters = __assign({}, filters);
    newFilters[columnName] = {
        type: type,
        value: value,
        label: columnLabel,
    };
    setFilter(newFilters);
};
/**
 * Clear the filter on a column
 * @param columnName - the name of the column to clear the filter for
 */
var clearFilter = function (columnName, filters, setFilter) {
    var newFilters = __assign({}, filters);
    newFilters[columnName] = {
        type: '',
        value: '',
        label: '',
    };
    setFilter(newFilters);
};
// const values = [
//   {
//     value: 'This is 1',
//     label: 'New label 1',
//   },
//   {
//     value: 'This is 2',
//     label: 'New label 2 crazy large value',
//   },
//   {
//     value: 'This is 3',
//     label: 'New label 3',
//   },
//   {
//     value: 'This is 4',
//     label: 'New label 4',
//   },
// ];
var Table = function () {
    var _a = useState({}), filters = _a[0], setFilters = _a[1];
    return (React.createElement("div", { className: 'container' },
        React.createElement(components_1.DeprecatedDataTable, { title: 'Keywords', data: creditCards, columns: [
                {
                    reRenderFilters: filters,
                    name: 'name',
                    label: 'Name',
                    options: {
                        customHeadRender: function (columnMeta, handleToggleColumn) {
                            return (React.createElement(components_1.CustomHeadRender, { key: columnMeta.index, applyFilter: applyFilter, clearFilter: clearFilter, 
                                // filterValues={values}
                                filters: filters, setFilter: setFilters, sticky: true, columnMeta: columnMeta, handleToggleColumn: handleToggleColumn, filter: 'Number' }));
                        },
                        setCellProps: function () { return ({ style: style }); },
                        sort: true,
                    },
                },
                {
                    name: 'cardNumber',
                    label: 'Card Number',
                },
                {
                    name: 'cvc',
                    label: 'CVC',
                },
                {
                    name: 'expiry',
                    label: 'Expiry',
                },
                {
                    name: 'random',
                    label: 'Random',
                },
                {
                    name: 'random1',
                    label: 'Card Number',
                },
                {
                    name: 'random2',
                    label: 'CVC',
                },
                {
                    name: 'random3',
                    label: 'Expiry',
                },
                {
                    name: 'random4',
                    label: 'Name',
                },
                {
                    name: 'random5',
                    label: 'Card Number',
                },
                {
                    name: 'random6',
                    label: 'CVC',
                },
                {
                    name: 'random7',
                    label: 'Expiry',
                },
                {
                    name: 'random8',
                    label: 'Card Number',
                },
                {
                    name: 'random9',
                    label: 'CVC',
                },
                {
                    name: 'random10',
                    label: 'Expiry',
                },
                {
                    name: 'random11',
                    label: 'Expiry',
                },
                {
                    name: 'random12',
                    label: 'Expiry',
                },
                {
                    name: 'random13',
                    label: 'Expiry',
                },
                {
                    name: 'random14',
                    label: 'Expiry',
                },
                {
                    name: 'random15',
                    label: 'Expiry',
                },
            ], options: {
                responsive: 'scroll',
                selectableRows: false,
                customToolbar: function () {
                    return (React.createElement(React.Fragment, null,
                        React.createElement(components_1.DatePicker, { startDate: null, endDate: null, onDatesChange: onDatesChange }),
                        React.createElement(components_1.CustomFilterList, { setFilter: setFilters, clearFilter: clearFilter, filters: filters })));
                },
            } })));
};
exports.App = function () {
    return (React.createElement(react_router_dom_1.BrowserRouter, null,
        React.createElement(react_router_dom_1.Switch, null,
            React.createElement(react_router_dom_1.Route, { path: '*', render: function () {
                    // Wrap the dashboard with the custom theme we want to use for the material design table
                    return React.createElement(styles_1.MuiThemeProvider, { theme: MUITheme },
                        React.createElement(components_1.Dashboard, { defaultRoute: '/test', headerLogo: process.env.PUBLIC_URL + "/images/horizontal-logo.png", routes: routes, user: { firstName: 'Kyle', lastName: 'Walsh' }, signOut: function () { return console.log('Done'); }, sidebarSize: 'mini', profileOptions: [
                                {
                                    icon: md_1.MdSettings,
                                    text: 'Account Settings',
                                    action: function () { return window.open('https://myaccount.google.com/', '_blank'); },
                                },
                                {
                                    icon: md_1.MdCloudDownload,
                                    text: 'Download LinkFox',
                                    action: function () { return window.open('https://chrome.google.com/webstore/detail/linkfox/nijgdpmhbfmjeldjdlkokgaffmoiipfe', '_blank'); },
                                },
                            ] }));
                } }))));
};
var routes = [
    // Links page
    {
        name: 'Verticals',
        path: '/verticals',
        exact: false,
        render: function () {
            return (React.createElement("div", { className: 'container' },
                React.createElement(components_1.Breadcrumbs, { className: 'breadCrumbTest', pages: [
                        {
                            icon: md_1.MdPeople,
                            path: '/users',
                            text: 'Users',
                        },
                        {
                            icon: md_1.MdPeople,
                            text: 'Verticals',
                        },
                    ] }),
                React.createElement(components_1.Tabs, { className: { container: 'tabsTest' }, tabs: [
                        {
                            path: '/verticals',
                            text: 'Verticals',
                            active: true,
                        },
                        {
                            path: '/users',
                            text: 'Users',
                        },
                    ] })));
        },
        icon: React.createElement(md_1.MdList, null),
    },
    // Users page
    {
        name: 'Users',
        path: '/users',
        exact: false,
        render: function () {
            return (React.createElement(Table, null));
        },
        icon: React.createElement(md_1.MdPeople, null),
    },
];
var creditCards = [
    {
        cardNumber: '5500005555555559',
        name: 'Tom Tallis',
        cvc: '582',
        expiry: '02/24',
        random: null,
        random1: 'stress',
        random2: 'test',
        random3: 'gfdslfndfldsfndlfnslndfdljf',
        random4: 'fasdfasdfndfdkfsndfdfs',
        random5: 'test',
        random6: 'another',
        random7: 'Another',
        random8: 'aanother one',
        random9: 'another',
        random10: 'This is almost the last one',
        random11: 'another one',
        random12: 'Another',
        random13: 'aanother one',
        random14: 'another',
        random15: 'This is almost the last one',
    },
];
var style = {
    position: 'sticky',
    left: 0,
    background: 'white',
    zIndex: 101,
};
//# sourceMappingURL=App.js.map