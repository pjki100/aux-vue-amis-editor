/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var Action = require('./Action.js');

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
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                renderer.loopStatus = Action.LoopStatus.CONTINUE;
                return [2 /*return*/];
            });
        });
    };
    return ContinueAction;
}());
Action.registerAction('continue', new ContinueAction());

exports.ContinueAction = ContinueAction;
