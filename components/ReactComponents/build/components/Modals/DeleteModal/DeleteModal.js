"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var useState = React.useState;
var __1 = require("../..");
// tslint:disable-next-line: no-submodule-imports
var md_1 = require("react-icons/md");
require("./DeleteModal.scss");
var react_router_dom_1 = require("react-router-dom");
/**
 * A modal meant for confirmation of deletions
 */
exports.DeleteModal = function (props) {
    var _a = useState(''), text = _a[0], setText = _a[1];
    /**
     * Clear input when modal is closed
     */
    var closeModal = function () {
        setText('');
        props.onClose();
    };
    /**
     * Handle deletion of data (and close modal)
     */
    var deleteEntry = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, props.delete()];
                case 1:
                    _a.sent();
                    closeModal();
                    return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(__1.SimpleModal, { open: props.open, onClose: closeModal, className: "deleteModal " + (props.className ? props.className : '') },
        React.createElement("div", { className: 'deleteModal__header' },
            React.createElement("h2", { className: 'deleteModal__headerText' }, props.deleteName ? "Are you sure you want to delete " + props.deleteName + "?" : 'Are you sure?'),
            React.createElement(md_1.MdClear, { className: 'deleteModal__exit', onClick: closeModal })),
        props.loading &&
            React.createElement(__1.Loading, null),
        !props.loading &&
            React.createElement("div", null,
                React.createElement("div", { className: 'row m-0' },
                    !props.pendingDeletes && (props.deleteName ?
                        React.createElement("p", null,
                            "To confirm the deletion of this item, please type ",
                            React.createElement("strong", null, props.deleteName),
                            " into the input below.") :
                        React.createElement("p", null,
                            "To confirm the deletion of this item, please type ",
                            React.createElement("strong", null, "DELETE"),
                            " into the input below.")),
                    props.pendingDeletes &&
                        React.createElement("p", null, props.pendingDeleteText)),
                !props.pendingDeletes &&
                    React.createElement(React.Fragment, null,
                        React.createElement("div", { className: 'row' },
                            React.createElement("div", { className: 'column' },
                                React.createElement(__1.Input, { value: text, autoComplete: 'off', onChange: function (event) { return setText(event.target.value); } }))),
                        React.createElement("div", { className: 'row m-0' },
                            React.createElement(__1.Button, { disabled: text !== (props.deleteName ? props.deleteName : 'DELETE'), className: 'deleteModal__button', onClick: function () { return deleteEntry(); } }, "Delete"))),
                props.pendingDeletes &&
                    React.createElement(React.Fragment, null,
                        React.createElement("div", { className: 'row' },
                            React.createElement("div", { className: 'column' }, Object.keys(props.pendingDeletes).map(function (key, index) {
                                return (React.createElement("div", { key: index },
                                    (props.pendingDeletes && props.pendingDeletes[key].length !== 0) && React.createElement(__1.Label, { text: key }),
                                    React.createElement("ul", null, props.pendingDeletes && props.pendingDeletes[key].map(function (item, index) {
                                        return (React.createElement("li", { key: index },
                                            !props.pendingDeleteInternalLink &&
                                                React.createElement("a", { target: '_blank', href: item.link },
                                                    React.createElement("p", null, item.name)),
                                            props.pendingDeleteInternalLink &&
                                                React.createElement(react_router_dom_1.Link, { to: item.link }, item.name)));
                                    }))));
                            })))))));
};
//# sourceMappingURL=DeleteModal.js.map