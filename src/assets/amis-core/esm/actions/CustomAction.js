/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __awaiter, __generator } from 'tslib';
import { registerAction, runActions } from './Action.js';

/**
 * 自定义动作，JS脚本
 *
 * @export
 * @class CustomAction
 * @implements {ActionObject}
 */
var CustomAction = /** @class */ (function () {
    function CustomAction() {
    }
    CustomAction.prototype.run = function (action, renderer, event) {
        return __awaiter(this, void 0, void 0, function () {
            var scriptFunc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scriptFunc = action.script;
                        if (typeof scriptFunc === 'string') {
                            scriptFunc = new Function('context', 'doAction', 'event', scriptFunc);
                        }
                        // 外部可以直接调用doAction来完成动作调用
                        // 可以通过上下文直接编排动作调用，通过event来进行动作干预
                        return [4 /*yield*/, (scriptFunc === null || scriptFunc === void 0 ? void 0 : scriptFunc.call(null, renderer, function (action) { return runActions(action, renderer, event); }, event, action))];
                    case 1:
                        // 外部可以直接调用doAction来完成动作调用
                        // 可以通过上下文直接编排动作调用，通过event来进行动作干预
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return CustomAction;
}());
registerAction('custom', new CustomAction());

export { CustomAction };
