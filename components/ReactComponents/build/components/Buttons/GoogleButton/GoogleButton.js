"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_google_login_1 = require("react-google-login");
require("./GoogleButton.scss");
/**
 * A google login button
 */
exports.GoogleButton = function (props) {
    return (React.createElement(react_google_login_1.GoogleLogin, { clientId: props.clientId, buttonText: 'Sign In', onSuccess: props.handleSuccess, onFailure: props.handleFailure, className: "googleButton " + (props.className ? props.className : ''), accessType: props.accessType, responseType: props.responseType, scope: props.scope, prompt: 'consent' }));
};
//# sourceMappingURL=GoogleButton.js.map