/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __awaiter, __generator, __assign } from 'tslib';
import '../utils/helper.js';
import { evalExpression } from '../utils/tpl.js';
import 'amis-formula';
import 'moment';
import { createObject } from '../utils/object.js';
import { dataMapping } from '../utils/dataMapping.js';
import '../utils/filter.js';

// 循环动作执行状态
var LoopStatus;
(function (LoopStatus) {
    LoopStatus[LoopStatus["NORMAL"] = 0] = "NORMAL";
    LoopStatus[LoopStatus["BREAK"] = 1] = "BREAK";
    LoopStatus[LoopStatus["CONTINUE"] = 2] = "CONTINUE";
})(LoopStatus || (LoopStatus = {}));
// 存储 Action 和类型的映射关系，用于后续查找
var ActionTypeMap = {};
// 注册 Action
var registerAction = function (type, action) {
    ActionTypeMap[type] = action;
};
// 通过类型获取 Action 实例
var getActionByType = function (type) {
    return ActionTypeMap[type];
};
var runActions = function (actions, renderer, event) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, actions_1, actionConfig, actionInstrance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!Array.isArray(actions)) {
                    actions = [actions];
                }
                _i = 0, actions_1 = actions;
                _a.label = 1;
            case 1:
                if (!(_i < actions_1.length)) return [3 /*break*/, 4];
                actionConfig = actions_1[_i];
                actionInstrance = getActionByType(actionConfig.actionType);
                // 如果存在指定组件ID，说明是组件专有动作
                if (!actionInstrance && actionConfig.componentId) {
                    actionInstrance = getActionByType('component');
                }
                else if (actionConfig.actionType === 'url' ||
                    actionConfig.actionType === 'link' ||
                    actionConfig.actionType === 'jump') {
                    // 打开页面动作
                    actionInstrance = getActionByType('openlink');
                }
                // 找不到就通过组件专有动作完成
                if (!actionInstrance) {
                    actionInstrance = getActionByType('component');
                }
                // 这些节点的子节点运行逻辑由节点内部实现
                return [4 /*yield*/, runAction(actionInstrance, actionConfig, renderer, event)];
            case 2:
                // 这些节点的子节点运行逻辑由节点内部实现
                _a.sent();
                if (event.stoped) {
                    return [3 /*break*/, 4];
                }
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 执行动作，与原有动作处理打通
var runAction = function (actionInstrance, actionConfig, renderer, event) { return __awaiter(void 0, void 0, void 0, function () {
    var mergeData, expression, preventDefault, stopPropagation, args;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mergeData = renderer.props.data.__super
                    ? createObject(createObject(renderer.props.data.__super, {
                        event: event
                    }), renderer.props.data)
                    : createObject({
                        event: event
                    }, renderer.props.data);
                expression = (_a = actionConfig.expression) !== null && _a !== void 0 ? _a : actionConfig.execOn;
                if (expression && !evalExpression(expression, mergeData)) {
                    return [2 /*return*/];
                }
                preventDefault = actionConfig.preventDefault &&
                    evalExpression(String(actionConfig.preventDefault), mergeData);
                stopPropagation = actionConfig.stopPropagation &&
                    evalExpression(String(actionConfig.stopPropagation), mergeData);
                args = event.data;
                if (actionConfig.args) {
                    args = dataMapping(actionConfig.args, mergeData, function (key) {
                        return ['adaptor', 'responseAdaptor', 'requestAdaptor'].includes(key);
                    });
                }
                return [4 /*yield*/, actionInstrance.run(__assign(__assign({}, actionConfig), { args: args }), renderer, event, mergeData)];
            case 1:
                _b.sent();
                // 阻止原有动作执行
                preventDefault && event.preventDefault();
                // 阻止后续动作执行
                stopPropagation && event.stopPropagation();
                return [2 /*return*/];
        }
    });
}); };

export { LoopStatus, getActionByType, registerAction, runAction, runActions };
