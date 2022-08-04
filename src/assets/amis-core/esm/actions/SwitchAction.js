/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __awaiter, __generator } from 'tslib';
import { evalExpression } from '../utils/tpl.js';
import { registerAction, runActions } from './Action.js';

/**
 * 排他动作
 */
var SwitchAction = /** @class */ (function () {
    function SwitchAction() {
    }
    SwitchAction.prototype.run = function (action, renderer, event, mergeData) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, branch;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = action.children || [];
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        branch = _a[_i];
                        if (!branch.expression) {
                            return [3 /*break*/, 3];
                        }
                        if (!evalExpression(branch.expression, mergeData)) return [3 /*break*/, 3];
                        return [4 /*yield*/, runActions(branch, renderer, event)];
                    case 2:
                        _b.sent();
                        // 去掉runAllMatch，这里只做排他，多个可以直接通过expression
                        return [3 /*break*/, 4];
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return SwitchAction;
}());
registerAction('switch', new SwitchAction());

export { SwitchAction };
