/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __awaiter, __generator, __assign } from 'tslib';
import omit from 'lodash/omit';
import { normalizeApiResponseData } from '../utils/api.js';
import { ServerError } from '../utils/errors.js';
import { isEmpty } from '../utils/helper.js';
import { registerAction } from './Action.js';
import { createObject } from '../utils/object.js';

/**
 * 发送请求动作
 *
 * @export
 * @class AjaxAction
 * @implements {Action}
 */
var AjaxAction = /** @class */ (function () {
    function AjaxAction(fetcherType) {
        if (fetcherType === void 0) { fetcherType = 'ajax'; }
        this.fetcherType = fetcherType;
    }
    AjaxAction.prototype.run = function (action, renderer, event) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __awaiter(this, void 0, void 0, function () {
            var env, result, responseData, msg, e_1, result;
            var _s;
            return __generator(this, function (_t) {
                switch (_t.label) {
                    case 0:
                        if (!((_a = renderer.props.env) === null || _a === void 0 ? void 0 : _a.fetcher)) {
                            throw new Error('env.fetcher is required!');
                        }
                        if (this.fetcherType === 'download' && action.actionType === 'download') {
                            if ((_b = action.args) === null || _b === void 0 ? void 0 : _b.api) {
                                action.args.api.responseType = 'blob';
                            }
                        }
                        env = event.context.env;
                        _t.label = 1;
                    case 1:
                        _t.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, env.fetcher((_c = action.args) === null || _c === void 0 ? void 0 : _c.api, omit((_d = action.args) !== null && _d !== void 0 ? _d : {}, ['api', 'options', 'messages']), (_f = (_e = action.args) === null || _e === void 0 ? void 0 : _e.options) !== null && _f !== void 0 ? _f : {})];
                    case 2:
                        result = _t.sent();
                        responseData = !isEmpty(result.data) || result.ok
                            ? normalizeApiResponseData(result.data)
                            : null;
                        // 记录请求返回的数据
                        event.setData(createObject(event.data, __assign(__assign({}, responseData), (_s = { responseData: responseData }, _s[action.outputVar || 'responseResult'] = __assign(__assign({}, responseData), { responseData: responseData, responseStatus: result.status, responseMsg: result.msg }), _s))));
                        if (!((_h = (_g = action.args) === null || _g === void 0 ? void 0 : _g.options) === null || _h === void 0 ? void 0 : _h.silent)) {
                            if (!result.ok) {
                                throw new ServerError((_l = (_k = (_j = action.args) === null || _j === void 0 ? void 0 : _j.messages) === null || _k === void 0 ? void 0 : _k.failed) !== null && _l !== void 0 ? _l : result.msg, result);
                            }
                            else {
                                msg = (_p = (_o = (_m = action.args) === null || _m === void 0 ? void 0 : _m.messages) === null || _o === void 0 ? void 0 : _o.success) !== null && _p !== void 0 ? _p : result.msg;
                                msg &&
                                    env.notify('success', msg, result.msgTimeout !== undefined
                                        ? {
                                            closeButton: true,
                                            timeout: result.msgTimeout
                                        }
                                        : undefined);
                            }
                        }
                        return [2 /*return*/, result.data];
                    case 3:
                        e_1 = _t.sent();
                        if (!((_r = (_q = action.args) === null || _q === void 0 ? void 0 : _q.options) === null || _r === void 0 ? void 0 : _r.silent)) {
                            if (e_1.type === 'ServerError') {
                                result = e_1.response;
                                env.notify('error', e_1.message, result.msgTimeout !== undefined
                                    ? {
                                        closeButton: true,
                                        timeout: result.msgTimeout
                                    }
                                    : undefined);
                            }
                            else {
                                env.notify('error', e_1.message);
                            }
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return AjaxAction;
}());
registerAction('ajax', new AjaxAction());
registerAction('download', new AjaxAction('download'));

export { AjaxAction };
