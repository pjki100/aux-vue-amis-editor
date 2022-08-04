/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __generator, __assign } from 'tslib';
import { types, flow, isAlive, getEnv } from 'mobx-state-tree';
import debouce from 'lodash/debounce';
import { ServiceStore } from './service.js';
import { ServerError } from '../utils/errors.js';
import { isEmpty, difference, mapObject } from '../utils/helper.js';
import isEqual from 'lodash/isEqual';
import flatten from 'lodash/flatten';
import find from 'lodash/find';
import { filter } from '../utils/tpl.js';
import { normalizeApiResponseData } from '../utils/api.js';
import { getVariable } from '../utils/getVariable.js';
import { keyToPath } from '../utils/keyToPath.js';
import { createObject, cloneObject, setVariable, deleteVariable } from '../utils/object.js';

var FormStore = ServiceStore.named('FormStore')
    .props({
    inited: false,
    validated: false,
    submited: false,
    submiting: false,
    savedData: types.frozen(),
    // items: types.optional(types.array(types.late(() => FormItemStore)), []),
    canAccessSuperData: true,
    persistData: types.optional(types.union(types.string, types.boolean), ''),
    restError: types.optional(types.array(types.string), []) // 没有映射到表达项上的 errors
})
    .views(function (self) {
    function getItems() {
        var formItems = [];
        // 查找孩子节点中是 formItem 的表单项
        var pool = self.children.concat();
        while (pool.length) {
            var current = pool.shift();
            if (current.storeType === 'FormItemStore') {
                formItems.push(current);
            }
            else {
                pool.push.apply(pool, current.children);
            }
        }
        return formItems;
    }
    return {
        get loading() {
            return self.saving || self.fetching;
        },
        get items() {
            return getItems();
        },
        /**
         * 相对于 items(), 只收集直接子formItem
         * 避免 子form 表单项的重复验证
         */
        get directItems() {
            var formItems = [];
            // 查找孩子节点中是 formItem 的表单项
            var pool = self.children.concat();
            while (pool.length) {
                var current = pool.shift();
                if (current.storeType === 'FormItemStore') {
                    formItems.push(current);
                }
                else if (current.storeType !== 'ComboStore') {
                    pool.push.apply(pool, current.children);
                }
            }
            return formItems;
        },
        get errors() {
            var errors = {};
            getItems().forEach(function (item) {
                if (!item.valid) {
                    errors[item.name] = Array.isArray(errors[item.name])
                        ? errors[item.name].concat(item.errors)
                        : item.errors.concat();
                }
            });
            return errors;
        },
        getValueByName: function (name, canAccessSuperData) {
            if (canAccessSuperData === void 0) { canAccessSuperData = self.canAccessSuperData; }
            return getVariable(self.data, name, canAccessSuperData);
        },
        getPristineValueByName: function (name) {
            return getVariable(self.pristine, name);
        },
        getItemById: function (id) {
            return getItems().find(function (item) { return item.itemId === id; });
        },
        getItemByName: function (name) {
            return getItems().find(function (item) { return item.name === name; });
        },
        getItemsByName: function (name) {
            return getItems().filter(function (item) { return item.name === name; });
        },
        get valid() {
            return (getItems().every(function (item) { return item.valid; }) &&
                (!self.restError || !self.restError.length));
        },
        get validating() {
            return getItems().some(function (item) { return item.validating; });
        },
        get isPristine() {
            return isEqual(self.pristine, self.data);
        },
        get modified() {
            if (self.savedData) {
                return self.savedData !== self.data;
            }
            return !this.isPristine;
        },
        get persistKey() {
            return "".concat(location.pathname, "/").concat(self.path, "/").concat(typeof self.persistData === 'string'
                ? filter(self.persistData, self.data)
                : self.persistData);
        }
    };
})
    .actions(function (self) {
    function setValues(values, tag, replace) {
        self.updateData(values, tag, replace);
        // 如果数据域中有数据变化，就都reset一下，去掉之前残留的验证消息
        self.items.forEach(function (item) { return item.reset(); });
        // 同步 options
        syncOptions();
    }
    function setValueByName(name, value, isPristine, force) {
        if (isPristine === void 0) { isPristine = false; }
        if (force === void 0) { force = false; }
        // 没有变化就不跑了。
        var origin = getVariable(self.data, name, false);
        var prev = self.data;
        var data = cloneObject(self.data);
        if (value !== origin) {
            if (prev.__prev) {
                // 基于之前的 __prev 改
                var prevData = cloneObject(prev.__prev);
                setVariable(prevData, name, origin);
                Object.defineProperty(data, '__prev', {
                    value: prevData,
                    enumerable: false,
                    configurable: false,
                    writable: false
                });
            }
            else {
                Object.defineProperty(data, '__prev', {
                    value: __assign({}, prev),
                    enumerable: false,
                    configurable: false,
                    writable: false
                });
            }
        }
        else if (!force) {
            return;
        }
        setVariable(data, name, value);
        if (isPristine) {
            var pristine = cloneObject(self.pristine);
            setVariable(pristine, name, value);
            self.pristine = pristine;
        }
        if (!data.__pristine) {
            Object.defineProperty(data, '__pristine', {
                value: self.pristine,
                enumerable: false,
                configurable: false,
                writable: false
            });
        }
        self.data = data;
        // 同步 options
        syncOptions();
    }
    function deleteValueByName(name) {
        var prev = self.data;
        var data = cloneObject(self.data);
        if (prev.__prev) {
            // 基于之前的 __prev 改
            var prevData = cloneObject(prev.__prev);
            setVariable(prevData, name, getVariable(prev, name));
            Object.defineProperty(data, '__prev', {
                value: prevData,
                enumerable: false,
                configurable: false,
                writable: false
            });
        }
        else {
            Object.defineProperty(data, '__prev', {
                value: __assign({}, prev),
                enumerable: false,
                configurable: false,
                writable: false
            });
        }
        deleteVariable(data, name);
        self.data = data;
    }
    function trimValues() {
        var data = mapObject(self.data, function (item) {
            return typeof item === 'string' ? item.trim() : item;
        });
        self.updateData(data);
    }
    var syncOptions = debouce(function () { return self.items.forEach(function (item) { return item.syncOptions(undefined, self.data); }); }, 250, {
        trailing: true,
        leading: false
    });
    function setRestError(errors) {
        self.restError.replace(errors);
    }
    function addRestError(msg, name) {
        var names = name
            ? Array.isArray(name)
                ? name.concat()
                : [name]
            : null;
        if (Array.isArray(names)) {
            var errors_1 = {};
            names.forEach(function (name) { return (errors_1[name] = msg); });
            setFormItemErrors(errors_1, 'rules');
        }
        else {
            self.restError.push(msg);
        }
    }
    function clearRestError() {
        setRestError([]);
    }
    var saveRemote = flow(function saveRemote(api, data, options) {
        var ret, json, ret, e_1, ret, result;
        var _a, _b, _c, _d, _e, _f, _g;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    clearRestError();
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, 12, , 15]);
                    options = __assign({ method: 'post' }, options);
                    if (!(options && options.beforeSend)) return [3 /*break*/, 4];
                    ret = options.beforeSend(data);
                    if (!(ret && ret.then)) return [3 /*break*/, 3];
                    return [4 /*yield*/, ret];
                case 2:
                    ret = _h.sent();
                    _h.label = 3;
                case 3:
                    if (ret === false) {
                        return [2 /*return*/];
                    }
                    _h.label = 4;
                case 4:
                    self.markSaving(true);
                    return [4 /*yield*/, getEnv(self).fetcher(api, data, options)];
                case 5:
                    json = _h.sent();
                    // 失败也同样修改数据，如果有数据的话。
                    if (!isEmpty(json.data) || json.ok) {
                        self.updatedAt = Date.now();
                        setValues(normalizeApiResponseData(json.data), json.ok
                            ? {
                                __saved: Date.now()
                            }
                            : undefined, !!api.replaceData);
                    }
                    if (!!json.ok) return [3 /*break*/, 6];
                    if (json.status === 422 && json.errors) {
                        setFormItemErrors(json.errors);
                        self.updateMessage((_b = (_a = json.msg) !== null && _a !== void 0 ? _a : self.__(options && options.errorMessage)) !== null && _b !== void 0 ? _b : self.__('Form.validateFailed'), true);
                    }
                    else {
                        self.updateMessage((_c = json.msg) !== null && _c !== void 0 ? _c : self.__(options && options.errorMessage), true);
                    }
                    throw new ServerError(self.msg, json);
                case 6:
                    updateSavedData();
                    ret = options && options.onSuccess && options.onSuccess(json);
                    if (!(ret === null || ret === void 0 ? void 0 : ret.then)) return [3 /*break*/, 8];
                    return [4 /*yield*/, ret];
                case 7:
                    ret = _h.sent();
                    _h.label = 8;
                case 8:
                    if (!((_d = ret === null || ret === void 0 ? void 0 : ret.cbResult) === null || _d === void 0 ? void 0 : _d.then)) return [3 /*break*/, 10];
                    return [4 /*yield*/, ret.cbResult];
                case 9:
                    _h.sent();
                    _h.label = 10;
                case 10:
                    self.markSaving(false);
                    self.updateMessage((_e = json.msg) !== null && _e !== void 0 ? _e : self.__(options && options.successMessage));
                    if (!((_f = ret === null || ret === void 0 ? void 0 : ret.dispatcher) === null || _f === void 0 ? void 0 : _f.prevented)) {
                        self.msg &&
                            getEnv(self).notify('success', self.msg, json.msgTimeout !== undefined
                                ? {
                                    closeButton: true,
                                    timeout: json.msgTimeout
                                }
                                : undefined);
                    }
                    return [2 /*return*/, json.data];
                case 11: return [3 /*break*/, 15];
                case 12:
                    e_1 = _h.sent();
                    self.markSaving(false);
                    ret = options && options.onFailed && options.onFailed(e_1.response || {});
                    if (!(ret === null || ret === void 0 ? void 0 : ret.then)) return [3 /*break*/, 14];
                    return [4 /*yield*/, ret];
                case 13:
                    ret = _h.sent();
                    _h.label = 14;
                case 14:
                    if (!isAlive(self) || self.disposed) {
                        return [2 /*return*/];
                    }
                    if ((_g = ret === null || ret === void 0 ? void 0 : ret.dispatcher) === null || _g === void 0 ? void 0 : _g.prevented) {
                        return [2 /*return*/];
                    }
                    if (e_1.type === 'ServerError') {
                        result = e_1.response;
                        getEnv(self).notify('error', e_1.message, result.msgTimeout !== undefined
                            ? {
                                closeButton: true,
                                timeout: result.msgTimeout
                            }
                            : undefined);
                    }
                    else {
                        getEnv(self).notify('error', e_1.message);
                    }
                    throw e_1;
                case 15: return [2 /*return*/];
            }
        });
    });
    function setFormItemErrors(errors, tag) {
        if (tag === void 0) { tag = 'remote'; }
        Object.keys(errors).forEach(function (key) {
            var item = self.getItemById(key);
            var items = self.getItemsByName(key);
            if (item) {
                item.setError(errors[key], tag);
                delete errors[key];
            }
            else if (items.length) {
                // 通过 name 直接找到的
                items.forEach(function (item) { return item.setError(errors[key], tag); });
                delete errors[key];
            }
            else {
                // 尝试通过path寻找
                var items_1 = getItemsByPath(key);
                if (Array.isArray(items_1) && items_1.length) {
                    items_1.forEach(function (item) { return item.setError("".concat(errors[key]), tag); });
                    delete errors[key];
                }
            }
        });
        // 没有映射上的error信息加在msg后显示出来
        !isEmpty(errors) &&
            setRestError(Object.keys(errors).map(function (key) { return String(errors[key]); }));
    }
    var getItemsByPath = function (key) {
        var paths = keyToPath(key);
        var len = paths.length;
        return paths.reduce(function (stores, path, idx) {
            if (Array.isArray(stores) && stores.every(function (s) { return s.getItemsByName; })) {
                var items = flatten(stores.map(function (s) { return s.getItemsByName(path); })).filter(function (i) { return i; });
                var subStores = items
                    .map(function (item) { var _a; return (_a = item === null || item === void 0 ? void 0 : item.getSubStore) === null || _a === void 0 ? void 0 : _a.call(item); })
                    .filter(function (i) { return i; });
                return subStores.length && idx < len - 1 ? subStores : items;
            }
            return null;
        }, [self]);
    };
    var submit = flow(function submit(fn, hooks, failedMessage, validateErrCb) {
        var valid, msg, env, dispatcher, diff, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    self.submited = true;
                    self.submiting = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 8, 9]);
                    return [4 /*yield*/, validate(hooks)];
                case 2:
                    valid = _a.sent();
                    if (!((!valid &&
                        self.items.some(function (item) {
                            return item.errorData.some(function (e) { return e.tag !== 'remote'; });
                        })) ||
                        self.restError.length)) return [3 /*break*/, 5];
                    msg = failedMessage !== null && failedMessage !== void 0 ? failedMessage : self.__('Form.validateFailed');
                    env = getEnv(self);
                    dispatcher = validateErrCb && validateErrCb();
                    if (!(dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.then)) return [3 /*break*/, 4];
                    return [4 /*yield*/, dispatcher];
                case 3:
                    dispatcher = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented)) {
                        msg && env.notify('error', msg);
                    }
                    throw new Error(msg);
                case 5:
                    if (!fn) return [3 /*break*/, 7];
                    diff = difference(self.data, self.pristine);
                    return [4 /*yield*/, fn(createObject(createObject(self.data.__super, {
                            diff: diff,
                            __diff: diff,
                            pristine: self.pristine
                        }), self.data))];
                case 6:
                    result = _a.sent();
                    return [2 /*return*/, result !== null && result !== void 0 ? result : self.data];
                case 7: return [2 /*return*/, self.data];
                case 8:
                    self.submiting = false;
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
    var validate = flow(function validate(hooks, forceValidate) {
        var items, i, len, item, i, len;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    self.validated = true;
                    items = self.directItems.concat();
                    i = 0, len = items.length;
                    _a.label = 1;
                case 1:
                    if (!(i < len)) return [3 /*break*/, 4];
                    item = items[i];
                    // 先清除组合校验的错误
                    item.clearError('rules');
                    if (!(!item.validated ||
                        item.unique ||
                        forceValidate ||
                        !!item.validateApi)) return [3 /*break*/, 3];
                    return [4 /*yield*/, item.validate(self.data)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!(hooks && hooks.length)) return [3 /*break*/, 8];
                    i = 0, len = hooks.length;
                    _a.label = 5;
                case 5:
                    if (!(i < len)) return [3 /*break*/, 8];
                    return [4 /*yield*/, hooks[i]()];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/, self.valid];
            }
        });
    });
    var validateFields = flow(function validateFields(fields) {
        var items, normalizedfields, result, _loop_1, i, len;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    items = self.items.concat();
                    normalizedfields = fields.map(function (field) {
                        return typeof field === 'string' ? { name: field, rules: {} } : field;
                    });
                    result = [];
                    _loop_1 = function (i, len) {
                        var item, field, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    item = items[i];
                                    field = find(normalizedfields, function (field) { return field.name === item.name; });
                                    if (!field) return [3 /*break*/, 2];
                                    _c = (_b = result).push;
                                    return [4 /*yield*/, item.validate(self.data, undefined, field.rules)];
                                case 1:
                                    _c.apply(_b, [_d.sent()]);
                                    _d.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0, len = items.length;
                    _a.label = 1;
                case 1:
                    if (!(i < len)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i, len)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, result.every(function (item) { return item; })];
            }
        });
    });
    function clearErrors() {
        var items = self.items.concat();
        items.forEach(function (item) { return item.reset(); });
    }
    function reset(cb, resetData) {
        if (resetData === void 0) { resetData = true; }
        if (resetData) {
            self.data = self.pristine;
        }
        // 值可能变了，重新验证一次。
        self.validated = false;
        self.submited = false;
        self.items.forEach(function (item) { return item.reset(); });
        cb && cb(self.data);
    }
    function clear(cb) {
        var toClear = {};
        self.items.forEach(function (item) {
            if (item.name && item.type !== 'hidden') {
                setVariable(toClear, item.name, item.resetValue);
            }
        });
        setValues(toClear);
        self.validated = false;
        self.submited = false;
        self.items.forEach(function (item) { return item.reset(); });
        cb && cb(self.data);
    }
    function setCanAccessSuperData(value) {
        if (value === void 0) { value = true; }
        self.canAccessSuperData = value;
    }
    function setInited(value) {
        self.inited = value;
    }
    function setPersistData(value) {
        if (value === void 0) { value = ''; }
        self.persistData = value;
    }
    var setLocalPersistData = function () {
        localStorage.setItem(self.persistKey, JSON.stringify(self.data));
    };
    function getLocalPersistData() {
        var data = localStorage.getItem(self.persistKey);
        if (data) {
            self.updateData(JSON.parse(data));
        }
    }
    function clearLocalPersistData() {
        localStorage.removeItem(self.persistKey);
    }
    function updateSavedData() {
        self.savedData = self.data;
    }
    return {
        setInited: setInited,
        setValues: setValues,
        setValueByName: setValueByName,
        trimValues: trimValues,
        submit: submit,
        validate: validate,
        validateFields: validateFields,
        clearErrors: clearErrors,
        saveRemote: saveRemote,
        reset: reset,
        syncOptions: syncOptions,
        setCanAccessSuperData: setCanAccessSuperData,
        deleteValueByName: deleteValueByName,
        getLocalPersistData: getLocalPersistData,
        setLocalPersistData: setLocalPersistData,
        clearLocalPersistData: clearLocalPersistData,
        setPersistData: setPersistData,
        clear: clear,
        updateSavedData: updateSavedData,
        setFormItemErrors: setFormItemErrors,
        getItemsByPath: getItemsByPath,
        setRestError: setRestError,
        addRestError: addRestError,
        clearRestError: clearRestError,
        beforeDestroy: function () {
            syncOptions.cancel();
        }
    };
});

export { FormStore };
