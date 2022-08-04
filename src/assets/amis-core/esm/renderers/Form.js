/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __extends, __awaiter, __generator, __assign, __decorate, __metadata } from 'tslib';
import React from 'react';
import { Renderer } from '../factory.js';
import { FormStore } from '../store/form.js';
import { evalExpression, filter } from '../utils/tpl.js';
import { getExprProperties } from '../utils/filter-schema.js';
import { promisify, isEmpty, until, noop, isVisible, SkipOperation, difference, repeatCount, qsparse, isObjectShallowModified } from '../utils/helper.js';
import debouce from 'lodash/debounce';
import flatten from 'lodash/flatten';
import find from 'lodash/find';
import { ScopedContext } from '../Scoped.js';
import 'amis-formula';
import 'moment';
import { isObject, createObject, cloneObject } from '../utils/object.js';
import { getVariable } from '../utils/getVariable.js';
import { dataMapping } from '../utils/dataMapping.js';
import '../utils/filter.js';
import { isEffectiveApi, isApiOutdated } from '../utils/api.js';
import LazyComponent from '../components/LazyComponent.js';
import { isAlive } from 'mobx-state-tree';

var Form = /** @class */ (function (_super) {
    __extends(Form, _super);
    function Form(props) {
        var _this = _super.call(this, props) || this;
        _this.hooks = {};
        _this.shouldLoadInitApi = false;
        _this.lazyEmitChange = debouce(_this.emitChange.bind(_this), 250, {
            trailing: true,
            leading: false
        });
        _this.onInit = _this.onInit.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleQuery = _this.handleQuery.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleDialogConfirm = _this.handleDialogConfirm.bind(_this);
        _this.handleDialogClose = _this.handleDialogClose.bind(_this);
        _this.handleDrawerConfirm = _this.handleDrawerConfirm.bind(_this);
        _this.handleDrawerClose = _this.handleDrawerClose.bind(_this);
        _this.handleFormSubmit = _this.handleFormSubmit.bind(_this);
        _this.validate = _this.validate.bind(_this);
        _this.submit = _this.submit.bind(_this);
        _this.addHook = _this.addHook.bind(_this);
        _this.removeHook = _this.removeHook.bind(_this);
        _this.emitChange = _this.emitChange.bind(_this);
        _this.handleBulkChange = _this.handleBulkChange.bind(_this);
        _this.renderFormItems = _this.renderFormItems.bind(_this);
        _this.reload = _this.reload.bind(_this);
        _this.silentReload = _this.silentReload.bind(_this);
        _this.initInterval = _this.initInterval.bind(_this);
        _this.blockRouting = _this.blockRouting.bind(_this);
        _this.beforePageUnload = _this.beforePageUnload.bind(_this);
        var store = props.store, canAccessSuperData = props.canAccessSuperData, persistData = props.persistData, simpleMode = props.simpleMode;
        store.setCanAccessSuperData(canAccessSuperData !== false);
        store.setPersistData(persistData);
        if (simpleMode) {
            store.setInited(true);
        }
        if (store &&
            store.parentStore &&
            store.parentStore.storeType === 'ComboStore') {
            var combo = store.parentStore;
            combo.addForm(store);
            combo.forms.forEach(function (form) {
                return form.items.forEach(function (item) { return item.unique && item.syncOptions(undefined, form.data); });
            });
        }
        return _this;
    }
    Form.prototype.componentDidMount = function () {
        var _this = this;
        var _a, _b;
        var _c = this.props, initApi = _c.initApi, initFetch = _c.initFetch, initFetchOn = _c.initFetchOn, initAsyncApi = _c.initAsyncApi, initFinishedField = _c.initFinishedField, initCheckInterval = _c.initCheckInterval, store = _c.store, _d = _c.messages, fetchSuccess = _d.fetchSuccess, fetchFailed = _d.fetchFailed, onValidate = _c.onValidate, promptPageLeave = _c.promptPageLeave, env = _c.env, rules = _c.rules;
        this.mounted = true;
        if (onValidate) {
            var finalValidate_1 = promisify(onValidate);
            this.disposeOnValidate = this.addHook(function () { return __awaiter(_this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, finalValidate_1(store.data, store)];
                        case 1:
                            result = _a.sent();
                            if (result && isObject(result)) {
                                Object.keys(result).forEach(function (key) {
                                    var msg = result[key];
                                    var items = store.getItemsByPath(key);
                                    // 没有找到
                                    if (!Array.isArray(items) || !items.length) {
                                        return;
                                    }
                                    // 在setError之前，提前把残留的error信息清除掉，否则每次onValidate后都会一直把报错 append 上去
                                    items.forEach(function (item) { return item.clearError(); });
                                    if (msg) {
                                        msg = Array.isArray(msg) ? msg : [msg];
                                        items.forEach(function (item) { return item.addError(msg); });
                                    }
                                    delete result[key];
                                });
                                isEmpty(result)
                                    ? store.clearRestError()
                                    : store.setRestError(Object.keys(result).map(function (key) { return result[key]; }));
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        if (Array.isArray(rules) && rules.length) {
            this.disposeRulesValidate = this.addHook(function () {
                if (!store.valid) {
                    return;
                }
                rules.forEach(function (item) {
                    return !evalExpression(item.rule, store.data) &&
                        store.addRestError(item.message, item.name);
                });
            });
        }
        if (isEffectiveApi(initApi, store.data, initFetch, initFetchOn)) {
            store
                .fetchInitData(initApi, store.data, {
                successMessage: fetchSuccess,
                errorMessage: fetchFailed,
                onSuccess: function () {
                    if (!isEffectiveApi(initAsyncApi, store.data) ||
                        store.data[initFinishedField || 'finished']) {
                        return;
                    }
                    return until(function () { return store.checkRemote(initAsyncApi, store.data); }, function (ret) { return ret && ret[initFinishedField || 'finished']; }, function (cancel) { return (_this.asyncCancel = cancel); }, initCheckInterval);
                }
            })
                .then(this.initInterval)
                .then(this.onInit);
        }
        else {
            setTimeout(this.onInit.bind(this), 4);
        }
        if (promptPageLeave) {
            window.addEventListener('beforeunload', this.beforePageUnload);
            this.unBlockRouting = (_b = (_a = env.blockRouting) === null || _a === void 0 ? void 0 : _a.call(env, this.blockRouting)) !== null && _b !== void 0 ? _b : undefined;
        }
    };
    Form.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var store = props.store;
        if (isApiOutdated(prevProps.initApi, props.initApi, prevProps.data, props.data)) {
            var fetchSuccess = props.fetchSuccess, fetchFailed = props.fetchFailed;
            store[store.hasRemoteData ? 'fetchData' : 'fetchInitData'](props.initApi, store.data, {
                successMessage: fetchSuccess,
                errorMessage: fetchFailed
            }).then(this.initInterval);
        }
    };
    Form.prototype.componentWillUnmount = function () {
        var _a;
        this.mounted = false;
        clearTimeout(this.timer);
        // this.lazyHandleChange.flush();
        this.lazyEmitChange.cancel();
        this.asyncCancel && this.asyncCancel();
        this.disposeOnValidate && this.disposeOnValidate();
        this.disposeRulesValidate && this.disposeRulesValidate();
        window.removeEventListener('beforeunload', this.beforePageUnload);
        (_a = this.unBlockRouting) === null || _a === void 0 ? void 0 : _a.call(this);
    };
    Form.prototype.blockRouting = function () {
        var store = this.props.store;
        var _a = this.props, promptPageLeaveMessage = _a.promptPageLeaveMessage, promptPageLeave = _a.promptPageLeave;
        if (promptPageLeave && store.modified) {
            return promptPageLeaveMessage || '新的修改没有保存，确认要离开？';
        }
    };
    Form.prototype.beforePageUnload = function (e) {
        var blocked = this.blockRouting();
        if (blocked) {
            e.preventDefault();
            e.returnValue = '';
        }
    };
    Form.prototype.onInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, onInit, store, persistData, submitOnInit, dispatchEvent, data, initedAt, hooks, dispatcher;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onInit = _a.onInit, store = _a.store, persistData = _a.persistData, submitOnInit = _a.submitOnInit, dispatchEvent = _a.dispatchEvent;
                        if (!isAlive(store)) {
                            return [2 /*return*/];
                        }
                        data = cloneObject(store.data);
                        initedAt = store.initedAt;
                        store.setInited(true);
                        hooks = this.hooks['init'] || [];
                        return [4 /*yield*/, Promise.all(hooks.map(function (hook) { return hook(data); }))];
                    case 1:
                        _b.sent();
                        if (!isAlive(store)) {
                            return [2 /*return*/];
                        }
                        if (store.initedAt !== initedAt) {
                            // 说明，之前的数据已经失效了。
                            // 比如 combo 一开始设置了初始值，然后 form 的 initApi 又返回了新的值。
                            // 这个时候 store 的数据应该已经 init 了新的值。但是 data 还是老的，这个时候
                            // onInit 出去就是错误的。
                            data = __assign(__assign({}, data), store.data);
                        }
                        if (persistData) {
                            store.getLocalPersistData();
                            data = cloneObject(store.data);
                        }
                        return [4 /*yield*/, dispatchEvent('inited', createObject(this.props.data, data))];
                    case 2:
                        dispatcher = _b.sent();
                        if (!(dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented)) {
                            onInit && onInit(data, this.props);
                        }
                        submitOnInit &&
                            this.handleAction(undefined, {
                                type: 'submit'
                            }, store.data);
                        return [2 /*return*/];
                }
            });
        });
    };
    Form.prototype.reload = function (subPath, query, ctx, silent) {
        var _a;
        var _this = this;
        if (query) {
            return this.receive(query);
        }
        var _b = this.props, store = _b.store, initApi = _b.initApi, initAsyncApi = _b.initAsyncApi, initFinishedField = _b.initFinishedField, _c = _b.messages, fetchSuccess = _c.fetchSuccess, fetchFailed = _c.fetchFailed;
        isEffectiveApi(initAsyncApi, store.data) &&
            store.updateData((_a = {},
                _a[initFinishedField || 'finished'] = false,
                _a));
        isEffectiveApi(initApi, store.data)
            ? store
                .fetchInitData(initApi, store.data, {
                successMessage: fetchSuccess,
                errorMessage: fetchFailed,
                silent: silent,
                onSuccess: function () {
                    if (!isEffectiveApi(initAsyncApi, store.data) ||
                        store.data[initFinishedField || 'finished']) {
                        return;
                    }
                    return until(function () { return store.checkRemote(initAsyncApi, store.data); }, function (ret) { return ret && ret[initFinishedField || 'finished']; }, function (cancel) { return (_this.asyncCancel = cancel); });
                }
            })
                .then(function (result) {
                if (result === null || result === void 0 ? void 0 : result.ok) {
                    _this.initInterval(result);
                    store.reset(undefined, false);
                }
            })
            : store.reset(undefined, false);
    };
    Form.prototype.receive = function (values) {
        var store = this.props.store;
        store.updateData(values);
        this.reload();
    };
    Form.prototype.silentReload = function (target, query) {
        this.reload(target, query, undefined, true);
    };
    Form.prototype.initInterval = function (value) {
        var _a = this.props, interval = _a.interval, silentPolling = _a.silentPolling, stopAutoRefreshWhen = _a.stopAutoRefreshWhen, data = _a.data;
        clearTimeout(this.timer);
        interval &&
            this.mounted &&
            (!stopAutoRefreshWhen || !evalExpression(stopAutoRefreshWhen, data)) &&
            (this.timer = setTimeout(silentPolling ? this.silentReload : this.reload, Math.max(interval, 1000)));
        return value;
    };
    Form.prototype.isValidated = function () {
        return this.props.store.validated;
    };
    Form.prototype.validate = function (forceValidate) {
        var _a = this.props, store = _a.store, dispatchEvent = _a.dispatchEvent, data = _a.data;
        this.flush();
        return store
            .validate(this.hooks['validate'] || [], forceValidate)
            .then(function (result) {
            if (result) {
                dispatchEvent('validateSucc', data);
            }
            else {
                dispatchEvent('validateError', data);
            }
            return result;
        });
    };
    Form.prototype.clearErrors = function () {
        var store = this.props.store;
        return store.clearErrors();
    };
    Form.prototype.getValues = function () {
        var store = this.props.store;
        this.flush();
        return store.data;
    };
    Form.prototype.setValues = function (value) {
        var store = this.props.store;
        this.flush();
        store.setValues(value);
    };
    Form.prototype.submit = function (fn) {
        var _a = this.props, store = _a.store, messages = _a.messages, __ = _a.translate, dispatchEvent = _a.dispatchEvent, data = _a.data;
        this.flush();
        var validateErrCb = function () { return dispatchEvent('validateError', data); };
        return store.submit(fn, this.hooks['validate'] || [], __(messages && messages.validateFailed), validateErrCb);
    };
    // 如果开启了 lazyChange，需要一个 flush 方法把队列中值应用上。
    Form.prototype.flush = function () {
        var hooks = this.hooks['flush'] || [];
        hooks.forEach(function (fn) { return fn(); });
        this.lazyEmitChange.flush();
    };
    Form.prototype.reset = function () {
        var _a = this.props, store = _a.store, onReset = _a.onReset;
        store.reset(onReset);
    };
    Form.prototype.addHook = function (fn, type) {
        var _this = this;
        if (type === void 0) { type = 'validate'; }
        this.hooks[type] = this.hooks[type] || [];
        this.hooks[type].push(type === 'flush' ? fn : promisify(fn));
        return function () {
            _this.removeHook(fn, type);
            fn = noop;
        };
    };
    Form.prototype.removeHook = function (fn, type) {
        if (type === void 0) { type = 'validate'; }
        var hooks = this.hooks[type];
        if (!hooks) {
            return;
        }
        for (var i = 0, len = hooks.length; i < len; i++) {
            var hook = hooks[i];
            if (hook === fn || hook.raw === fn) {
                hooks.splice(i, 1);
                len--;
                i--;
            }
        }
    };
    Form.prototype.handleChange = function (value, name, submit, changePristine) {
        if (changePristine === void 0) { changePristine = false; }
        var _a = this.props, store = _a.store, formLazyChange = _a.formLazyChange;
        if (typeof name !== 'string') {
            return;
        }
        store.changeValue(name, value, changePristine);
        if (!changePristine) {
            (formLazyChange === false ? this.emitChange : this.lazyEmitChange)(submit);
        }
        if (store.persistData && store.inited) {
            store.setLocalPersistData();
        }
    };
    Form.prototype.formItemDispatchEvent = function (dispatchEvent) {
        return function (type, data) {
            dispatchEvent(type, data);
        };
    };
    Form.prototype.emitChange = function (submit) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, onChange, store, submitOnChange, dispatchEvent, data, dispatcher;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onChange = _a.onChange, store = _a.store, submitOnChange = _a.submitOnChange, dispatchEvent = _a.dispatchEvent, data = _a.data;
                        if (!isAlive(store)) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, dispatchEvent('change', createObject(data, store.data))];
                    case 1:
                        dispatcher = _b.sent();
                        if (!(dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented)) {
                            onChange &&
                                onChange(store.data, difference(store.data, store.pristine), this.props);
                        }
                        store.clearRestError();
                        (submit || (submitOnChange && store.inited)) &&
                            this.handleAction(undefined, {
                                type: 'submit'
                            }, store.data);
                        return [2 /*return*/];
                }
            });
        });
    };
    Form.prototype.handleBulkChange = function (values, submit) {
        var _a = this.props; _a.onChange; var store = _a.store, formLazyChange = _a.formLazyChange;
        store.updateData(values);
        store.items.forEach(function (formItem) {
            var updatedValue = getVariable(values, formItem.name, false);
            if (updatedValue !== undefined) {
                // 更新验证状态但保留错误信息
                formItem.reset(true);
                // 这里需要更新value，否则提交时不会使用新的字段值校验
                formItem.changeTmpValue(updatedValue);
                formItem.validateOnChange && formItem.validate(values);
            }
        });
        (formLazyChange === false ? this.emitChange : this.lazyEmitChange)(submit);
    };
    Form.prototype.handleFormSubmit = function (e) {
        var preventEnterSubmit = this.props.preventEnterSubmit;
        e.preventDefault();
        if (preventEnterSubmit) {
            return false;
        }
        return this.handleAction(e, {
            type: 'submit'
        }, this.props.store.data);
    };
    Form.prototype.handleReset = function (action) {
        var onReset = this.props.onReset;
        return function (data) {
            onReset && onReset(data, action);
        };
    };
    Form.prototype.handleAction = function (e, action, data, throwErrors, delegate) {
        if (throwErrors === void 0) { throwErrors = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, store, onSubmit, api, asyncApi, finishedField, checkInterval, _b, saveSuccess, saveFailed, resetAfterSubmit, clearAfterSubmit, onAction, onSaved, onReset, onFinished, onFailed, redirect, reload, target, env, onChange, clearPersistDataAfterSubmit, trimValues, dispatchEvent, __, fields, validationRes, dispatcher;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, store = _a.store, onSubmit = _a.onSubmit, api = _a.api, asyncApi = _a.asyncApi, finishedField = _a.finishedField, checkInterval = _a.checkInterval, _b = _a.messages, saveSuccess = _b.saveSuccess, saveFailed = _b.saveFailed, resetAfterSubmit = _a.resetAfterSubmit, clearAfterSubmit = _a.clearAfterSubmit, onAction = _a.onAction, onSaved = _a.onSaved, onReset = _a.onReset, onFinished = _a.onFinished, onFailed = _a.onFailed, redirect = _a.redirect, reload = _a.reload, target = _a.target, env = _a.env, onChange = _a.onChange, clearPersistDataAfterSubmit = _a.clearPersistDataAfterSubmit, trimValues = _a.trimValues, dispatchEvent = _a.dispatchEvent, __ = _a.translate;
                        // 做动作之前，先把数据同步一下。
                        this.flush();
                        if (trimValues) {
                            store.trimValues();
                        }
                        // 如果 data 就是当前层，则 flush 一下。
                        if (data === this.props.data) {
                            data = store.data;
                        }
                        if (!(Array.isArray(action.required) && action.required.length)) return [3 /*break*/, 4];
                        /** 如果是按钮指定了required，则校验前先清空一下遗留的校验报错 */
                        store.clearErrors();
                        fields = action.required.map(function (item) { return ({
                            name: item,
                            rules: { isRequired: true }
                        }); });
                        return [4 /*yield*/, store.validateFields(fields)];
                    case 1:
                        validationRes = _c.sent();
                        if (!!validationRes) return [3 /*break*/, 3];
                        return [4 /*yield*/, dispatchEvent('validateError', this.props.data)];
                    case 2:
                        dispatcher = _c.sent();
                        if (!(dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented)) {
                            env.notify('error', __('Form.validateFailed'));
                        }
                        /** 抛异常是为了在dialog中catch这个错误，避免弹窗直接关闭 */
                        return [2 /*return*/, Promise.reject(__('Form.validateFailed'))];
                    case 3:
                        /** 重置validated状态，保证submit时触发表单中的校验项 */
                        store.clearErrors();
                        _c.label = 4;
                    case 4:
                        if (action.type === 'submit' ||
                            action.actionType === 'submit' ||
                            action.actionType === 'confirm' ||
                            action.actionType === 'reset-and-submit' ||
                            action.actionType === 'clear-and-submit') {
                            store.setCurrentAction(action);
                            if (action.actionType === 'reset-and-submit') {
                                store.reset(this.handleReset(action));
                            }
                            else if (action.actionType === 'clear-and-submit') {
                                store.clear(this.handleReset(action));
                            }
                            return [2 /*return*/, this.submit(function (values) {
                                    var _a;
                                    if (onSubmit && onSubmit(values, action) === false) {
                                        return Promise.resolve(false);
                                    }
                                    // 走到这里代表校验成功了
                                    dispatchEvent('validateSucc', _this.props.data);
                                    if (target) {
                                        _this.submitToTarget(target, values);
                                        dispatchEvent('submitSucc', createObject(_this.props.data, values));
                                    }
                                    else if (action.actionType === 'reload') {
                                        action.target && _this.reloadTarget(action.target, values);
                                    }
                                    else if (action.actionType === 'dialog') {
                                        store.openDialog(data);
                                    }
                                    else if (action.actionType === 'drawer') {
                                        store.openDrawer(data);
                                    }
                                    else if (isEffectiveApi(action.api || api, values)) {
                                        var finnalAsyncApi_1 = action.asyncApi || asyncApi;
                                        isEffectiveApi(finnalAsyncApi_1, store.data) &&
                                            store.updateData((_a = {},
                                                _a[finishedField || 'finished'] = false,
                                                _a));
                                        return store
                                            .saveRemote(action.api || api, values, {
                                            successMessage: saveSuccess,
                                            errorMessage: saveFailed,
                                            onSuccess: function (result) { return __awaiter(_this, void 0, void 0, function () {
                                                var dispatcher, cbResult;
                                                var _this = this;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, dispatchEvent('submitSucc', createObject(this.props.data, { result: result }))];
                                                        case 1:
                                                            dispatcher = _a.sent();
                                                            if (!isEffectiveApi(finnalAsyncApi_1, store.data) ||
                                                                store.data[finishedField || 'finished']) {
                                                                return [2 /*return*/, {
                                                                        cbResult: null,
                                                                        dispatcher: dispatcher
                                                                    }];
                                                            }
                                                            cbResult = until(function () { return store.checkRemote(finnalAsyncApi_1, store.data); }, function (ret) { return ret && ret[finishedField || 'finished']; }, function (cancel) { return (_this.asyncCancel = cancel); }, checkInterval);
                                                            return [2 /*return*/, {
                                                                    cbResult: cbResult,
                                                                    dispatcher: dispatcher
                                                                }];
                                                    }
                                                });
                                            }); },
                                            onFailed: function (result) { return __awaiter(_this, void 0, void 0, function () {
                                                var dispatcher;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, dispatchEvent('submitFail', createObject(this.props.data, { error: result }))];
                                                        case 1:
                                                            dispatcher = _a.sent();
                                                            return [2 /*return*/, {
                                                                    dispatcher: dispatcher
                                                                }];
                                                    }
                                                });
                                            }); }
                                        })
                                            .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                            var feedback, confirmed;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        onSaved && onSaved(values, response);
                                                        feedback = action.feedback || this.props.feedback;
                                                        if (!(feedback && isVisible(feedback, store.data))) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, this.openFeedback(feedback, store.data)];
                                                    case 1:
                                                        confirmed = _a.sent();
                                                        // 如果 feedback 配置了，取消就跳过原有逻辑。
                                                        if (feedback.skipRestOnCancel && !confirmed) {
                                                            throw new SkipOperation();
                                                        }
                                                        else if (feedback.skipRestOnConfirm && confirmed) {
                                                            throw new SkipOperation();
                                                        }
                                                        _a.label = 2;
                                                    case 2: return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    }
                                    else {
                                        // type为submit，但是没有配api以及target时，只派发事件
                                        dispatchEvent('submitSucc', createObject(_this.props.data, values));
                                    }
                                    return Promise.resolve(null);
                                })
                                    .then(function (values) {
                                    // 有可能 onSubmit return false 了，那么后面的就不应该再执行了。
                                    if (values === false) {
                                        return store.data;
                                    }
                                    if (onFinished && onFinished(values, action) === false) {
                                        return values;
                                    }
                                    resetAfterSubmit && store.reset(_this.handleReset(action));
                                    clearAfterSubmit && store.clear(_this.handleReset(action));
                                    clearPersistDataAfterSubmit && store.clearLocalPersistData();
                                    if (action.redirect || redirect) {
                                        var finalRedirect = filter(action.redirect || redirect, store.data);
                                        finalRedirect && env.jumpTo(finalRedirect, action);
                                    }
                                    else if (action.reload || reload) {
                                        _this.reloadTarget(action.reload || reload, store.data);
                                    }
                                    action.close && _this.closeTarget(action.close);
                                    return values;
                                })
                                    .catch(function (reason) {
                                    if (reason instanceof SkipOperation) {
                                        return;
                                    }
                                    onFailed && onFailed(reason, store.errors);
                                    if (throwErrors) {
                                        throw reason;
                                    }
                                })];
                        }
                        else if (action.type === 'reset' || action.actionType === 'reset') {
                            store.setCurrentAction(action);
                            store.reset(onReset);
                        }
                        else if (action.actionType === 'clear') {
                            store.setCurrentAction(action);
                            store.clear(onReset);
                        }
                        else if (action.actionType === 'validate') {
                            store.setCurrentAction(action);
                            this.validate(true);
                        }
                        else if (action.actionType === 'dialog') {
                            store.setCurrentAction(action);
                            store.openDialog(data);
                        }
                        else if (action.actionType === 'drawer') {
                            store.setCurrentAction(action);
                            store.openDrawer(data);
                        }
                        else if (action.actionType === 'ajax') {
                            store.setCurrentAction(action);
                            if (!isEffectiveApi(action.api)) {
                                return [2 /*return*/, env.alert(__("\u5F53 actionType \u4E3A ajax \u65F6\uFF0C\u8BF7\u8BBE\u7F6E api \u5C5E\u6027"))];
                            }
                            return [2 /*return*/, store
                                    .saveRemote(action.api, data, {
                                    successMessage: __((action.messages && action.messages.success) || saveSuccess),
                                    errorMessage: __((action.messages && action.messages.failed) || saveFailed)
                                })
                                    .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                    var redirect;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                response &&
                                                    onChange &&
                                                    onChange(store.data, difference(store.data, store.pristine), this.props);
                                                if (!store.validated) return [3 /*break*/, 2];
                                                return [4 /*yield*/, this.validate(true)];
                                            case 1:
                                                _a.sent();
                                                _a.label = 2;
                                            case 2:
                                                if (!(action.feedback && isVisible(action.feedback, store.data))) return [3 /*break*/, 4];
                                                return [4 /*yield*/, this.openFeedback(action.feedback, store.data)];
                                            case 3:
                                                _a.sent();
                                                _a.label = 4;
                                            case 4:
                                                redirect = action.redirect && filter(action.redirect, store.data);
                                                redirect && env.jumpTo(redirect, action);
                                                action.reload && this.reloadTarget(action.reload, store.data);
                                                action.close && this.closeTarget(action.close);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })
                                    .catch(function (e) {
                                    onFailed && onFailed(e, store.errors);
                                    if (throwErrors || action.countDown) {
                                        throw e;
                                    }
                                })];
                        }
                        else if (action.actionType === 'reload') {
                            store.setCurrentAction(action);
                            if (action.target) {
                                this.reloadTarget(action.target, data);
                            }
                            else {
                                this.receive(data);
                            }
                            // action.target && this.reloadTarget(action.target, data);
                        }
                        else if (onAction) {
                            // 不识别的丢给上层去处理。
                            return [2 /*return*/, onAction(e, action, data, throwErrors, delegate || this.context)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Form.prototype.handleQuery = function (query) {
        var _a, _b;
        if (this.props.initApi) {
            this.receive(query);
        }
        else {
            (_b = (_a = this.props).onQuery) === null || _b === void 0 ? void 0 : _b.call(_a, query);
        }
    };
    Form.prototype.handleDialogConfirm = function (values, action, ctx, targets) {
        var _a = this.props, store = _a.store; _a.onChange;
        if ((action.mergeData || store.action.mergeData) &&
            values.length === 1 &&
            values[0] &&
            targets[0].props.type === 'form') {
            this.handleBulkChange(values[0], false);
        }
        store.closeDialog(true);
    };
    Form.prototype.handleDialogClose = function (confirmed) {
        if (confirmed === void 0) { confirmed = false; }
        var store = this.props.store;
        store.closeDialog(confirmed);
    };
    Form.prototype.handleDrawerConfirm = function (values, action, ctx, targets) {
        var _a = this.props, store = _a.store, onChange = _a.onChange;
        if ((action.mergeData || store.action.mergeData) &&
            values.length === 1 &&
            values[0] &&
            targets[0].props.type === 'form') {
            store.updateData(values[0]);
            onChange &&
                onChange(store.data, difference(store.data, store.pristine), this.props);
        }
        store.closeDrawer(true);
    };
    Form.prototype.handleDrawerClose = function () {
        var store = this.props.store;
        store.closeDrawer(false);
    };
    Form.prototype.submitToTarget = function (target, values) {
        // 会被覆写
    };
    Form.prototype.reloadTarget = function (target, data) {
        // 会被覆写
    };
    Form.prototype.closeTarget = function (target) {
        // 会被覆写
    };
    Form.prototype.openFeedback = function (dialog, ctx) {
        var _this = this;
        return new Promise(function (resolve) {
            var store = _this.props.store;
            store.setCurrentAction({
                type: 'button',
                actionType: 'dialog',
                dialog: dialog
            });
            store.openDialog(ctx, undefined, function (confirmed) {
                resolve(confirmed);
            });
        });
    };
    Form.prototype.buildActions = function () {
        var _a = this.props, actions = _a.actions, submitText = _a.submitText, body = _a.body, __ = _a.translate;
        if (typeof actions !== 'undefined' ||
            !submitText ||
            (Array.isArray(body) &&
                body.some(function (item) {
                    var _a, _b, _c;
                    return item &&
                        !!~['submit', 'button', 'button-group', 'reset'].indexOf(((_b = (_a = item === null || item === void 0 ? void 0 : item.body) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.type) ||
                            ((_c = item === null || item === void 0 ? void 0 : item.body) === null || _c === void 0 ? void 0 : _c.type) ||
                            item.type);
                }))) {
            return actions;
        }
        return [
            {
                type: 'submit',
                label: __(submitText),
                primary: true
            }
        ];
    };
    Form.prototype.renderFormItems = function (schema, region, otherProps) {
        if (region === void 0) { region = ''; }
        if (otherProps === void 0) { otherProps = {}; }
        var body = Array.isArray(schema.body)
            ? schema.body
            : schema.body
                ? [schema.body]
                : [];
        // 旧用法，让 wrapper 走走 compat 逻辑兼容旧用法
        // 后续可以删除。
        if (!body.length && schema.controls) {
            console.warn('请用 body 代替 controls');
            body = [
                {
                    size: 'none',
                    type: 'wrapper',
                    wrap: false,
                    controls: schema.controls
                }
            ];
        }
        return this.renderChildren(body, region, otherProps);
    };
    Form.prototype.renderChildren = function (children, region, otherProps) {
        var _this = this;
        if (otherProps === void 0) { otherProps = {}; }
        children = children || [];
        if (!Array.isArray(children)) {
            children = [children];
        }
        if (this.props.mode === 'row') {
            this.props.classPrefix;
            children = flatten(children).filter(function (item) {
                if (item.hidden || item.visible === false) {
                    return false;
                }
                var exprProps = getExprProperties(item, _this.props.store.data, undefined, _this.props);
                if (exprProps.hidden || exprProps.visible === false) {
                    return false;
                }
                return true;
            });
            if (!children.length) {
                return null;
            }
            var cx_1 = this.props.classnames;
            return (React.createElement("div", { className: cx_1('Form-row') }, children.map(function (control, key) {
                return ~['hidden', 'formula'].indexOf(control.type) ||
                    control.mode === 'inline' ? (_this.renderChild(control, key, otherProps)) : (React.createElement("div", { key: key, className: cx_1("Form-col", control.columnClassName) }, _this.renderChild(control, '', __assign(__assign({}, otherProps), { mode: 'row' }))));
            })));
        }
        return children.map(function (control, key) {
            return _this.renderChild(control, key, otherProps, region);
        });
    };
    Form.prototype.renderChild = function (control, key, otherProps, region) {
        if (key === void 0) { key = ''; }
        if (otherProps === void 0) { otherProps = {}; }
        if (region === void 0) { region = ''; }
        if (!control) {
            return null;
        }
        else if (typeof control === 'string') {
            control = {
                type: 'tpl',
                tpl: control
            };
        }
        var props = __assign(__assign({}, this.props), otherProps);
        var form = this.props.store;
        var render = props.render, mode = props.mode, horizontal = props.horizontal, store = props.store, disabled = props.disabled, controlWidth = props.controlWidth, resolveDefinitions = props.resolveDefinitions, lazyChange = props.lazyChange; props.formLazyChange; var dispatchEvent = props.dispatchEvent, labelAlign = props.labelAlign, labelWidth = props.labelWidth;
        var subProps = {
            formStore: form,
            data: store.data,
            key: "".concat(control.name || '', "-").concat(control.type, "-").concat(key),
            formInited: form.inited,
            formSubmited: form.submited,
            formMode: mode,
            formHorizontal: horizontal,
            formLabelAlign: labelAlign !== 'left' ? 'right' : labelAlign,
            formLabelWidth: labelWidth,
            controlWidth: controlWidth,
            disabled: disabled || control.disabled || form.loading,
            btnDisabled: disabled || form.loading || form.validating,
            onAction: this.handleAction,
            onQuery: this.handleQuery,
            onChange: this.handleChange,
            onBulkChange: this.handleBulkChange,
            addHook: this.addHook,
            removeHook: this.removeHook,
            renderFormItems: this.renderFormItems,
            formItemDispatchEvent: this.formItemDispatchEvent(dispatchEvent),
            formPristine: form.pristine
            // value: (control as any)?.name
            //   ? getVariable(form.data, (control as any)?.name, canAccessSuperData)
            //   : (control as any)?.value,
            // defaultValue: (control as any)?.value
        };
        var subSchema = __assign({}, control);
        if (subSchema.$ref) {
            subSchema = __assign(__assign({}, resolveDefinitions(subSchema.$ref)), subSchema);
        }
        lazyChange === false && (subSchema.changeImmediately = true);
        return render("".concat(region ? "".concat(region, "/") : '').concat(key), subSchema, subProps);
    };
    Form.prototype.renderBody = function () {
        var _a = this.props, body = _a.body, mode = _a.mode, className = _a.className, cx = _a.classnames, debug = _a.debug, $path = _a.$path, store = _a.store, columnCount = _a.columnCount, render = _a.render;
        var restError = store.restError;
        var WrapperComponent = this.props.wrapperComponent ||
            (/(?:\/|^)form\//.test($path) ? 'div' : 'form');
        var padDom = repeatCount(columnCount && Array.isArray(body)
            ? columnCount - (body.length % columnCount)
            : 0, function (index) { return (React.createElement("div", { className: cx("Form-item Form-item--".concat(mode, " is-placeholder")), key: index })); });
        return (React.createElement(WrapperComponent, { className: cx("Form", "Form--".concat(mode || 'normal'), columnCount ? "Form--column Form--column-".concat(columnCount) : null, className), onSubmit: this.handleFormSubmit, noValidate: true },
            React.createElement("input", { type: "submit", style: { display: 'none' } }),
            debug ? (React.createElement("pre", null,
                React.createElement("code", { className: cx('Form--debug') }, JSON.stringify(store.data, null, 2)))) : null,
            render('spinner', { type: 'spinner' }, {
                overlay: true,
                show: store.loading
            }),
            this.renderFormItems({
                body: body
            }),
            padDom,
            restError && restError.length ? (React.createElement("ul", { className: cx('Form-restError', 'Form-feedback') }, restError.map(function (item, idx) { return (React.createElement("li", { key: idx }, item)); }))) : null,
            render('modal', __assign(__assign({}, (store.action &&
                store.action.dialog)), { type: 'dialog' }), {
                key: 'dialog',
                data: store.dialogData,
                onConfirm: this.handleDialogConfirm,
                onClose: this.handleDialogClose,
                show: store.dialogOpen
            }),
            render('modal', __assign(__assign({}, (store.action &&
                store.action.drawer)), { type: 'drawer' }), {
                key: 'drawer',
                data: store.drawerData,
                onConfirm: this.handleDrawerConfirm,
                onClose: this.handleDrawerClose,
                show: store.drawerOpen
            })));
    };
    Form.prototype.render = function () {
        var _a = this.props; _a.$path; _a.$schema; var wrapWithPanel = _a.wrapWithPanel, render = _a.render, title = _a.title, store = _a.store, panelClassName = _a.panelClassName, headerClassName = _a.headerClassName, footerClassName = _a.footerClassName, footerWrapClassName = _a.footerWrapClassName, actionsClassName = _a.actionsClassName, bodyClassName = _a.bodyClassName, cx = _a.classnames, affixFooter = _a.affixFooter, lazyLoad = _a.lazyLoad, __ = _a.translate, footer = _a.footer; _a.formStore;
        var body = this.renderBody();
        if (wrapWithPanel) {
            body = render('body', {
                type: 'panel',
                title: __(title)
            }, {
                className: cx(panelClassName, 'Panel--form'),
                formStore: this.props.store,
                children: body,
                actions: this.buildActions(),
                onAction: this.handleAction,
                onQuery: this.handleQuery,
                disabled: store.loading,
                btnDisabled: store.loading || store.validating,
                headerClassName: headerClassName,
                footer: footer,
                footerClassName: footerClassName,
                footerWrapClassName: footerWrapClassName,
                actionsClassName: actionsClassName,
                bodyClassName: bodyClassName,
                affixFooter: affixFooter
            });
        }
        if (lazyLoad) {
            body = React.createElement(LazyComponent, null, body);
        }
        return body;
    };
    Form.defaultProps = {
        title: 'Form.title',
        submitText: 'Form.submit',
        initFetch: true,
        wrapWithPanel: true,
        mode: 'normal',
        collapsable: false,
        controlWidth: 'full',
        horizontal: {
            left: 2,
            right: 10,
            offset: 2
        },
        columnCount: 0,
        panelClassName: 'Panel--default',
        messages: {
            fetchFailed: 'fetchFailed',
            saveSuccess: 'saveSuccess',
            saveFailed: 'saveFailed'
        },
        wrapperComponent: '',
        finishedField: 'finished',
        initFinishedField: 'finished',
        labelAlign: 'right'
    };
    Form.propsList = [
        'title',
        'header',
        'controls',
        'tabs',
        'fieldSet',
        'submitText',
        'initFetch',
        'wrapWithPanel',
        'mode',
        'columnCount',
        'collapsable',
        'horizontal',
        'panelClassName',
        'messages',
        'wrapperComponent',
        'resetAfterSubmit',
        'clearAfterSubmit',
        'submitOnInit',
        'submitOnChange',
        'onInit',
        'onReset',
        'onSubmit',
        'onChange',
        'onFailed',
        'onFinished',
        'onSaved',
        'canAccessSuperData',
        'lazyChange',
        'formLazyChange',
        'lazyLoad',
        'formInited',
        'simpleMode',
        'inputOnly',
        'value',
        'actions',
        'multiple'
    ];
    return Form;
}(React.Component));
var FormRenderer = /** @class */ (function (_super) {
    __extends(FormRenderer, _super);
    function FormRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    FormRenderer.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        if (this.props.autoFocus) {
            var scoped = this.context;
            var inputs = scoped.getComponents();
            var focuableInput_1 = find(inputs, function (input) { return input.focus; });
            focuableInput_1 && setTimeout(function () { return focuableInput_1.focus(); }, 200);
        }
    };
    FormRenderer.prototype.componentWillUnmount = function () {
        var scoped = this.context;
        scoped.unRegisterComponent(this);
        _super.prototype.componentWillUnmount.call(this);
    };
    FormRenderer.prototype.doAction = function (action, data, throwErrors) {
        if (data === void 0) { data = this.props.store.data; }
        if (throwErrors === void 0) { throwErrors = false; }
        return this.handleAction(undefined, action, data, throwErrors);
    };
    FormRenderer.prototype.handleAction = function (e, action, ctx, throwErrors, delegate) {
        if (throwErrors === void 0) { throwErrors = false; }
        // 禁用了不要做任何动作。@先注释掉，会引起其他问题
        // if (this.props.disabled) {
        //   return;
        // }
        if (action.target && action.actionType !== 'reload') {
            var scoped_1 = this.context;
            return Promise.all(action.target.split(',').map(function (name) {
                var target = scoped_1.getComponentByName(name);
                return (target &&
                    target.doAction &&
                    target.doAction(__assign(__assign({}, action), { target: undefined }), ctx, throwErrors));
            }));
        }
        else {
            return _super.prototype.handleAction.call(this, e, action, ctx, throwErrors, delegate);
        }
    };
    FormRenderer.prototype.handleDialogConfirm = function (values, action, ctx, targets) {
        _super.prototype.handleDialogConfirm.call(this, values, action, ctx, targets);
        var store = this.props.store;
        var scoped = this.context;
        if (action.reload) {
            scoped.reload(action.reload, ctx);
        }
        else if (store.action && store.action.reload) {
            scoped.reload(store.action.reload, ctx);
        }
    };
    FormRenderer.prototype.submitToTarget = function (target, values) {
        var scoped = this.context;
        scoped.send(target, values);
    };
    FormRenderer.prototype.reloadTarget = function (target, data) {
        var scoped = this.context;
        scoped.reload(target, data);
    };
    FormRenderer.prototype.closeTarget = function (target) {
        var scoped = this.context;
        scoped.close(target);
    };
    FormRenderer.prototype.reload = function (target, query, ctx, silent) {
        if (query) {
            return this.receive(query);
        }
        var scoped = this.context;
        var subPath = '';
        var idx;
        var subQuery = null;
        if (target && ~(idx = target.indexOf('.'))) {
            subPath = target.substring(idx + 1);
            target = target.substring(0, idx);
        }
        var idx2 = target ? target.indexOf('?') : -1;
        if (~idx2) {
            subQuery = dataMapping(qsparse(target.substring(idx2 + 1)), ctx);
            target = target.substring(0, idx2);
        }
        var component;
        if (target &&
            (component = scoped.getComponentByName(target)) &&
            component.reload) {
            component.reload(subPath, subQuery, ctx);
        }
        else if (target === '*') {
            _super.prototype.reload.call(this, target, query, ctx, silent);
            var components = scoped.getComponents();
            components.forEach(function (component) {
                return component.reload && component.reload('', subQuery, ctx);
            });
        }
        else {
            _super.prototype.reload.call(this, target, query, ctx, silent);
        }
    };
    FormRenderer.prototype.receive = function (values, name) {
        if (name) {
            var scoped = this.context;
            var idx = name.indexOf('.');
            var subPath = '';
            if (~idx) {
                subPath = name.substring(1 + idx);
                name = name.substring(0, idx);
            }
            var component = scoped.getComponentByName(name);
            component && component.receive && component.receive(values, subPath);
            return;
        }
        return _super.prototype.receive.call(this, values);
    };
    FormRenderer.prototype.setData = function (values) {
        return _super.prototype.setValues.call(this, values);
    };
    FormRenderer.contextType = ScopedContext;
    FormRenderer = __decorate([
        Renderer({
            type: 'form',
            storeType: FormStore.name,
            isolateScope: true,
            storeExtendsData: function (props) { return props.inheritData; },
            shouldSyncSuperStore: function (store, props, prevProps) {
                var _a, _b;
                // 如果是 QuickEdit，让 store 同步 __super 数据。
                if (props.quickEditFormRef &&
                    props.onQuickChange &&
                    (isObjectShallowModified(prevProps.data, props.data) ||
                        isObjectShallowModified(prevProps.data.__super, props.data.__super) ||
                        isObjectShallowModified((_a = prevProps.data.__super) === null || _a === void 0 ? void 0 : _a.__super, (_b = props.data.__super) === null || _b === void 0 ? void 0 : _b.__super))) {
                    return true;
                }
                return undefined;
            }
        }),
        __metadata("design:paramtypes", [Object, Object])
    ], FormRenderer);
    return FormRenderer;
}(Form));

export { FormRenderer, Form as default };
