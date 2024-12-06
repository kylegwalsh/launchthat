"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var useState = React.useState, forwardRef = React.forwardRef, useImperativeHandle = React.useImperativeHandle;
var core_1 = require("@material-ui/core");
require("./DropDown.scss");
/**
 * A dropdown menu component
 */
exports.DropDown = forwardRef(function (props, ref) {
    // Track anchor element (whatever is clicked)
    var _a = useState(null), anchorEl = _a[0], setAnchorEl = _a[1];
    /**
     * Toggle the profile menu open / closed
     */
    var toggleMenu = function (event) {
        setAnchorEl(event.currentTarget);
    };
    /**
     * Close the menu
     */
    var handleClose = function (setAnchorEl) {
        setAnchorEl(null);
    };
    // Pass ref back up
    useImperativeHandle(ref, function () { return ({
        toggleMenu: function (event) {
            toggleMenu(event);
        },
    }); }, [anchorEl]);
    var renderOptions = function (options) {
        // If no options are provided, just return
        if (!options)
            return;
        // Otherwise, render the options
        return options.map(function (option, i) {
            return (React.createElement(core_1.MenuItem, { key: i, onClick: function () {
                    option.action();
                    handleClose(setAnchorEl);
                } },
                React.createElement("a", null,
                    option.icon ? React.createElement(option.icon, { className: 'dropDown__Icon' }) : React.createElement(React.Fragment, null),
                    option.icon ? " " + option.text : option.text)));
        });
    };
    return (React.createElement(core_1.Menu, { className: "dropDown " + (props.className ? props.className : ''), id: 'simple-menu', open: !!anchorEl, anchorEl: anchorEl, onClose: function () { return handleClose(setAnchorEl); }, PaperProps: {
            style: {
                width: 120,
                paddingTop: 0,
                paddingBottom: 0,
            },
        } }, renderOptions(props.options)));
});
//# sourceMappingURL=DropDown.js.map