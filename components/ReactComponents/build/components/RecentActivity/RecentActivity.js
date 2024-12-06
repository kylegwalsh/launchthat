"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var components_1 = require("../../components");
var react_router_dom_1 = require("react-router-dom");
var utilities_1 = require("../../utilities");
require("./RecentActivity.scss");
/**
 * Component showing recent dashboard activity (changes to DB)
 */
exports.RecentActivity = function (props) {
    return (React.createElement(components_1.Card, { pad: true, className: {
            container: "" + ((props.className && props.className.container) ? props.className.container : ''),
            content: "" + ((props.className && props.className.content) ? props.className.content : ''),
        } },
        React.createElement("h3", null, "Recent Activity"),
        generateActivity(props.activities)));
};
// HELPERS
/**
 * Generates rows for each recent activity
 * @param activities - array of recent activities
 */
var generateActivity = function (activities) {
    if (activities && activities.length) {
        return activities.map(function (activity, index) {
            return (React.createElement("div", { key: index, className: 'recentActivity__row row' },
                React.createElement("div", { className: 'recentActivity__iconContainer' },
                    React.createElement(components_1.IconCircle, { color: activity.color, icon: activity.icon, className: 'recentActivity__icon' })),
                React.createElement("div", { className: 'recentActivity__information column' },
                    React.createElement("span", { className: 'recentActivity__information__row row' },
                        React.createElement(react_router_dom_1.Link, { to: activity.link, className: 'recentActivity__link' }, activity.name),
                        getAction(activity.action),
                        " ",
                        activity.category,
                        " by ",
                        activity.editor),
                    React.createElement("span", { className: 'row recentActivity__date' }, utilities_1.Date.formatDate(activity.date)))));
        });
    }
    else
        return;
};
/**
 * Gets the text shown to user based on action
 * @param action - action performed on the row
 * @returns
 * @param {string} actionText - ui text for action
 */
var getAction = function (action) {
    switch (action) {
        case 'create':
            return 'added to';
        case 'update':
            return 'edited in';
        case 'delete':
            return 'deleted from';
        default:
            return 'modified in';
    }
};
//# sourceMappingURL=RecentActivity.js.map