"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var components_1 = require("./components");
require("./Sidebar.scss");
var react_custom_scrollbars_1 = require("react-custom-scrollbars");
var ReactTooltip = require("react-tooltip");
var react_router_dom_1 = require("react-router-dom");
/**
 * The sidebar of the dashboard
 */
var SidebarBase = function (props) {
    return (React.createElement("div", { className: "sidebar " + (props.className ? props.className : '') + " " + (props.size === 'mini' ? 'mini' : '') },
        React.createElement(components_1.ProfileMenu, { user: props.user, signOut: props.signOut, size: props.size, profileOptions: props.profileOptions }),
        React.createElement(react_custom_scrollbars_1.default, { autoHide: true, className: 'sidebar__content' },
            React.createElement("ul", { className: 'sidebar__list' }, generateMenuItems(props.routes, props.location.pathname, props.user && props.user.isAdmin, props.size)),
            React.createElement("div", { className: 'sidebar__scroll' }),
            props.size === 'mini' &&
                React.createElement(ReactTooltip, { className: 'sidebar__tooltip', place: 'right', effect: 'solid', offset: { left: 13 } }))));
};
// Attach router to add navigation functions
/**
 * The sidebar of the dashboard
 */
exports.Sidebar = react_router_dom_1.withRouter(SidebarBase);
// HELPERS
/**
 * Determine the index of the active page in our routes array
 * @returns
 * @param {number} index - index of active page in routes array
 */
var getActiveIndex = function (routes, path) {
    for (var i = 0; i < routes.length; i++) {
        // Look for match based on route rules
        if ((path === routes[i].path && routes[i].exact) || (path.includes(routes[i].path) && !routes[i].exact)) {
            return i;
        }
    }
    return -1;
};
/**
 * Generates the sidebar menu items based on the routes supplied to the Dashboard
 */
var generateMenuItems = function (routes, path, isAdmin, size) {
    // See which menu item should be active
    var activeIndex = getActiveIndex(routes, path);
    // Return items (that aren't hidden)
    return routes.filter(function (route) { return !route.hidden; }).map(function (route, index) {
        // Render route if it is not an admin route, or if the user is an admin
        if (!route.adminOnly || isAdmin) {
            return (React.createElement("li", { key: index, className: "sidebar__listItem " + (index === activeIndex ? 'active' : '') + " " + (size === 'mini' ? 'mini' : ''), "data-tip": route.name },
                route.overrideLink &&
                    React.createElement("a", { href: route.overrideLink },
                        route.icon,
                        " ",
                        size !== 'mini' ? route.name : ''),
                !route.overrideLink &&
                    React.createElement(react_router_dom_1.Link, { to: route.path },
                        route.icon,
                        " ",
                        size !== 'mini' ? route.name : '')));
        }
        // Otherwise don't render route
        return;
    });
};
//# sourceMappingURL=Sidebar.js.map