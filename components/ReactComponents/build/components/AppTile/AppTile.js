"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
// tslint:disable-next-line: no-submodule-imports
require("react-slide-out/lib/index.css");
require("./AppTile.scss");
/**
 * A pane that slides out from different sides
 */
exports.AppTile = function (props) {
    return (React.createElement("a", { className: "appTile " + ((props.className && props.className) ? props.className : ''), href: props.url, target: '_blank' },
        React.createElement("img", { src: props.img, className: 'appTile__img' }),
        React.createElement("p", { className: 'appTile__name' }, props.name)));
};
//# sourceMappingURL=AppTile.js.map