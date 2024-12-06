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
require("./CustomHeadRender.scss");
var md_1 = require("react-icons/md");
var styles_1 = require("@material-ui/core/styles");
var core_1 = require("@material-ui/core");
var Filters_1 = require("../Filters");
/**
 * Styles understood by the MUI provider
 */
var defaultHeadCellStyles = function (theme) { return ({
    root: {
        position: 'relative',
        minWidth: '150px',
        boxShadow: '-1px 0px 0px rgba(224, 224, 224, 1)',
    },
    iconFilterActive: {
        color: 'var(--linkColor) !important',
    },
    tooltip: {
        cursor: 'pointer',
    },
    fixedHeader: {
        position: 'sticky',
        top: '0px',
        left: '0px',
        zIndex: 100,
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0px 1px 0px rgba(224, 224, 224, 1), inset -1px 0px 0px rgba(224, 224, 224, 1)',
    },
    sticky: {
        position: 'sticky',
        left: '0px',
        zIndex: 102,
        maxWidth: '450px',
        boxShadow: '0px 1px 0px rgba(224, 224, 224, 1), inset -1px 0px 0px rgba(224, 224, 224, 1)',
        backgroundColor: theme.palette.background.paper,
    },
    data: {
        display: 'inline-block',
    },
    sortAction: {
        display: 'inline-block',
        verticalAlign: 'top',
        cursor: 'pointer',
        paddingLeft: '4px',
        height: '10px',
        position: 'absolute',
    },
    sortActive: {
        color: theme.palette.text.primary,
    },
    toolButton: {
        height: '10px',
        outline: 'none',
        cursor: 'pointer',
    },
    filterAction: {
        display: 'inline-block',
        verticalAlign: 'top',
        cursor: 'pointer',
        height: '10px',
        position: 'absolute',
        right: '0px',
    },
}); };
/**
 * Special theme for the filter tooltip
 */
var LightTooltip = styles_1.withStyles(function (theme) { return ({
    tooltip: {
        backgroundColor: theme.palette.background.paper,
        border: "1px solid rgba(0, 0, 0, 0.25)",
        boxShadow: theme.shadows[2],
        fontSize: 11,
        padding: 0,
    },
    popper: {
        padding: 0,
        opacity: 1,
    },
}); })(core_1.Tooltip);
// tslint:disable-next-line: variable-name
var _CustomHeadRender = function (props) {
    var _a = useState(false), filterActive = _a[0], setFilterActive = _a[1];
    var _b = props.columnMeta, sortDirection = _b.sortDirection, sort = _b.sort, hint = _b.hint, print = _b.print, index = _b.index, label = _b.label, name = _b.name;
    var sortActive = sortDirection !== null && sortDirection !== undefined ? true : false;
    var sortLabelProps = __assign({ active: sortActive }, (sortDirection ? { direction: sortDirection } : {}));
    var handleFilterClick = function () {
        setFilterActive(!filterActive);
    };
    var handleFilterClose = function () {
        setTimeout(function () { return setFilterActive(false); }, 0);
    };
    var handleSortClick = function () {
        props.handleToggleColumn(index);
    };
    var renderFilter = function (filter) {
        switch (filter) {
            case 'Word':
                return (props.applyFilter && props.clearFilter && props.filters && props.setFilter)
                    ? (React.createElement(Filters_1.WordFilter, { applyFilter: props.applyFilter, clearFilter: props.clearFilter, closeFilter: handleFilterClose, filters: props.filters, setFilter: props.setFilter, columnName: name, columnLabel: label }))
                    : React.createElement("p", { style: { color: 'black' } }, "Please make sure all your props are set");
            case 'Number':
                return (props.applyFilter && props.clearFilter && props.filters && props.setFilter)
                    ? (React.createElement(Filters_1.NumberFilter, { applyFilter: props.applyFilter, clearFilter: props.clearFilter, closeFilter: handleFilterClose, filters: props.filters, setFilter: props.setFilter, columnName: name, columnLabel: label }))
                    : React.createElement("p", { style: { color: 'black' } }, "Please make sure all your props are set");
            case 'Radio':
                return (props.applyFilter && props.clearFilter && props.filterValues && props.filters && props.setFilter)
                    ?
                        (React.createElement(Filters_1.RadioFilter, { filterValues: props.filterValues, applyFilter: props.applyFilter, clearFilter: props.clearFilter, closeFilter: handleFilterClose, filters: props.filters, setFilter: props.setFilter, columnName: name, columnLabel: label }))
                    :
                        (React.createElement("p", { style: { color: 'black' } }, "Please make sure all you have the props set"));
            case 'Equals':
                return (props.applyFilter && props.clearFilter && props.filters && props.setFilter)
                    ? (React.createElement(Filters_1.NumberFilter, { applyFilter: props.applyFilter, clearFilter: props.clearFilter, closeFilter: handleFilterClose, columnName: name, filters: props.filters, setFilter: props.setFilter, columnLabel: label, equals: true }))
                    : React.createElement("p", { style: { color: 'black' } }, "Please make sure all you have the props set");
            default:
                return filter;
        }
    };
    return (React.createElement(core_1.TableCell, { className: props.classes.cellClass + "\n          " + props.classes.root + "\n          " + (!print ? 'datatables-noprint' : '') + "\n          " + (props.sticky ? props.classes.sticky : '') + "\n          " + (props.fixedHeader ? props.classes.fixedHeader : ''), scope: 'col' },
        sort ? (React.createElement(core_1.Tooltip, { title: 'Sort', placement: 'bottom-end', classes: {
                tooltip: props.classes.tooltip,
            }, enterDelay: 300 },
            React.createElement("span", { role: 'button', onKeyUp: handleSortClick, onClick: handleSortClick, className: props.classes.toolButton, tabIndex: 0 },
                React.createElement("div", { className: props.classes.data + " " + (sortActive ? props.classes.sortActive : '') }, props.children ? props.children : label),
                React.createElement("div", { className: props.classes.sortAction },
                    React.createElement(core_1.TableSortLabel, __assign({}, sortLabelProps)))))) : (props.children ? props.children : label),
        hint && (React.createElement(core_1.Tooltip, { title: hint, placement: 'bottom-end', classes: {
                tooltip: props.classes.tooltip,
            }, enterDelay: 300 },
            React.createElement(md_1.MdHelp, { fontSize: 'small' }))),
        props.filter && (React.createElement(LightTooltip, { className: props.classes.filter, interactive: true, TransitionComponent: core_1.Zoom, disableFocusListener: true, disableHoverListener: true, disableTouchListener: true, onClose: handleFilterClose, open: filterActive, title: React.createElement(React.Fragment, null,
                React.createElement(core_1.ClickAwayListener, { onClickAway: handleFilterClose }, props.filter &&
                    renderFilter(props.filter))) },
            React.createElement("span", { role: 'button', onClick: handleFilterClick, className: props.classes.toolButton, tabIndex: 0 },
                React.createElement("div", { className: "" + props.classes.filterAction },
                    React.createElement(core_1.TableSortLabel, { classes: filterActive ? { icon: props.classes.iconFilterActive } : {}, IconComponent: md_1.MdFilterList, active: true })))))));
};
exports.CustomHeadRender = styles_1.withStyles(defaultHeadCellStyles, { name: 'MUIDataTableHeadCell' })(_CustomHeadRender);
//# sourceMappingURL=CustomHeadRender.js.map