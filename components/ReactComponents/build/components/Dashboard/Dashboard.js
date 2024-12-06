"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./Dashboard.scss");
var components_1 = require("./components");
var __1 = require("../");
var react_router_dom_1 = require("react-router-dom");
/**
 * The dashboard (includes sidebar and header).
 * Child component should be the central page of the dashboard
 * and controlled by a top level router
 */
exports.Dashboard = function (props) {
    return (React.createElement("div", { className: "dashboard " + (props.className ? props.className : '') },
        React.createElement(components_1.Sidebar, { routes: props.routes, user: props.user, signOut: props.signOut, size: props.sidebarSize, profileOptions: props.profileOptions }),
        React.createElement("div", { className: 'dashboard__rightSide' },
            React.createElement(components_1.Header, { defaultRoute: props.defaultRoute, otherComponents: props.headerComponents, logo: props.headerLogo }),
            React.createElement("div", { className: 'dashboard__content' },
                React.createElement(react_router_dom_1.Switch, null,
                    generateRoutes(props.routes, props.user && props.user.isAdmin),
                    React.createElement(react_router_dom_1.Redirect, { from: '*', to: props.defaultRoute || '/' }))),
            React.createElement(__1.BugFooter, null)),
        React.createElement(__1.Notifications, null),
        props.dashboardComponents));
};
// HELPERS
/**
 * Generates the remaining app routes based on routes object in App.tsx
 */
var generateRoutes = function (routes, isAdmin) {
    return routes.map(function (route, index) {
        // Render route if it is not an admin route, or if the user is an admin
        if (!route.adminOnly || isAdmin)
            return React.createElement(react_router_dom_1.Route, { key: index, exact: route.exact, path: route.path, render: route.render });
        // Otherwise don't render route
        return;
    });
};
//# sourceMappingURL=Dashboard.js.map