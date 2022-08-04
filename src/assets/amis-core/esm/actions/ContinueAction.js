/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __awaiter, __generator } from 'tslib';
import { registerAction, LoopStatus } from './Action.js';

/**
 * continue
 *
 * @export
 * @class ContinueAction
 * @implements {Action}
 */
var ContinueAction = /** @class */ (function () {
    function ContinueAction() {
    }
    ContinueAction.prototype.run = function (action, renderer, event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                renderer.loopStatus = LoopStatus.CONTINUE;
                return [2 /*return*/];
            });
        });
    };
    return ContinueAction;
}());
registerAction('continue', new ContinueAction());

export { ContinueAction };
