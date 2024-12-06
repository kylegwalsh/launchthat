"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
// tslint:disable-next-line: no-submodule-imports
var md_1 = require("react-icons/md");
require("./SearchBox.scss");
/**
 * A generic search box
 */
exports.SearchBox = function (props) {
    return (React.createElement("form", { className: "searchBox " + ((props.className && props.className.container) ? props.className.container : '') },
        React.createElement("div", { className: 'searchBox__group' },
            React.createElement("input", { className: "searchBox__input " + ((props.className && props.className.input) ? props.className.input : ''), type: 'search', placeholder: props.placeholder, onChange: props.onChange, value: props.value }),
            React.createElement("button", { type: 'submit', onClick: function (e) { return submitSearch(e, props.onSubmit); }, className: "searchBox__button " + ((props.className && props.className.button) ? props.className.button : '') },
                React.createElement(md_1.MdSearch, { className: 'searchBox__icon' })))));
};
/**
 * Intermediary submission that prevents page from reloading
 */
var submitSearch = function (e, submit) {
    // Prevent page refresh
    e.preventDefault();
    // Submit search
    submit();
    // Blur input
    if ('activeElement' in document && document.activeElement)
        document.activeElement.blur();
};
//# sourceMappingURL=SearchBox.js.map