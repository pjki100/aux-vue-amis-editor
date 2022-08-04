/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __awaiter, __generator, __assign, __spreadArray } from 'tslib';
import '../utils/helper.js';
import { createObject } from '../utils/object.js';

/**
 * 渲染器事件派发
 *
 * @param props 组件props
 * @param e 事件类型
 * @param ctx 上下文数据
 */
function rendererEventDispatcher(props, e, ctx) {
    if (ctx === void 0) { ctx = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var dispatchEvent, data;
        return __generator(this, function (_a) {
            dispatchEvent = props.dispatchEvent, data = props.data;
            return [2 /*return*/, dispatchEvent(e, createObject(data, ctx))];
        });
    });
}
/**
 * 渲染器事件方法装饰器
 *
 * @param event 事件类型
 * @param ctx 上下文数据
 * @returns {Function}
 */
function bindRendererEvent(event, ctx, preventable) {
    if (preventable === void 0) { preventable = true; }
    return function (target, propertyKey, descriptor) {
        var fn = descriptor.value && typeof descriptor.value === 'function'
            ? descriptor.value
            : typeof (descriptor === null || descriptor === void 0 ? void 0 : descriptor.get) === 'function'
                ? descriptor.get()
                : null;
        if (!fn || typeof fn !== 'function') {
            throw new Error("decorator can only be applied to methods not: ".concat(typeof fn));
        }
        return __assign(__assign({}, descriptor), { value: function boundFn() {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                return __awaiter(this, void 0, void 0, function () {
                    var triggerProps, value, dispatcher;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                triggerProps = this === null || this === void 0 ? void 0 : this.props;
                                value = triggerProps === null || triggerProps === void 0 ? void 0 : triggerProps.value;
                                // clear清除内容事件
                                if (typeof event === 'string' && event === 'clear') {
                                    value = triggerProps === null || triggerProps === void 0 ? void 0 : triggerProps.resetValue;
                                }
                                if (!(preventable === false)) return [3 /*break*/, 1];
                                rendererEventDispatcher(triggerProps, event, {
                                    value: value
                                });
                                return [3 /*break*/, 3];
                            case 1: return [4 /*yield*/, rendererEventDispatcher(triggerProps, event, {
                                    value: value
                                })];
                            case 2:
                                dispatcher = _a.sent();
                                if (dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented) {
                                    return [2 /*return*/];
                                }
                                _a.label = 3;
                            case 3: return [2 /*return*/, fn.apply(this, __spreadArray([], params, true))];
                        }
                    });
                });
            } });
    };
}

export { bindRendererEvent, rendererEventDispatcher };
