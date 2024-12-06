"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Fragment = React.Fragment;
var react_router_dom_1 = require("react-router-dom");
require("./Breadcrumbs.scss");
/**
 * Navigation breadcrumbs
 */
var BreadcrumbsBase = function (props) {
    return (React.createElement("div", { className: "breadcrumbs " + (props.className ? props.className : '') }, generateBreadcrumbs(props.pages)));
};
/**
 * Generate the breadcrumb links
 */
var generateBreadcrumbs = function (pages) {
    return pages.map(function (page, index) {
        return (React.createElement("div", { className: 'breadcrumbs__entry', key: index },
            React.createElement("div", { className: 'breadcrumb__entry__row' },
                page.path &&
                    React.createElement(Fragment, null,
                        React.createElement(react_router_dom_1.Link, { className: 'breadcrumbs__link', to: page.path },
                            page.icon ? React.createElement(page.icon, { className: 'breadcrumbs__icon' }) : React.createElement(React.Fragment, null),
                            page.text),
                        index < pages.length - 1 && React.createElement("span", { className: 'breadcrumbs__separator' }, "/")),
                !page.path &&
                    React.createElement(Fragment, null,
                        page.icon ? React.createElement(page.icon, { className: 'breadcrumbs__icon' }) : React.createElement(React.Fragment, null),
                        React.createElement("div", { className: 'breadcrumbs__currentPage' }, page.text)))));
    });
};
/**
 * Navigation breadcrumbs
 */
exports.Breadcrumbs = react_router_dom_1.withRouter(BreadcrumbsBase);
//# sourceMappingURL=Breadcrumbs.js.map