/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var mobxStateTree = require('mobx-state-tree');
var isEqualWith = require('lodash/isEqualWith');
var form = require('./form.js');
var validations = require('../utils/validations.js');
var combo = require('./combo.js');
var tpl = require('../utils/tpl.js');
var api = require('../utils/api.js');
var findIndex = require('lodash/findIndex');
var helper = require('../utils/helper.js');
var find = require('lodash/find');
var isPlainObject = require('lodash/isPlainObject');
var SimpleMap = require('../utils/SimpleMap.js');
var node = require('./node.js');
var manager = require('./manager.js');
var normalizeOptions = require('../utils/normalizeOptions.js');
var optionValueCompare = require('../utils/optionValueCompare.js');
var object = require('../utils/object.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isEqualWith__default = /*#__PURE__*/_interopDefaultLegacy(isEqualWith);
var findIndex__default = /*#__PURE__*/_interopDefaultLegacy(findIndex);
var find__default = /*#__PURE__*/_interopDefaultLegacy(find);
var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject);

var ErrorDetail = mobxStateTree.types.model('ErrorDetail', {
    msg: '',
    tag: '',
    rule: ''
});
var FormItemStore = node.StoreNode.named('FormItemStore')
    .props({
    isFocused: false,
    type: '',
    label: '',
    unique: false,
    loading: false,
    required: false,
    tmpValue: mobxStateTree.types.frozen(),
    emitedValue: mobxStateTree.types.frozen(),
    rules: mobxStateTree.types.optional(mobxStateTree.types.frozen(), {}),
    messages: mobxStateTree.types.optional(mobxStateTree.types.frozen(), {}),
    errorData: mobxStateTree.types.optional(mobxStateTree.types.array(ErrorDetail), []),
    name: mobxStateTree.types.string,
    itemId: '',
    unsetValueOnInvisible: false,
    itemsRef: mobxStateTree.types.optional(mobxStateTree.types.array(mobxStateTree.types.string), []),
    validated: false,
    validating: false,
    multiple: false,
    delimiter: ',',
    valueField: 'value',
    labelField: 'label',
    joinValues: true,
    extractValue: false,
    options: mobxStateTree.types.optional(mobxStateTree.types.frozen(), []),
    expressionsInOptions: false,
    selectFirst: false,
    autoFill: mobxStateTree.types.frozen(),
    clearValueOnHidden: false,
    validateApi: mobxStateTree.types.optional(mobxStateTree.types.frozen(), ''),
    selectedOptions: mobxStateTree.types.optional(mobxStateTree.types.frozen(), []),
    filteredOptions: mobxStateTree.types.optional(mobxStateTree.types.frozen(), []),
    dialogSchema: mobxStateTree.types.frozen(),
    dialogOpen: false,
    dialogData: mobxStateTree.types.frozen(),
    resetValue: mobxStateTree.types.optional(mobxStateTree.types.frozen(), ''),
    validateOnChange: false
})
    .views(function (self) {
    function getForm() {
        var form$1 = self.parentStore;
        return (form$1 === null || form$1 === void 0 ? void 0 : form$1.storeType) === form.FormStore.name ? form$1 : undefined;
    }
    function getValue() {
        var _a;
        return (_a = getForm()) === null || _a === void 0 ? void 0 : _a.getValueByName(self.name);
    }
    function getLastOptionValue() {
        if (self.selectedOptions.length) {
            return self.selectedOptions[self.selectedOptions.length - 1].value;
        }
        return '';
    }
    function getErrors() {
        return self.errorData.map(function (item) { return item.msg; });
    }
    return {
        get subFormItems() {
            return self.itemsRef.map(function (item) { return manager.getStoreById(item); });
        },
        get form() {
            return getForm();
        },
        get value() {
            return getValue();
        },
        get prinstine() {
            var _a;
            return (_a = getForm()) === null || _a === void 0 ? void 0 : _a.getPristineValueByName(self.name);
        },
        get errors() {
            return getErrors();
        },
        get valid() {
            var errors = getErrors();
            return !!(!errors || !errors.length);
        },
        get errClassNames() {
            return self.errorData
                .map(function (item) { return item.rule; })
                .filter(function (item, index, arr) { return item && arr.indexOf(item) === index; })
                .map(function (item) { return "has-error--".concat(item); })
                .join(' ');
        },
        get lastSelectValue() {
            return getLastOptionValue();
        },
        getSelectedOptions: function (value, nodeValueArray) {
            if (value === void 0) { value = self.tmpValue; }
            if (typeof value === 'undefined') {
                return [];
            }
            var valueArray = nodeValueArray
                ? nodeValueArray
                : Array.isArray(value)
                    ? value
                    : typeof value === 'string'
                        ? value.split(self.delimiter || ',')
                        : [value];
            var selected = valueArray.map(function (item) {
                return item && item.hasOwnProperty(self.valueField || 'value')
                    ? item[self.valueField || 'value']
                    : item;
            });
            var selectedOptions = [];
            selected.forEach(function (item, index) {
                var _a, _b;
                var matched = helper.findTree(self.filteredOptions, optionValueCompare.optionValueCompare(item, self.valueField || 'value'));
                if (matched) {
                    selectedOptions.push(matched);
                }
                else {
                    var unMatched = (valueArray && valueArray[index]) || item;
                    if (unMatched &&
                        (typeof unMatched === 'string' || typeof unMatched === 'number')) {
                        unMatched = (_a = {},
                            _a[self.valueField || 'value'] = item,
                            _a[self.labelField || 'label'] = item,
                            _a.__unmatched = true,
                            _a);
                    }
                    else if (unMatched && self.extractValue) {
                        unMatched = (_b = {},
                            _b[self.valueField || 'value'] = item,
                            _b[self.labelField || 'label'] = 'UnKnown',
                            _b.__unmatched = true,
                            _b);
                    }
                    unMatched && selectedOptions.push(unMatched);
                }
            });
            return selectedOptions;
        }
    };
})
    .actions(function (self) {
    self.form;
    var dialogCallbacks = new SimpleMap.SimpleMap();
    var loadAutoUpdateCancel = null;
    function config(_a) {
        var required = _a.required, unique = _a.unique; _a.value; var rules = _a.rules, messages = _a.messages, delimiter = _a.delimiter, multiple = _a.multiple, valueField = _a.valueField, labelField = _a.labelField, joinValues = _a.joinValues, extractValue = _a.extractValue, type = _a.type, id = _a.id, selectFirst = _a.selectFirst, autoFill = _a.autoFill, clearValueOnHidden = _a.clearValueOnHidden, validateApi = _a.validateApi, maxLength = _a.maxLength, minLength = _a.minLength, validateOnChange = _a.validateOnChange, label = _a.label;
        if (typeof rules === 'string') {
            rules = validations.str2rules(rules);
        }
        typeof type !== 'undefined' && (self.type = type);
        typeof id !== 'undefined' && (self.itemId = id);
        typeof messages !== 'undefined' && (self.messages = messages);
        typeof required !== 'undefined' && (self.required = !!required);
        typeof unique !== 'undefined' && (self.unique = !!unique);
        typeof multiple !== 'undefined' && (self.multiple = !!multiple);
        typeof selectFirst !== 'undefined' && (self.selectFirst = !!selectFirst);
        typeof autoFill !== 'undefined' && (self.autoFill = autoFill);
        typeof joinValues !== 'undefined' && (self.joinValues = !!joinValues);
        typeof extractValue !== 'undefined' &&
            (self.extractValue = !!extractValue);
        typeof delimiter !== 'undefined' &&
            (self.delimiter = delimiter || ',');
        typeof valueField !== 'undefined' &&
            (self.valueField = valueField || 'value');
        typeof labelField !== 'undefined' &&
            (self.labelField = labelField || 'label');
        typeof clearValueOnHidden !== 'undefined' &&
            (self.clearValueOnHidden = !!clearValueOnHidden);
        typeof validateApi !== 'undefined' && (self.validateApi = validateApi);
        typeof validateOnChange !== 'undefined' &&
            (self.validateOnChange = !!validateOnChange);
        typeof label === 'string' && (self.label = label);
        rules = tslib.__assign(tslib.__assign({}, rules), { isRequired: self.required });
        // todo 这个弄个配置由渲染器自己来决定
        // 暂时先这样
        if (~['input-text', 'textarea'].indexOf(self.type)) {
            if (typeof minLength === 'number') {
                rules.minLength = minLength;
            }
            if (typeof maxLength === 'number') {
                rules.maxLength = maxLength;
            }
        }
        if (helper.isObjectShallowModified(rules, self.rules)) {
            self.rules = rules;
            clearError('builtin');
            self.validated = false;
        }
    }
    function focus() {
        self.isFocused = true;
    }
    function blur() {
        self.isFocused = false;
    }
    var validateCancel = null;
    var validate = mobxStateTree.flow(function validate(data, hook, customRules) {
        var json, combo, group;
        var _a;
        var _b, _c;
        return tslib.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (self.validating && !api.isEffectiveApi(self.validateApi, data)) {
                        return [2 /*return*/, self.valid];
                    }
                    self.validating = true;
                    clearError();
                    if (!hook) return [3 /*break*/, 2];
                    return [4 /*yield*/, hook()];
                case 1:
                    _d.sent();
                    _d.label = 2;
                case 2:
                    addError(validations.validate(self.tmpValue, data, customRules ? validations.str2rules(customRules) : self.rules, self.messages, self.__));
                    if (!(!self.errors.length && api.isEffectiveApi(self.validateApi, data))) return [3 /*break*/, 4];
                    if (validateCancel) {
                        validateCancel();
                        validateCancel = null;
                    }
                    return [4 /*yield*/, mobxStateTree.getEnv(self).fetcher(self.validateApi, 
                        /** 如果配置validateApi，需要将用户最新输入同步到数据域内 */
                        object.createObject(data, (_a = {}, _a[self.name] = self.tmpValue, _a)), {
                            cancelExecutor: function (executor) { return (validateCancel = executor); }
                        })];
                case 3:
                    json = _d.sent();
                    validateCancel = null;
                    if (!json.ok && json.status === 422 && json.errors) {
                        addError(String(json.errors || json.msg || "\u8868\u5355\u9879\u300C".concat(self.name, "\u300D\u6821\u9A8C\u5931\u8D25")));
                    }
                    _d.label = 4;
                case 4:
                    self.validated = true;
                    if (self.unique && ((_c = (_b = self.form) === null || _b === void 0 ? void 0 : _b.parentStore) === null || _c === void 0 ? void 0 : _c.storeType) === 'ComboStore') {
                        combo = self.form.parentStore;
                        group = combo.uniques.get(self.name);
                        if (group.items.some(function (item) {
                            return item !== self &&
                                self.tmpValue !== undefined &&
                                self.tmpValue !== '' &&
                                item.value === self.tmpValue;
                        })) {
                            addError(self.__('Form.unique'));
                        }
                    }
                    self.validating = false;
                    return [2 /*return*/, self.valid];
            }
        });
    });
    function setError(msg, tag) {
        if (tag === void 0) { tag = 'builtin'; }
        clearError();
        addError(msg, tag);
    }
    function addError(msg, tag) {
        if (tag === void 0) { tag = 'builtin'; }
        var msgs = Array.isArray(msg) ? msg : [msg];
        msgs.forEach(function (item) {
            return self.errorData.push({
                msg: typeof item === 'string' ? item : item.msg,
                rule: typeof item !== 'string' ? item.rule : undefined,
                tag: tag
            });
        });
    }
    function clearError(tag) {
        if (tag) {
            var filtered = self.errorData.filter(function (item) { return item.tag !== tag; });
            self.errorData.replace(filtered);
        }
        else {
            self.errorData.clear();
        }
    }
    function getFirstAvaibleOption(options) {
        if (!Array.isArray(options)) {
            return;
        }
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var option = options_1[_i];
            if (Array.isArray(option.children)) {
                var childFirst = getFirstAvaibleOption(option.children);
                if (childFirst !== undefined) {
                    return childFirst;
                }
            }
            else if (option[self.valueField || 'value'] != null &&
                !option.disabled) {
                return option;
            }
        }
    }
    function setOptions(options, onChange, data) {
        if (!Array.isArray(options)) {
            return;
        }
        options = helper.filterTree(options, function (item) { return item; });
        var originOptions = self.options.concat();
        self.options = options;
        syncOptions(originOptions, data);
        var selectedOptions;
        if (onChange &&
            self.selectFirst &&
            self.filteredOptions.length &&
            (selectedOptions = self.getSelectedOptions(self.value)) &&
            !selectedOptions.filter(function (item) { return !item.__unmatched; }).length) {
            var fistOption = getFirstAvaibleOption(self.filteredOptions);
            if (!fistOption) {
                return;
            }
            var list = [fistOption].map(function (item) {
                if (self.extractValue || self.joinValues) {
                    return item[self.valueField || 'value'];
                }
                return item;
            });
            var value = self.joinValues && self.multiple
                ? list.join(self.delimiter)
                : self.multiple
                    ? list
                    : list[0];
            onChange(value);
        }
    }
    var loadCancel = null;
    var fetchOptions = mobxStateTree.flow(function getInitData(api, data, config, setErrorFlag) {
        var json, result, e_1, env;
        var _a;
        return tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (loadCancel) {
                        loadCancel();
                        loadCancel = null;
                        self.loading = false;
                    }
                    if (!(config === null || config === void 0 ? void 0 : config.silent)) {
                        self.loading = true;
                    }
                    return [4 /*yield*/, mobxStateTree.getEnv(self).fetcher(api, data, tslib.__assign({ autoAppend: false, cancelExecutor: function (executor) { return (loadCancel = executor); } }, config))];
                case 1:
                    json = _b.sent();
                    loadCancel = null;
                    result = null;
                    if (!json.ok) {
                        setErrorFlag !== false &&
                            setError(self.__('Form.loadOptionsFailed', {
                                reason: (_a = json.msg) !== null && _a !== void 0 ? _a : (config && config.errorMessage)
                            }));
                        mobxStateTree.getEnv(self).notify('error', self.errors.join('') || "".concat(api, "\uFF1A").concat(json.msg), json.msgTimeout !== undefined
                            ? {
                                closeButton: true,
                                timeout: json.msgTimeout
                            }
                            : undefined);
                    }
                    else {
                        result = json;
                    }
                    self.loading = false;
                    return [2 /*return*/, result];
                case 2:
                    e_1 = _b.sent();
                    env = mobxStateTree.getEnv(self);
                    if (!mobxStateTree.isAlive(self) || self.disposed) {
                        return [2 /*return*/];
                    }
                    self.loading = false;
                    if (env.isCancel(e_1)) {
                        return [2 /*return*/];
                    }
                    console.error(e_1.stack);
                    env.notify('error', e_1.message);
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    });
    var loadOptions = mobxStateTree.flow(function getInitData(api, data, config, clearValue, onChange, setErrorFlag) {
        var json, options;
        var _a, _b, _c;
        return tslib.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, fetchOptions(api, data, config, setErrorFlag)];
                case 1:
                    json = _d.sent();
                    if (!json) {
                        return [2 /*return*/];
                    }
                    clearError();
                    self.validated = false; // 拉完数据应该需要再校验一下
                    options = ((_a = json.data) === null || _a === void 0 ? void 0 : _a.options) ||
                        ((_b = json.data) === null || _b === void 0 ? void 0 : _b.items) ||
                        ((_c = json.data) === null || _c === void 0 ? void 0 : _c.rows) ||
                        json.data ||
                        [];
                    options = normalizeOptions.normalizeOptions(options, undefined, self.valueField);
                    if ((config === null || config === void 0 ? void 0 : config.extendsOptions) && self.selectedOptions.length > 0) {
                        self.selectedOptions.forEach(function (item) {
                            var exited = helper.findTree(options, optionValueCompare.optionValueCompare(item, self.valueField || 'value'));
                            if (!exited) {
                                options.push(item);
                            }
                        });
                    }
                    setOptions(options, onChange, data);
                    if (json.data && typeof json.data.value !== 'undefined') {
                        onChange && onChange(json.data.value, false, true);
                    }
                    else if (clearValue && !self.selectFirst) {
                        self.selectedOptions.some(function (item) { return item.__unmatched; }) &&
                            onChange &&
                            onChange('', false, true);
                    }
                    return [2 /*return*/, json];
            }
        });
    });
    var loadAutoUpdateData = mobxStateTree.flow(function getAutoUpdateData(api, data, silent) {
        var json, result;
        var _a, _b;
        if (silent === void 0) { silent = true; }
        return tslib.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (loadAutoUpdateCancel) {
                        loadAutoUpdateCancel();
                        loadAutoUpdateCancel = null;
                    }
                    return [4 /*yield*/, mobxStateTree.getEnv(self).fetcher(api, data, {
                            cancelExecutor: function (executor) {
                                return (loadAutoUpdateCancel = executor);
                            }
                        })];
                case 1:
                    json = _c.sent();
                    loadAutoUpdateCancel = null;
                    if (!json) {
                        return [2 /*return*/];
                    }
                    result = ((_a = json.data) === null || _a === void 0 ? void 0 : _a.items) || ((_b = json.data) === null || _b === void 0 ? void 0 : _b.rows);
                    // 只处理仅有一个结果的数据
                    if ((result === null || result === void 0 ? void 0 : result.length) === 1) {
                        return [2 /*return*/, result[0]];
                    }
                    else if (isPlainObject__default["default"](json.data)) {
                        return [2 /*return*/, json.data];
                    }
                    !silent &&
                        mobxStateTree.getEnv(self).notify('info', self.__('FormItem.autoFillLoadFailed'));
                    return [2 /*return*/];
            }
        });
    });
    var tryDeferLoadLeftOptions = mobxStateTree.flow(function (option, leftOptions, api, data, config) {
        var indexes, leftIndexes, topOption, json, options, newLeftOptions, children_1;
        var _a;
        return tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!Array.isArray(leftOptions)) {
                        return [2 /*return*/];
                    }
                    indexes = helper.findTreeIndex(self.options, function (item) { return item.leftOptions === leftOptions; });
                    leftIndexes = helper.findTreeIndex(leftOptions, function (item) { return item === option; });
                    topOption = helper.findTree(self.options, function (item) { return item.leftOptions === leftOptions; });
                    if (!indexes || !leftIndexes || !topOption) {
                        return [2 /*return*/];
                    }
                    setOptions(helper.spliceTree(self.options, indexes, 1, tslib.__assign(tslib.__assign({}, topOption), { loading: true, leftOptions: helper.spliceTree(topOption.leftOptions, leftIndexes, 1, tslib.__assign(tslib.__assign({}, option), { loading: true })) })), undefined, data);
                    return [4 /*yield*/, fetchOptions(api, data, tslib.__assign(tslib.__assign({}, config), { silent: true }), false)];
                case 1:
                    json = _b.sent();
                    if (!json) {
                        setOptions(helper.spliceTree(self.options, indexes, 1, tslib.__assign(tslib.__assign({}, topOption), { loading: false, error: true, leftOptions: helper.spliceTree(topOption.leftOptions, leftIndexes, 1, tslib.__assign(tslib.__assign({}, option), { loading: false, error: true })) })), undefined, data);
                        return [2 /*return*/];
                    }
                    options = ((_a = json.data) === null || _a === void 0 ? void 0 : _a.options) ||
                        json.data.items ||
                        json.data.rows ||
                        json.data ||
                        [];
                    newLeftOptions = helper.spliceTree(topOption.leftOptions, leftIndexes, 1, tslib.__assign(tslib.__assign({}, option), { loading: false, loaded: true, children: options }));
                    setOptions(helper.spliceTree(self.options, indexes, 1, tslib.__assign(tslib.__assign({}, topOption), { loading: false, loaded: true, children: options, leftOptions: newLeftOptions })), undefined, data);
                    // 插入新的子节点，用于之后BaseSelection.resolveSelected查找
                    if (Array.isArray(topOption.children)) {
                        children_1 = topOption.children.concat();
                        helper.flattenTree(newLeftOptions).forEach(function (item) {
                            if (!helper.findTree(topOption.children, function (node) { return node.ref === item.value; })) {
                                children_1.push({ ref: item.value, defer: true });
                            }
                        });
                        setOptions(helper.spliceTree(self.options, indexes, 1, tslib.__assign(tslib.__assign({}, topOption), { leftOptions: newLeftOptions, children: children_1 })), undefined, data);
                    }
                    return [2 /*return*/, json];
            }
        });
    });
    var deferLoadLeftOptions = mobxStateTree.flow(function (option, leftOptions, api, data, config) {
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tryDeferLoadLeftOptions(option, leftOptions, api, data, config)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
    var deferLoadOptions = mobxStateTree.flow(function (option, api, data, config) {
        var labelField, valueField, indexes, leftOptions, json, options;
        var _a, _b;
        return tslib.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    labelField = self.labelField || 'label';
                    valueField = self.valueField || 'value';
                    indexes = helper.findTreeIndex(self.options, function (item) {
                        return item === option ||
                            /** tree-select中会对option添加collapsed, visible属性，导致item === option不通过 */
                            isEqualWith__default["default"](item, option, function (source, target) {
                                return (source === null || source === void 0 ? void 0 : source[valueField]) != null &&
                                    (target === null || target === void 0 ? void 0 : target[valueField]) != null &&
                                    (source === null || source === void 0 ? void 0 : source[labelField]) === (target === null || target === void 0 ? void 0 : target[labelField]) &&
                                    (source === null || source === void 0 ? void 0 : source[valueField]) === (target === null || target === void 0 ? void 0 : target[valueField]);
                            });
                    });
                    if (!!indexes) return [3 /*break*/, 2];
                    leftOptions = (_a = self.options[0]) === null || _a === void 0 ? void 0 : _a.leftOptions;
                    return [4 /*yield*/, tryDeferLoadLeftOptions(option, leftOptions, api, data, config)];
                case 1: return [2 /*return*/, _c.sent()];
                case 2:
                    setOptions(helper.spliceTree(self.options, indexes, 1, tslib.__assign(tslib.__assign({}, option), { loading: true })), undefined, data);
                    return [4 /*yield*/, fetchOptions(api, data, tslib.__assign(tslib.__assign({}, config), { silent: true }), false)];
                case 3:
                    json = _c.sent();
                    if (!json) {
                        setOptions(helper.spliceTree(self.options, indexes, 1, tslib.__assign(tslib.__assign({}, option), { loading: false, error: true })), undefined, data);
                        return [2 /*return*/];
                    }
                    options = ((_b = json.data) === null || _b === void 0 ? void 0 : _b.options) ||
                        json.data.items ||
                        json.data.rows ||
                        json.data ||
                        [];
                    setOptions(helper.spliceTree(self.options, indexes, 1, tslib.__assign(tslib.__assign({}, option), { loading: false, loaded: true, children: options })), undefined, data);
                    return [2 /*return*/, json];
            }
        });
    });
    /**
     * 根据当前节点路径展开树形组件父节点
     */
    var expandTreeOptions = mobxStateTree.flow(function getInitData(nodePathArr, api, data, config) {
        var traversedNode, _i, nodePathArr_1, nodePath, _loop_1, level;
        var _a;
        return tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    traversedNode = new Map();
                    _i = 0, nodePathArr_1 = nodePathArr;
                    _b.label = 1;
                case 1:
                    if (!(_i < nodePathArr_1.length)) return [3 /*break*/, 6];
                    nodePath = nodePathArr_1[_i];
                    // 根节点已经展开了，不需要加载
                    if (nodePath.length <= 1) {
                        return [3 /*break*/, 5];
                    }
                    _loop_1 = function (level) {
                        var tree, nodeValue, node, indexes, json, childrenOptions;
                        return tslib.__generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    tree = self.options.concat();
                                    nodeValue = nodePath[level];
                                    if (traversedNode.has(nodeValue)) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    node = helper.findTree(tree, function (item, key, treeLevel) {
                                        return (treeLevel === level + 1 &&
                                            optionValueCompare.optionValueCompare(nodeValue, self.valueField || 'value')(item));
                                    });
                                    // 只处理懒加载节点
                                    if (!node || !node.defer) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    indexes = helper.findTreeIndex(tree, function (item) { return item === node; });
                                    setOptions(helper.spliceTree(tree, indexes, 1, tslib.__assign(tslib.__assign({}, node), { loading: true })), undefined, node);
                                    return [4 /*yield*/, fetchOptions(api, node, tslib.__assign(tslib.__assign({}, config), { silent: true }), false)];
                                case 1:
                                    json = _c.sent();
                                    if (!json) {
                                        setOptions(helper.spliceTree(tree, indexes, 1, tslib.__assign(tslib.__assign({}, node), { loading: false, error: true })), undefined, node);
                                    }
                                    traversedNode.set(nodeValue, true);
                                    childrenOptions = ((_a = json.data) === null || _a === void 0 ? void 0 : _a.options) ||
                                        json.data.items ||
                                        json.data.rows ||
                                        json.data ||
                                        [];
                                    setOptions(helper.spliceTree(tree, indexes, 1, tslib.__assign(tslib.__assign({}, node), { loading: false, loaded: true, children: childrenOptions })), undefined, node);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    level = 0;
                    _b.label = 2;
                case 2:
                    if (!(level < nodePath.length - 1)) return [3 /*break*/, 5];
                    return [5 /*yield**/, _loop_1(level)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    level++;
                    return [3 /*break*/, 2];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
    // @issue 强依赖form，需要改造暂且放过。
    function syncOptions(originOptions, data) {
        var _a;
        if (!self.options.length && typeof self.value === 'undefined') {
            self.selectedOptions = [];
            self.filteredOptions = [];
            return;
        }
        var value = self.tmpValue;
        var selected = Array.isArray(value)
            ? value.map(function (item) {
                return item && item.hasOwnProperty(self.valueField || 'value')
                    ? item[self.valueField || 'value']
                    : item;
            })
            : typeof value === 'string'
                ? value.split(self.delimiter || ',')
                : value === void 0
                    ? []
                    : [
                        value && value.hasOwnProperty(self.valueField || 'value')
                            ? value[self.valueField || 'value']
                            : value
                    ];
        if (value && value.hasOwnProperty(self.labelField || 'label')) {
            selected[0] = (_a = {},
                _a[self.labelField || 'label'] = value[self.labelField || 'label'],
                _a[self.valueField || 'value'] = value[self.valueField || 'value'],
                _a);
        }
        var expressionsInOptions = false;
        var filteredOptions = self.options
            .filter(function (item) {
            if (!expressionsInOptions &&
                (item.visibleOn || item.hiddenOn || item.disabledOn)) {
                expressionsInOptions = true;
            }
            return item.visibleOn
                ? tpl.evalExpression(item.visibleOn, data) !== false
                : item.hiddenOn
                    ? tpl.evalExpression(item.hiddenOn, data) !== true
                    : item.visible !== false || item.hidden !== true;
        })
            .map(function (item, index) {
            var disabled = tpl.evalExpression(item.disabledOn, data);
            var newItem = item.disabledOn
                ? self.filteredOptions.length > index &&
                    self.filteredOptions[index].disabled === disabled
                    ? self.filteredOptions[index]
                    : tslib.__assign(tslib.__assign({}, item), { disabled: disabled })
                : item;
            return newItem;
        });
        self.expressionsInOptions = expressionsInOptions;
        var flattened = helper.flattenTree(filteredOptions);
        var selectedOptions = [];
        selected.forEach(function (item, index) {
            var _a, _b;
            var idx = findIndex__default["default"](flattened, optionValueCompare.optionValueCompare(item, self.valueField || 'value'));
            if (~idx) {
                selectedOptions.push(flattened[idx]);
            }
            else {
                var unMatched = (value && value[index]) || item;
                if (unMatched &&
                    (typeof unMatched === 'string' || typeof unMatched === 'number')) {
                    unMatched = (_a = {},
                        _a[self.valueField || 'value'] = item,
                        _a[self.labelField || 'label'] = item,
                        _a.__unmatched = true,
                        _a);
                    var orgin = originOptions &&
                        find__default["default"](originOptions, optionValueCompare.optionValueCompare(item, self.valueField || 'value'));
                    if (orgin) {
                        unMatched[self.labelField || 'label'] =
                            orgin[self.labelField || 'label'];
                    }
                }
                else if (unMatched && self.extractValue) {
                    unMatched = (_b = {},
                        _b[self.valueField || 'value'] = item,
                        _b[self.labelField || 'label'] = 'UnKnown',
                        _b.__unmatched = true,
                        _b);
                }
                unMatched && selectedOptions.push(unMatched);
            }
        });
        var form = self.form;
        var parentStore = form === null || form === void 0 ? void 0 : form.parentStore;
        if ((parentStore === null || parentStore === void 0 ? void 0 : parentStore.storeType) === combo.ComboStore.name) {
            var combo$1 = parentStore;
            var group = combo$1.uniques.get(self.name);
            var options_2 = [];
            group &&
                group.items.forEach(function (item) {
                    if (self !== item) {
                        options_2.push.apply(options_2, item.selectedOptions.map(function (item) { return item && item.value; }));
                    }
                });
            if (filteredOptions.length) {
                filteredOptions = filteredOptions.filter(function (option) { return !~options_2.indexOf(option.value); });
            }
        }
        helper.isArrayChildrenModified(self.selectedOptions, selectedOptions) &&
            (self.selectedOptions = selectedOptions);
        helper.isArrayChildrenModified(self.filteredOptions, filteredOptions) &&
            (self.filteredOptions = filteredOptions);
    }
    function setLoading(value) {
        self.loading = value;
    }
    var subStore;
    function getSubStore() {
        return subStore;
    }
    function setSubStore(store) {
        subStore = store;
    }
    function reset(keepErrors) {
        if (keepErrors === void 0) { keepErrors = false; }
        self.validated = false;
        if (subStore && subStore.storeType === 'ComboStore') {
            var combo = subStore;
            combo.forms.forEach(function (form) { return form.reset(); });
        }
        !keepErrors && clearError();
    }
    function openDialog(schema, data, callback) {
        self.dialogSchema = schema;
        self.dialogData = data;
        self.dialogOpen = true;
        callback && dialogCallbacks.set(self.dialogData, callback);
    }
    function closeDialog(result) {
        var callback = dialogCallbacks.get(self.dialogData);
        self.dialogOpen = false;
        if (callback) {
            dialogCallbacks.delete(self.dialogData);
            setTimeout(function () { return callback(result); }, 200);
        }
    }
    function changeTmpValue(value) {
        self.tmpValue = value;
    }
    function changeEmitedValue(value) {
        self.emitedValue = value;
    }
    function addSubFormItem(item) {
        self.itemsRef.push(item.id);
    }
    function removeSubFormItem(item) {
        var idx = self.itemsRef.findIndex(function (a) { return a === item.id; });
        if (~idx) {
            self.itemsRef.splice(idx, 1);
        }
    }
    return {
        focus: focus,
        blur: blur,
        config: config,
        validate: validate,
        setError: setError,
        addError: addError,
        clearError: clearError,
        setOptions: setOptions,
        loadOptions: loadOptions,
        deferLoadOptions: deferLoadOptions,
        deferLoadLeftOptions: deferLoadLeftOptions,
        expandTreeOptions: expandTreeOptions,
        syncOptions: syncOptions,
        setLoading: setLoading,
        setSubStore: setSubStore,
        getSubStore: getSubStore,
        reset: reset,
        openDialog: openDialog,
        closeDialog: closeDialog,
        changeTmpValue: changeTmpValue,
        changeEmitedValue: changeEmitedValue,
        addSubFormItem: addSubFormItem,
        removeSubFormItem: removeSubFormItem,
        loadAutoUpdateData: loadAutoUpdateData
    };
});

exports.FormItemStore = FormItemStore;
