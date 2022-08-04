/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __awaiter, __generator, __assign } from 'tslib';
import { buildApi } from '../utils/api.js';
import omit from 'lodash/omit';
import { registerAction } from './Action.js';

/**
 * 打开页面动作
 *
 * @export
 * @class LinkAction
 * @implements {Action}
 */
var LinkAction = /** @class */ (function () {
    function LinkAction() {
    }
    LinkAction.prototype.run = function (action, renderer, event) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var urlObj;
            return __generator(this, function (_g) {
                if (!((_a = renderer.props.env) === null || _a === void 0 ? void 0 : _a.jumpTo)) {
                    throw new Error('env.jumpTo is required!');
                }
                urlObj = buildApi({
                    url: (((_b = action.args) === null || _b === void 0 ? void 0 : _b.url) || ((_c = action.args) === null || _c === void 0 ? void 0 : _c.link)),
                    method: 'get'
                }, __assign(__assign({}, ((_e = (_d = action.args) === null || _d === void 0 ? void 0 : _d.params) !== null && _e !== void 0 ? _e : {})), omit((_f = action.args) !== null && _f !== void 0 ? _f : {}, ['params', 'blank', 'url', 'link'])), {
                    autoAppend: true
                });
                renderer.props.env.jumpTo(urlObj.url, __assign({ actionType: action.actionType, type: 'button' }, action.args), action.args);
                return [2 /*return*/];
            });
        });
    };
    return LinkAction;
}());
registerAction('openlink', new LinkAction());

export { LinkAction };
