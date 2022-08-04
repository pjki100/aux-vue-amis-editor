/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __awaiter, __generator } from 'tslib';
import '../utils/helper.js';
import { dispatchEvent } from '../utils/renderer-event.js';
import { registerAction } from './Action.js';
import { createObject } from '../utils/object.js';

/**
 * broadcast
 *
 * @export
 * @class BroadcastAction
 * @implements {Action}
 */
var BroadcastAction = /** @class */ (function () {
    function BroadcastAction() {
    }
    BroadcastAction.prototype.run = function (action, renderer, event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!action.eventName) {
                            console.error('eventName 未定义，请定义事件名称');
                            return [2 /*return*/];
                        }
                        // 作为一个新的事件，需要把广播动作的args参数追加到事件数据中
                        event.setData(createObject(event.data, action.args));
                        return [4 /*yield*/, dispatchEvent(action.eventName, renderer, event.context.scoped, action.args, event)];
                    case 1: 
                    // 直接触发对应的动作
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return BroadcastAction;
}());
registerAction('broadcast', new BroadcastAction());

export { BroadcastAction };
