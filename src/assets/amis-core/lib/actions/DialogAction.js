/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var Action = require('./Action.js');

/**
 * 打开弹窗动作
 *
 * @export
 * @class DialogAction
 * @implements {Action}
 */
var DialogAction = /** @class */ (function () {
    function DialogAction() {
    }
    DialogAction.prototype.run = function (action, renderer, event) {
        var _a, _b;
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_c) {
                (_b = (_a = renderer.props).onAction) === null || _b === void 0 ? void 0 : _b.call(_a, event, tslib.__assign(tslib.__assign({}, action), { reload: 'none' }), action.args);
                return [2 /*return*/];
            });
        });
    };
    return DialogAction;
}());
/**
 * 关闭弹窗动作
 *
 * @export
 * @class CloseDialogAction
 * @implements {Action}
 */
var CloseDialogAction = /** @class */ (function () {
    function CloseDialogAction() {
    }
    CloseDialogAction.prototype.run = function (action, renderer, event) {
        var _a, _b;
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_c) {
                if (action.componentId) {
                    // 关闭指定弹窗
                    event.context.scoped.closeById(action.componentId);
                }
                else {
                    // 关闭当前弹窗
                    (_b = (_a = renderer.props).onAction) === null || _b === void 0 ? void 0 : _b.call(_a, event, tslib.__assign(tslib.__assign({}, action), { actionType: 'close' }), action.args);
                }
                return [2 /*return*/];
            });
        });
    };
    return CloseDialogAction;
}());
/**
 * alert提示动作
 */
var AlertAction = /** @class */ (function () {
    function AlertAction() {
    }
    AlertAction.prototype.run = function (action, renderer, event) {
        var _a, _b, _c;
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_d) {
                (_b = (_a = event.context.env).alert) === null || _b === void 0 ? void 0 : _b.call(_a, (_c = action.args) === null || _c === void 0 ? void 0 : _c.msg);
                return [2 /*return*/];
            });
        });
    };
    return AlertAction;
}());
/**
 * confirm确认提示动作
 */
var ConfirmAction = /** @class */ (function () {
    function ConfirmAction() {
    }
    ConfirmAction.prototype.run = function (action, renderer, event) {
        var _a, _b, _c, _d;
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_e) {
                (_b = (_a = event.context.env).confirm) === null || _b === void 0 ? void 0 : _b.call(_a, (_c = action.args) === null || _c === void 0 ? void 0 : _c.msg, (_d = action.args) === null || _d === void 0 ? void 0 : _d.title);
                return [2 /*return*/];
            });
        });
    };
    return ConfirmAction;
}());
Action.registerAction('dialog', new DialogAction());
Action.registerAction('closeDialog', new CloseDialogAction());
Action.registerAction('alert', new AlertAction());
Action.registerAction('confirmDialog', new ConfirmAction());

exports.AlertAction = AlertAction;
exports.CloseDialogAction = CloseDialogAction;
exports.ConfirmAction = ConfirmAction;
exports.DialogAction = DialogAction;
