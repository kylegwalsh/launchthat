"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var __1 = require("../../../../../");
var core_1 = require("@material-ui/core");
// tslint:disable-next-line: no-submodule-imports
var md_1 = require("react-icons/md");
require("./ProfileMenu.scss");
/**
 * Profile menu that appears at the top of the side bar
 */
exports.ProfileMenu = function (props) {
    // Define ref for drop down
    var dropDownRef;
    // Generate options for dropdown
    var options = props.profileOptions ? props.profileOptions.concat([
        {
            icon: md_1.MdExitToApp,
            text: 'Sign Out',
            action: function () { return props.signOut(); },
        },
    ]) :
        // Use default options if none are provided
        [
            {
                icon: md_1.MdSettings,
                text: 'Account Settings',
                action: function () { return window.open('https://myaccount.google.com/', '_blank'); },
            },
            {
                icon: md_1.MdExitToApp,
                text: 'Sign Out',
                action: function () { return props.signOut(); },
            },
        ];
    return (React.createElement("div", null,
        React.createElement("div", { className: "profileMenu " + (props.className ? props.className : '') + " " + (props.size === 'mini' ? 'mini' : ''), onClick: function (e) { return dropDownRef.toggleMenu(e); } },
            React.createElement(core_1.Avatar, { alt: '...', src: props.user ? props.user.picture : undefined, className: "profileMenu__avatar " + (props.size === 'mini' ? 'mini' : '') }, // If no image is supplied, just use an icon
            (!props.user || !props.user.picture) &&
                React.createElement(md_1.MdPerson, null)),
            props.size !== 'mini' &&
                React.createElement("div", { className: 'profileMenu__details' },
                    React.createElement("h4", { className: 'profileMenu__username ellipsis' }, props.user ? props.user.firstName + " " + props.user.lastName : undefined),
                    React.createElement(md_1.MdArrowDropDown, { className: 'profileMenu__arrow' }))),
        React.createElement(__1.DropDown, { options: options, ref: function (ref) { return dropDownRef = ref; } })));
};
//# sourceMappingURL=ProfileMenu.js.map