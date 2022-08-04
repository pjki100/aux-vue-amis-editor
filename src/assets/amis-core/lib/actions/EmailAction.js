/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var pick = require('lodash/pick');
var qs = require('qs');
var Action = require('./Action.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var pick__default = /*#__PURE__*/_interopDefaultLegacy(pick);
var qs__default = /*#__PURE__*/_interopDefaultLegacy(qs);

/**
 * 邮件动作
 *
 * @export
 * @class EmailAction
 * @implements {Action}
 */
var EmailAction = /** @class */ (function () {
    function EmailAction() {
    }
    EmailAction.prototype.run = function (action, renderer, event) {
        var _a, _b;
        return tslib.__awaiter(this, void 0, void 0, function () {
            var mailTo, mailInfo, mailStr, mailto;
            return tslib.__generator(this, function (_c) {
                mailTo = (_a = action.args) === null || _a === void 0 ? void 0 : _a.to;
                mailInfo = pick__default["default"]((_b = action.args) !== null && _b !== void 0 ? _b : {}, 'cc', 'bcc', 'subject', 'body');
                mailStr = qs__default["default"].stringify(mailInfo);
                mailto = "mailto:".concat(mailTo, "?").concat(mailStr);
                window.open(mailto);
                return [2 /*return*/];
            });
        });
    };
    return EmailAction;
}());
Action.registerAction('email', new EmailAction());

exports.EmailAction = EmailAction;
