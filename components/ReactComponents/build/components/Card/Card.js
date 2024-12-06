"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var core_1 = require("@material-ui/core");
require("./Card.scss");
/**
 * A card component
 */
exports.Card = function (props) {
    return (React.createElement(core_1.Card, { className: "card " + ((props.className && props.className.container) ? props.className.container : '') },
        props.pad &&
            React.createElement(core_1.CardContent, { className: "" + ((props.className && props.className.content) ? props.className.content : '') }, props.children),
        // Default to no paddding
        !props.pad &&
            React.createElement("div", { className: "" + ((props.className && props.className.content) ? props.className.content : '') }, props.children)));
};
//# sourceMappingURL=Card.js.map