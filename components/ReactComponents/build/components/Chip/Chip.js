"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./Chip.scss");
var core_1 = require("@material-ui/core");
exports.Chip = function (props) {
    return (React.createElement(core_1.Chip, { className: "chip chip--" + props.type + " " + (props.className ? props.className : ''), label: props.label }));
};
//# sourceMappingURL=Chip.js.map