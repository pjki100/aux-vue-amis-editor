/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __awaiter, __generator } from 'tslib';
import { registerAction } from './Action.js';

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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                window.location.reload();
                return [2 /*return*/];
            });
        });
    };
    return PageRefreshAction;
}());
registerAction('goBack', new PageGoBackAction());
registerAction('refresh', new PageRefreshAction());
registerAction('goPage', new PageGoAction());

export { PageGoAction, PageGoBackAction, PageRefreshAction };
