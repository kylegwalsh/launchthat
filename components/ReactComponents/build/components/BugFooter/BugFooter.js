"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./BugFooter.scss");
/**
 * A footer that contains a link to report any bugs via Google Form
 */
exports.BugFooter = function (props) {
    return (React.createElement("div", { className: "bugFooter " + (props.className ? props.className : '') },
        React.createElement("p", null,
            "Maintained by the MARS team. ",
            React.createElement("a", { href: googleFormURL, target: '_blank' },
                React.createElement("strong", null, "Report a bug.")))));
};
// HELPERS
var googleFormURL = 'https://www.wrike.com/form/eyJhY2NvdW50SWQiOjIzNj\
E3OTIsInRhc2tGb3JtSWQiOjE4OTcyMX0JNDcwMjkxNTA4NTExMwk0YTVjNmIxMDU2NjA\
4MDZmOTZkMThkYjViOWU1Y2NjM2E5ZGQ0NWE0OGI1OWU0YjkyMmQyYmFkMjIwNjMxZDk2';
//# sourceMappingURL=BugFooter.js.map