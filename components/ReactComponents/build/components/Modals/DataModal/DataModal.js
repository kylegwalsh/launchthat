"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var __1 = require("../..");
// tslint:disable-next-line: no-submodule-imports
var md_1 = require("react-icons/md");
require("./DataModal.scss");
/**
 * A modal meant for CRUD
 */
exports.DataModal = function (props) {
    return (React.createElement(__1.SimpleModal, { disableBackdropClick: true, open: props.open, onClose: props.onClose, className: "dataModal " + (props.className ? props.className : '') },
        React.createElement("div", { className: 'dataModal__header' },
            React.createElement("h2", { className: 'dataModal__headerText' }, props.headerText),
            React.createElement(md_1.MdClear, { className: 'dataModal__exit', onClick: props.onClose })),
        React.createElement("div", { className: 'dataModal__tabContainer' }, generateTabs(props.tabs, props.activeTab, props.setActiveTab)),
        React.createElement("div", { className: 'dataModal__body' }, generateBody(props.loading, props.tabs, props.activeTab))));
};
// HELPERS
/**
 * Generate list of tabs list of tab objects(if we have more than one)
 * @param tabs - list of list of tab objects
 * @param active - current active tab index
 */
var generateTabs = function (tabs, active, setActive) {
    // Don't generate tabs list of tab objects if we only have one
    if (tabs.length === 1)
        return;
    // Otherwise, return list of tabs
    return tabs.map(function (tab, index) {
        return (React.createElement("span", { key: index, onClick: function () { return setActive ? setActive(index) : console.log('No set active tab function provided.'); }, className: "dataModal__tab " + (active === index ? 'active' : '') }, tab.title));
    });
};
/**
 * Generate a body
 * @param loading - whether the modal is still loading data
 * @param tabs - list of tab objects
 * @param active - current active index
 */
var generateBody = function (loading, tabs, active) {
    if (loading)
        return React.createElement(__1.Loading, { size: 'med' });
    // Return active body
    return tabs[active].body;
};
//# sourceMappingURL=DataModal.js.map