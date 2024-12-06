"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var __1 = require("../");
require("./SignInPanel.scss");
/**
 * A panel allowing the user to sign in using their google information
 */
exports.SignInPanel = function (props) {
    return (React.createElement("div", { className: 'signInPanel__container' },
        React.createElement("div", { className: 'signInPanel' },
            React.createElement("div", { className: 'signInPanel__section' },
                React.createElement(__1.GoogleButton, { clientId: props.clientId, handleSuccess: props.handleSuccess, handleFailure: props.handleFailure, accessType: props.accessType || 'offline', responseType: props.responseType || 'code', scope: props.scope })),
            React.createElement("div", { className: 'signInPanel__section signInPanel__right' },
                React.createElement("img", { src: props.logo, className: 'signInPanel__logo' })))));
};
//# sourceMappingURL=SignInPanel.js.map