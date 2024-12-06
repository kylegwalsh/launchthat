"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_slide_out_1 = require("react-slide-out");
// tslint:disable-next-line: no-submodule-imports
require("react-slide-out/lib/index.css");
// tslint:disable-next-line: no-submodule-imports
var md_1 = require("react-icons/md");
require("./SlidingPane.scss");
/**
 * A pane that slides out from different sides
 */
exports.SlidingPane = function (props) {
    return (React.createElement("div", { className: "slidingPane " + ((props.className && props.className) ? props.className : '') },
        React.createElement(react_slide_out_1.default, { isOpen: props.isOpen, onOutsideClick: function () { return props.setIsOpen(false); } },
            React.createElement("div", { className: 'slidingPane__header' },
                React.createElement(md_1.MdClear, { className: 'slidingPane__close', onClick: function () { return props.setIsOpen(false); } }),
                React.createElement("h2", { className: 'slidingPane__title' }, props.title)),
            React.createElement("div", { className: 'slidingPane__content' }, props.children))));
};
//# sourceMappingURL=SlidingPane.js.map