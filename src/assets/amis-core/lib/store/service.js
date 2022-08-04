/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var mobxStateTree = require('mobx-state-tree');
var iRenderer = require('./iRenderer.js');
var helper = require('../utils/helper.js');
var errors = require('../utils/errors.js');
var api = require('../utils/api.js');
var replaceText = require('../utils/replaceText.js');
var object = require('../utils/object.js');

var ServiceStore = iRenderer.iRendererStore
    .named('ServiceStore')
    .props({
    msg: '',
    error: false,
    fetching: false,
    saving: false,
    busying: false,
    checking: false,
    initializing: false,
    schema: mobxStateTree.types.optional(mobxStateTree.types.frozen(), null),
    schemaKey: ''
})
    .views(function (self) { return ({
    get loading() {
        return self.fetching || self.saving || self.busying || self.initializing;
    }
}); })
    .actions(function (self) {
    var fetchCancel;
    var fetchSchemaCancel;
    function markFetching(fetching) {
        if (fetching === void 0) { fetching = true; }
        self.fetching = fetching;
    }
    function markSaving(saving) {
        if (saving === void 0) { saving = true; }
        self.saving = saving;
    }
    function markBusying(busying) {
        if (busying === void 0) { busying = true; }
        self.busying = busying;
    }
    function reInitData(data, replace) {
        if (replace === void 0) { replace = false; }
        var newData = object.extendObject(self.pristine, data, !replace);
        self.data = self.pristine = newData;
    }
    function updateMessage(msg, error) {
        if (error === void 0) { error = false; }
        self.msg = (msg && String(msg)) || '';
        self.error = error;
    }
    function clearMessage() {
        updateMessage('');
    }
    var fetchInitData = mobxStateTree.flow(function getInitData(api$1, data, options) {
        var json, replace, data_1, ret, e_1, env, message;
        var _a, _b;
        return tslib.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    if (fetchCancel) {
                        fetchCancel();
                        fetchCancel = null;
                        self.fetching = false;
                    }
                    if (self.fetching) {
                        return [2 /*return*/];
                    }
                    (options && options.silent) || markFetching(true);
                    return [4 /*yield*/, mobxStateTree.getEnv(self).fetcher(api$1, data, tslib.__assign(tslib.__assign({}, options), { cancelExecutor: function (executor) { return (fetchCancel = executor); } }))];
                case 1:
                    json = _c.sent();
                    fetchCancel = null;
                    if (!!json.ok) return [3 /*break*/, 2];
                    updateMessage((_a = json.msg) !== null && _a !== void 0 ? _a : (options && options.errorMessage), true);
                    mobxStateTree.getEnv(self).notify('error', json.msg, json.msgTimeout !== undefined
                        ? {
                            closeButton: true,
                            timeout: json.msgTimeout
                        }
                        : undefined);
                    return [3 /*break*/, 5];
                case 2:
                    self.updatedAt = Date.now();
                    replace = !!api$1.replaceData;
                    data_1 = tslib.__assign(tslib.__assign({}, (replace ? {} : self.data)), api.normalizeApiResponseData(json.data));
                    reInitData(data_1, replace);
                    self.hasRemoteData = true;
                    if (!(options && options.onSuccess)) return [3 /*break*/, 4];
                    ret = options.onSuccess(json);
                    if (!(ret && ret.then)) return [3 /*break*/, 4];
                    return [4 /*yield*/, ret];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    updateMessage((_b = json.msg) !== null && _b !== void 0 ? _b : (options && options.successMessage));
                    // 配置了获取成功提示后提示，默认是空不会提示。
                    options &&
                        options.successMessage &&
                        mobxStateTree.getEnv(self).notify('success', self.msg);
                    _c.label = 5;
                case 5:
                    markFetching(false);
                    return [2 /*return*/, json];
                case 6:
                    e_1 = _c.sent();
                    env = mobxStateTree.getEnv(self);
                    if (!mobxStateTree.isAlive(self) || self.disposed) {
                        return [2 /*return*/];
                    }
                    if (env.isCancel(e_1)) {
                        return [2 /*return*/];
                    }
                    markFetching(false);
                    e_1.stack && console.error(e_1.stack);
                    message = e_1.message || e_1;
                    if (e_1 && e_1.message === 'Network Error') {
                        message = self.__('networkError');
                    }
                    env.notify('error', message);
                    return [2 /*return*/];
                case 7: return [2 /*return*/];
            }
        });
    });
    var setHasRemoteData = function () {
        self.hasRemoteData = true;
    };
    var fetchData = mobxStateTree.flow(function getInitData(api$1, data, options) {
        var json, ret, e_2, env, message;
        var _a, _b;
        return tslib.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    if (fetchCancel) {
                        fetchCancel();
                        fetchCancel = null;
                        self.fetching = false;
                    }
                    if (self.fetching) {
                        return [2 /*return*/];
                    }
                    (options && options.silent) || markFetching(true);
                    return [4 /*yield*/, mobxStateTree.getEnv(self).fetcher(api$1, data, tslib.__assign(tslib.__assign({}, options), { cancelExecutor: function (executor) { return (fetchCancel = executor); } }))];
                case 1:
                    json = _c.sent();
                    fetchCancel = null;
                    if (!helper.isEmpty(json.data) || json.ok) {
                        self.updatedAt = Date.now();
                        json.data &&
                            self.updateData(api.normalizeApiResponseData(json.data), undefined, !!api$1.replaceData);
                        self.hasRemoteData = true;
                    }
                    if (!!json.ok) return [3 /*break*/, 2];
                    updateMessage((_a = json.msg) !== null && _a !== void 0 ? _a : (options && options.errorMessage), true);
                    mobxStateTree.getEnv(self).notify('error', self.msg, json.msgTimeout !== undefined
                        ? {
                            closeButton: true,
                            timeout: json.msgTimeout
                        }
                        : undefined);
                    return [3 /*break*/, 5];
                case 2:
                    if (!(options && options.onSuccess)) return [3 /*break*/, 4];
                    ret = options.onSuccess(json);
                    if (!(ret && ret.then)) return [3 /*break*/, 4];
                    return [4 /*yield*/, ret];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    updateMessage((_b = json.msg) !== null && _b !== void 0 ? _b : (options && options.successMessage));
                    // 配置了获取成功提示后提示，默认是空不会提示。
                    options &&
                        options.successMessage &&
                        mobxStateTree.getEnv(self).notify('success', self.msg);
                    _c.label = 5;
                case 5:
                    markFetching(false);
                    return [2 /*return*/, json];
                case 6:
                    e_2 = _c.sent();
                    env = mobxStateTree.getEnv(self);
                    if (!mobxStateTree.isAlive(self) || self.disposed) {
                        return [2 /*return*/];
                    }
                    if (env.isCancel(e_2)) {
                        return [2 /*return*/];
                    }
                    markFetching(false);
                    e_2.stack && console.error(e_2.stack);
                    message = e_2.message || e_2;
                    if (e_2 && e_2.message === 'Network Error') {
                        message = self.__('networkError');
                    }
                    env.notify('error', message);
                    return [2 /*return*/];
                case 7: return [2 /*return*/];
            }
        });
    });
    var saveRemote = mobxStateTree.flow(function saveRemote(api$1, data, options) {
        var json, ret, ret, e_3, result;
        var _a, _b, _c;
        if (options === void 0) { options = {}; }
        return tslib.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 8, , 9]);
                    options = tslib.__assign({ method: 'post' }, options);
                    if (self.saving) {
                        return [2 /*return*/];
                    }
                    markSaving(true);
                    return [4 /*yield*/, mobxStateTree.getEnv(self).fetcher(api$1, data, options)];
                case 1:
                    json = _d.sent();
                    if (!helper.isEmpty(json.data) || json.ok) {
                        self.updatedAt = Date.now();
                        json.data &&
                            self.updateData(api.normalizeApiResponseData(json.data), undefined, !!api$1.replaceData);
                    }
                    if (!!json.ok) return [3 /*break*/, 4];
                    if (!(options && options.onFailed)) return [3 /*break*/, 3];
                    ret = options.onFailed(json);
                    if (!(ret && ret.then)) return [3 /*break*/, 3];
                    return [4 /*yield*/, ret];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    updateMessage((_b = (_a = json.msg) !== null && _a !== void 0 ? _a : (options && options.errorMessage)) !== null && _b !== void 0 ? _b : self.__('saveFailed'), true);
                    throw new errors.ServerError(self.msg, json);
                case 4:
                    if (!(options && options.onSuccess)) return [3 /*break*/, 6];
                    ret = options.onSuccess(json);
                    if (!(ret && ret.then)) return [3 /*break*/, 6];
                    return [4 /*yield*/, ret];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6:
                    updateMessage((_c = json.msg) !== null && _c !== void 0 ? _c : (options && options.successMessage));
                    self.msg &&
                        mobxStateTree.getEnv(self).notify('success', self.msg, json.msgTimeout !== undefined
                            ? {
                                closeButton: true,
                                timeout: json.msgTimeout
                            }
                            : undefined);
                    _d.label = 7;
                case 7:
                    markSaving(false);
                    return [2 /*return*/, json.data];
                case 8:
                    e_3 = _d.sent();
                    self.saving = false;
                    if (!mobxStateTree.isAlive(self) || self.disposed) {
                        return [2 /*return*/];
                    }
                    // console.log(e.stack);
                    if (e_3.type === 'ServerError') {
                        result = e_3.response;
                        mobxStateTree.getEnv(self).notify('error', e_3.message, result.msgTimeout !== undefined
                            ? {
                                closeButton: true,
                                timeout: result.msgTimeout
                            }
                            : undefined);
                    }
                    else {
                        mobxStateTree.getEnv(self).notify('error', e_3.message);
                    }
                    throw e_3;
                case 9: return [2 /*return*/];
            }
        });
    });
    var fetchSchema = mobxStateTree.flow(function fetchSchema(api$1, data, options) {
        var json, env, e_4, env, message;
        var _a, _b, _c;
        if (options === void 0) { options = {}; }
        return tslib.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    options = tslib.__assign(tslib.__assign({ method: 'post' }, options), { cancelExecutor: function (executor) { return (fetchSchemaCancel = executor); } });
                    if (fetchSchemaCancel) {
                        fetchSchemaCancel();
                        fetchSchemaCancel = null;
                        self.initializing = false;
                    }
                    if (self.initializing) {
                        return [2 /*return*/];
                    }
                    self.initializing = true;
                    if (typeof api$1 === 'string') {
                        api$1 += (~api$1.indexOf('?') ? '&' : '?') + '_replace=1';
                    }
                    else {
                        api$1 = tslib.__assign(tslib.__assign({}, api$1), { url: api$1.url +
                                (~api$1.url.indexOf('?') ? '&' : '?') +
                                '_replace=1' });
                    }
                    return [4 /*yield*/, mobxStateTree.getEnv(self).fetcher(api$1, data, options)];
                case 1:
                    json = _d.sent();
                    fetchSchemaCancel = null;
                    if (!json.ok) {
                        updateMessage((_b = (_a = json.msg) !== null && _a !== void 0 ? _a : (options && options.errorMessage)) !== null && _b !== void 0 ? _b : self.__('fetchFailed'), true);
                        mobxStateTree.getEnv(self).notify('error', self.msg, json.msgTimeout !== undefined
                            ? {
                                closeButton: true,
                                timeout: json.msgTimeout
                            }
                            : undefined);
                    }
                    else {
                        if (json.data) {
                            env = mobxStateTree.getEnv(self);
                            replaceText.replaceText(json.data, env.replaceText, env.replaceTextIgnoreKeys);
                            self.schema = Array.isArray(json.data)
                                ? json.data
                                : tslib.__assign({ type: 'wrapper', wrap: false }, api.normalizeApiResponseData(json.data));
                            self.schemaKey = '' + Date.now();
                            object.isObject(json.data.data) &&
                                self.updateData(json.data.data, undefined, !!api$1.replaceData);
                        }
                        updateMessage((_c = json.msg) !== null && _c !== void 0 ? _c : (options && options.successMessage));
                        // 配置了获取成功提示后提示，默认是空不会提示。
                        options &&
                            options.successMessage &&
                            mobxStateTree.getEnv(self).notify('success', self.msg);
                    }
                    self.initializing = false;
                    return [2 /*return*/, json.data];
                case 2:
                    e_4 = _d.sent();
                    env = mobxStateTree.getEnv(self);
                    self.initializing = false;
                    if (!mobxStateTree.isAlive(self) || self.disposed) {
                        return [2 /*return*/];
                    }
                    if (env.isCancel(e_4)) {
                        return [2 /*return*/];
                    }
                    e_4.stack && console.error(e_4.stack);
                    message = e_4.message || e_4;
                    if (e_4 && e_4.message === 'Network Error') {
                        message = self.__('networkError');
                    }
                    env.notify('error', message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
    var checkRemote = mobxStateTree.flow(function checkRemote(api, data, options) {
        var json;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (self.checking) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    self.checking = true;
                    return [4 /*yield*/, mobxStateTree.getEnv(self).fetcher(api, data, options)];
                case 2:
                    json = _a.sent();
                    json.ok &&
                        self.updateData(json.data, undefined, !!api.replaceData);
                    if (!json.ok) {
                        throw new Error(json.msg);
                    }
                    return [2 /*return*/, json.data];
                case 3:
                    self.checking = false;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
    return {
        markFetching: markFetching,
        markSaving: markSaving,
        markBusying: markBusying,
        fetchInitData: fetchInitData,
        fetchData: fetchData,
        reInitData: reInitData,
        updateMessage: updateMessage,
        clearMessage: clearMessage,
        setHasRemoteData: setHasRemoteData,
        saveRemote: saveRemote,
        fetchSchema: fetchSchema,
        checkRemote: checkRemote
    };
});

exports.ServiceStore = ServiceStore;
