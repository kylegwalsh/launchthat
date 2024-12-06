"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var core_1 = require("@material-ui/core");
require("./SimpleModal.scss");
/**
 * A basic modal
 */
exports.SimpleModal = function (props) {
    return (React.createElement(core_1.Dialog, { open: props.open, onClose: props.onClose, className: "simpleModal " + (props.className ? props.className : ''), disableBackdropClick: props.disableBackdropClick }, props.children));
};
//# sourceMappingURL=SimpleModal.js.map