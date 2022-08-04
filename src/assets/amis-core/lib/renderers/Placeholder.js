/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var Placeholder = /** @class */ (function (_super) {
    tslib.__extends(Placeholder, _super);
    function Placeholder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Placeholder.prototype.componentDidMount = function () {
        console.warn("Please implement this renderer(".concat(this.props.type, ")"));
    };
    Placeholder.prototype.render = function () {
        return null;
    };
    return Placeholder;
}(React__default["default"].Component));

exports.Placeholder = Placeholder;
