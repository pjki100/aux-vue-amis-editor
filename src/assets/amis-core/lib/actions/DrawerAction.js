/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var Action = require('./Action.js');

/**
 * 打开抽屉动作
 *
 * @export
 * @class DrawerAction
 * @implements {Action}
 */
var DrawerAction = /** @class */ (function () {
    function DrawerAction() {
    }
    DrawerAction.prototype.run = function (action, renderer, event) {
        var _a, _b;
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_c) {
                (_b = (_a = renderer.props).onAction) === null || _b === void 0 ? void 0 : _b.call(_a, event, action, action.args);
                return [2 /*return*/];
            });
        });
    };
    return DrawerAction;
}());
/**
 * 关闭抽屉动作
 *
 * @export
 * @class CloseDrawerAction
 * @implements {Action}
 */
var CloseDrawerAction = /** @class */ (function () {
    function CloseDrawerAction() {
    }
    CloseDrawerAction.prototype.run = function (action, renderer, event) {
        var _a, _b;
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_c) {
                if (action.componentId) {
                    // 关闭指定抽屉
                    event.context.scoped.closeById(action.componentId);
                }
                else {
                    // 关闭当前抽屉
                    (_b = (_a = renderer.props).onAction) === null || _b === void 0 ? void 0 : _b.call(_a, event, tslib.__assign(tslib.__assign({}, action), { actionType: 'close' }), action.args);
                }
                return [2 /*return*/];
            });
        });
    };
    return CloseDrawerAction;
}());
Action.registerAction('drawer', new DrawerAction());
Action.registerAction('closeDrawer', new CloseDrawerAction());

exports.CloseDrawerAction = CloseDrawerAction;
exports.DrawerAction = DrawerAction;
