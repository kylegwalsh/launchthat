"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var spinner = require("./assets/spinner.gif");
require("./Loading.scss");
/**
 * A component that displays a full size spinner
 */
exports.Loading = function (props) {
    var size = getSize(props.size);
    return (React.createElement("div", { className: 'loading__container' },
        React.createElement("img", { 
            // @ts-ignore
            src: spinner, style: { height: size, width: size }, className: "loading__img " + (props.className ? props.className : '') })));
};
// HELPERS
/**
 * Get a pixel size based on a string size
 */
var getSize = function (size) {
    switch (size) {
        case 'large':
            return '6em';
        case 'med':
            return '4em';
        case 'small':
            return '2em';
        default:
            return '6em';
    }
};
//# sourceMappingURL=Loading.js.map