"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var __1 = require("../");
var react_router_dom_1 = require("react-router-dom");
require("./Tabs.scss");
/**
 * A tabbed navigation that appears in a card
 */
var TabsBase = function (props) {
    return (React.createElement(__1.Card, { className: {
            container: "tabs__container " + (props.className && props.className.container ? props.className.container : ''),
            content: "tabs__content " + (props.className && props.className.content ? props.className.content : ''),
        } }, generateTabs(props.tabs)));
};
/**
 * Generate the tabs that appear in the navigation
 */
var generateTabs = function (tabs) {
    return tabs.map(function (tab, index) {
        return (React.createElement(react_router_dom_1.Link, { key: index, to: tab.path, className: "tabs__tab " + (tab.active ? 'active' : '') }, tab.text));
    });
};
/**
 * A tabbed navigation that appears in a card
 */
exports.Tabs = react_router_dom_1.withRouter(TabsBase);
//# sourceMappingURL=Tabs.js.map