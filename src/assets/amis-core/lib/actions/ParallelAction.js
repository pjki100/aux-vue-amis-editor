/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var Action = require('./Action.js');

var ParallelAction = /** @class */ (function () {
    function ParallelAction() {
    }
    ParallelAction.prototype.run = function (action, renderer, event) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var childActions;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(action.children && action.children.length)) return [3 /*break*/, 2];
                        childActions = action.children.map(function (child) {
                            // 并行动作互不干扰，但不管哪个存在干预都对后续动作生效
                            return Action.runActions(child, renderer, event);
                        });
                        return [4 /*yield*/, Promise.all(childActions)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return ParallelAction;
}());
Action.registerAction('parallel', new ParallelAction());

exports.ParallelAction = ParallelAction;
