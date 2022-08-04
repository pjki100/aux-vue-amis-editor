/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var Action = require('./Action.js');

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
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                renderer.loopStatus = Action.LoopStatus.BREAK;
                return [2 /*return*/];
            });
        });
    };
    return BreakAction;
}());
Action.registerAction('break', new BreakAction());

exports.BreakAction = BreakAction;
