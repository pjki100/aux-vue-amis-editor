/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __awaiter, __generator } from 'tslib';
import { registerAction } from './Action.js';

/**
 * 全局toast
 */
var ToastAction = /** @class */ (function () {
    function ToastAction() {
    }
    ToastAction.prototype.run = function (action, renderer, event) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_f) {
                if (!((_a = renderer.props.env) === null || _a === void 0 ? void 0 : _a.notify)) {
                    throw new Error('env.notify is required!');
                }
                (_c = (_b = event.context.env).notify) === null || _c === void 0 ? void 0 : _c.call(_b, ((_d = action.args) === null || _d === void 0 ? void 0 : _d.msgType) || 'info', String((_e = action.args) === null || _e === void 0 ? void 0 : _e.msg), action.args);
                return [2 /*return*/];
            });
        });
    };
    return ToastAction;
}());
registerAction('toast', new ToastAction());

export { ToastAction };
