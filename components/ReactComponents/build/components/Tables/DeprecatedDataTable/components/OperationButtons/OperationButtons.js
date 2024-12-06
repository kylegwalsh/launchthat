"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
// tslint:disable-next-line: no-submodule-imports
var md_1 = require("react-icons/md");
require("./OperationButtons.scss");
/**
 * Includes a list of generic buttons for table operations
 */
exports.OperationButtons = function (props) {
    return (React.createElement("div", { className: 'operationButton__container' },
        props.view && React.createElement(md_1.MdRemoveRedEye, { className: "operationButton " + (props.className ? props.className : ''), onClick: props.view }),
        props.edit && React.createElement(md_1.MdEdit, { className: "operationButton " + (props.className ? props.className : ''), onClick: props.edit }),
        props.delete && React.createElement(md_1.MdDelete, { className: "operationButton " + (props.className ? props.className : ''), onClick: props.delete })));
};
//# sourceMappingURL=OperationButtons.js.map