/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __awaiter, __generator } from 'tslib';
import { registerAction, LoopStatus } from './Action.js';

/**
 * breach
 *
 * @export
 * @class BreakAction
 * @implements {Action}
 */
var BreakAction = /** @class */ (function () {
    function BreakAction() {
    }
    BreakAction.prototype.run = function (action, renderer, event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                renderer.loopStatus = LoopStatus.BREAK;
                return [2 /*return*/];
            });
        });
    };
    return BreakAction;
}());
registerAction('break', new BreakAction());

export { BreakAction };
