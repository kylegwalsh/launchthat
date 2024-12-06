"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var __1 = require("../");
require("./StatBox.scss");
/**
 * Component show cases a stat and icon for a category
 */
exports.StatBox = function (props) {
    return (React.createElement(__1.Card, { pad: true, className: {
            container: "" + ((props.className && props.className.container) ? props.className.container : ''),
            content: "statBox__content row " + ((props.className && props.className.content) ? props.className.content : ''),
        } },
        React.createElement(__1.IconCircle, { icon: props.icon, color: props.color, className: 'statBox__icon' }),
        React.createElement("div", { className: 'column' },
            React.createElement("div", { className: 'row statBox__value' }, props.value),
            React.createElement("div", { className: 'row statBox__name' }, props.name))));
};
//# sourceMappingURL=StatBox.js.map