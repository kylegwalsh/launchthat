"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./ProgressBar.scss");
// tslint:disable-next-line: no-submodule-imports
require("rc-progress/assets/index.css");
var rc_progress_1 = require("rc-progress");
/**
 * A progress bar used to show loading state
 */
exports.ProgressBar = function (props) {
    return (React.createElement(rc_progress_1.Line, { strokeLinecap: props.caps, className: "progressBar " + (props.className ? props.className : ''), percent: props.percent, color: props.color, strokeWidth: props.width }));
};
//# sourceMappingURL=ProgressBar.js.map