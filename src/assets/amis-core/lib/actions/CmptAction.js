/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var Action = require('./Action.js');

/**
 * 组件动作
 *
 * @export
 * @class CmptAction
 * @implements {Action}
 */
var CmptAction = /** @class */ (function () {
    function CmptAction() {
    }
    CmptAction.prototype.run = function (action, renderer, event) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return tslib.__awaiter(this, void 0, void 0, function () {
            var component;
            return tslib.__generator(this, function (_j) {
                component = action.componentId && renderer.props.$schema.id !== action.componentId
                    ? (_a = event.context.scoped) === null || _a === void 0 ? void 0 : _a.getComponentById(action.componentId)
                    : renderer;
                // 显隐&状态控制
                if (['show', 'hidden'].includes(action.actionType)) {
                    return [2 /*return*/, renderer.props.topStore.setVisible(action.componentId, action.actionType === 'show')];
                }
                else if (['enabled', 'disabled'].includes(action.actionType)) {
                    return [2 /*return*/, renderer.props.topStore.setDisable(action.componentId, action.actionType === 'disabled')];
                }
                // 数据更新
                if (action.actionType === 'setValue') {
                    if (component === null || component === void 0 ? void 0 : component.setData) {
                        return [2 /*return*/, component === null || component === void 0 ? void 0 : component.setData((_b = action.args) === null || _b === void 0 ? void 0 : _b.value, (_c = action.args) === null || _c === void 0 ? void 0 : _c.index)];
                    }
                    else {
                        return [2 /*return*/, (_e = component === null || component === void 0 ? void 0 : (_d = component.props).onChange) === null || _e === void 0 ? void 0 : _e.call(_d, (_f = action.args) === null || _f === void 0 ? void 0 : _f.value)];
                    }
                }
                // 刷新
                if (action.actionType === 'reload') {
                    return [2 /*return*/, (_g = component === null || component === void 0 ? void 0 : component.reload) === null || _g === void 0 ? void 0 : _g.call(component, undefined, action.args)];
                }
                // 执行组件动作
                return [2 /*return*/, (_h = component === null || component === void 0 ? void 0 : component.doAction) === null || _h === void 0 ? void 0 : _h.call(component, action, action.args)];
            });
        });
    };
    return CmptAction;
}());
Action.registerAction('component', new CmptAction());

exports.CmptAction = CmptAction;
