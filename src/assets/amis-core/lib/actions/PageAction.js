/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var Action = require('./Action.js');

/**
 * 返回上个页面
 *
 * @export
 * @class PageGoBackAction
 * @implements {Action}
 */
var PageGoBackAction = /** @class */ (function () {
    function PageGoBackAction() {
    }
    PageGoBackAction.prototype.run = function (action, renderer, event) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                window.history.back();
                return [2 /*return*/];
            });
        });
    };
    return PageGoBackAction;
}());
/**
 * 到指定页面
 *
 * @export
 * @class PageGoAction
 * @implements {Action}
 */
var PageGoAction = /** @class */ (function () {
    function PageGoAction() {
    }
    PageGoAction.prototype.run = function (action, renderer, event) {
        var _a;
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_b) {
                window.history.go(((_a = action.args) === null || _a === void 0 ? void 0 : _a.delta) || 0);
                return [2 /*return*/];
            });
        });
    };
    return PageGoAction;
}());
/**
 * 浏览器刷新
 *
 * @export
 * @class PageRefreshAction
 * @implements {Action}
 */
var PageRefreshAction = /** @class */ (function () {
    function PageRefreshAction() {
    }
    PageRefreshAction.prototype.run = function (action, renderer, event) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                window.location.reload();
                return [2 /*return*/];
            });
        });
    };
    return PageRefreshAction;
}());
Action.registerAction('goBack', new PageGoBackAction());
Action.registerAction('refresh', new PageRefreshAction());
Action.registerAction('goPage', new PageGoAction());

exports.PageGoAction = PageGoAction;
exports.PageGoBackAction = PageGoBackAction;
exports.PageRefreshAction = PageRefreshAction;
