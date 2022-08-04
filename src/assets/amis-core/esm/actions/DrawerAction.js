/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __awaiter, __generator, __assign } from 'tslib';
import { registerAction } from './Action.js';

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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                if (action.componentId) {
                    // 关闭指定抽屉
                    event.context.scoped.closeById(action.componentId);
                }
                else {
                    // 关闭当前抽屉
                    (_b = (_a = renderer.props).onAction) === null || _b === void 0 ? void 0 : _b.call(_a, event, __assign(__assign({}, action), { actionType: 'close' }), action.args);
                }
                return [2 /*return*/];
            });
        });
    };
    return CloseDrawerAction;
}());
registerAction('drawer', new DrawerAction());
registerAction('closeDrawer', new CloseDrawerAction());

export { CloseDrawerAction, DrawerAction };
