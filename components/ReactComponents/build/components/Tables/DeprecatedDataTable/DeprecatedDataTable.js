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
var mui_datatables_1 = require("mui-datatables");
require("./DeprecatedDataTable.scss");
var LoadingOverlay_1 = require("./components/LoadingOverlay/LoadingOverlay");
/**
 * A data table component
 */
exports.DeprecatedDataTable = function (props) {
    return (React.createElement("div", { className: "table " + (props.className ? props.className : '') + " " + (props.loading ? 'table-hidden' : '') },
        React.createElement(mui_datatables_1.default, { title: props.title, columns: props.columns, data: Array.isArray(props.data) ? props.data : [], options: __assign({}, defaultOptions, props.options) }),
        props.loading && React.createElement(LoadingOverlay_1.LoadingOverlay, null)));
};
// HELPERS
/**
 * Default options that are fed to every table
 */
var defaultOptions = {
    print: false,
    rowsPerPageOptions: [10, 50, 100],
    responsive: 'scroll',
};
//# sourceMappingURL=DeprecatedDataTable.js.map