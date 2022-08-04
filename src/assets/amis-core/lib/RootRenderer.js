/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var mobxReact = require('mobx-react');
var React = require('react');
var Scoped = require('./Scoped.js');
var root = require('./store/root.js');
var helper = require('./utils/helper.js');
var tpl = require('./utils/tpl.js');
var qs = require('qs');
var pick = require('lodash/pick');
var mapValues = require('lodash/mapValues');
var fileSaver = require('file-saver');
var api = require('./utils/api.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var qs__default = /*#__PURE__*/_interopDefaultLegacy(qs);
var pick__default = /*#__PURE__*/_interopDefaultLegacy(pick);
var mapValues__default = /*#__PURE__*/_interopDefaultLegacy(mapValues);

var RootRenderer = /** @class */ (function (_super) {
    tslib.__extends(RootRenderer, _super);
    function RootRenderer(props) {
        var _this = _super.call(this, props) || this;
        _this.store = props.rootStore.addStore({
            id: helper.guid(),
            path: _this.props.$path,
            storeType: root.RootStore.name,
            parentId: ''
        });
        _this.store.initData(props.data);
        _this.store.updateLocation(props.location);
        helper.bulkBindFunctions(_this, [
            'handleAction',
            'handleDialogConfirm',
            'handleDialogClose',
            'handleDrawerConfirm',
            'handleDrawerClose',
            'handlePageVisibilityChange'
        ]);
        return _this;
    }
    RootRenderer.prototype.componentDidMount = function () {
        document.addEventListener('visibilitychange', this.handlePageVisibilityChange);
    };
    RootRenderer.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (props.data !== prevProps.data) {
            this.store.initData(props.data);
        }
        if (props.location !== prevProps.location) {
            this.store.updateLocation(props.location);
        }
    };
    RootRenderer.prototype.componentDidCatch = function (error, errorInfo) {
        this.store.setRuntimeError(error, errorInfo);
    };
    RootRenderer.prototype.componentWillUnmount = function () {
        this.props.rootStore.removeStore(this.store);
        document.removeEventListener('visibilitychange', this.handlePageVisibilityChange);
    };
    RootRenderer.prototype.handlePageVisibilityChange = function () {
        var env = this.props.env;
        if (document.visibilityState === 'hidden') {
            env === null || env === void 0 ? void 0 : env.tracker({
                eventType: 'pageHidden'
            });
        }
        else if (document.visibilityState === 'visible') {
            env === null || env === void 0 ? void 0 : env.tracker({
                eventType: 'pageVisible'
            });
        }
    };
    RootRenderer.prototype.handleAction = function (e, action, ctx, throwErrors, delegate) {
        var _this = this;
        var _a, _b;
        if (throwErrors === void 0) { throwErrors = false; }
        var _c = this.props, env = _c.env, messages = _c.messages, onAction = _c.onAction, render = _c.render;
        var store = this.store;
        if ((onAction === null || onAction === void 0 ? void 0 : onAction(e, action, ctx, throwErrors, delegate || this.context)) ===
            false) {
            return;
        }
        var scoped = delegate || this.context;
        if (action.actionType === 'reload') {
            action.target && scoped.reload(action.target, ctx);
        }
        else if (action.target) {
            action.target.split(',').forEach(function (name) {
                var target = scoped.getComponentByName(name);
                target &&
                    target.doAction &&
                    target.doAction(tslib.__assign(tslib.__assign({}, action), { target: undefined }), ctx);
            });
        }
        else if (action.actionType === 'url' ||
            action.actionType === 'link' ||
            action.actionType === 'jump') {
            if (!env || !env.jumpTo) {
                throw new Error('env.jumpTo is required!');
            }
            env.jumpTo(tpl.filter((action.to || action.url || action.link), ctx, '| raw'), action, ctx);
        }
        else if (action.actionType === 'email') {
            var mailTo = tpl.filter(action.to, ctx);
            var mailInfo = mapValues__default["default"](pick__default["default"](action, 'to', 'cc', 'bcc', 'subject', 'body'), function (val) { return tpl.filter(val, ctx); });
            var mailStr = qs__default["default"].stringify(mailInfo);
            var mailto = "mailto:".concat(mailTo, "?").concat(mailStr);
            window.open(mailto);
        }
        else if (action.actionType === 'dialog') {
            store.setCurrentAction(action);
            store.openDialog(ctx);
        }
        else if (action.actionType === 'drawer') {
            store.setCurrentAction(action);
            store.openDrawer(ctx);
        }
        else if (action.actionType === 'toast') {
            (_b = (_a = action.toast) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.forEach(function (item) {
                env.notify(item.level || 'info', item.body
                    ? render('body', item.body, tslib.__assign(tslib.__assign({}, _this.props), { data: ctx }))
                    : '', tslib.__assign(tslib.__assign(tslib.__assign({}, action.toast), item), { title: item.title
                        ? render('title', item.title, tslib.__assign(tslib.__assign({}, _this.props), { data: ctx }))
                        : null, useMobileUI: env.useMobileUI }));
            });
        }
        else if (action.actionType === 'ajax') {
            store.setCurrentAction(action);
            store
                .saveRemote(action.api, ctx, {
                successMessage: (action.messages && action.messages.success) ||
                    (messages && messages.saveSuccess),
                errorMessage: (action.messages && action.messages.failed) ||
                    (messages && messages.saveSuccess)
            })
                .then(function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                var redirect;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(action.feedback && helper.isVisible(action.feedback, store.data))) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.openFeedback(action.feedback, store.data)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            redirect = action.redirect && tpl.filter(action.redirect, store.data);
                            redirect && env.jumpTo(redirect, action);
                            action.reload &&
                                this.reloadTarget(delegate || this.context, action.reload, store.data);
                            return [2 /*return*/];
                    }
                });
            }); })
                .catch(function (e) {
                if (throwErrors || action.countDown) {
                    throw e;
                }
            });
        }
        else if (action.actionType === 'copy' &&
            (action.content || action.copy)) {
            env.copy &&
                env.copy(tpl.filter(action.content || action.copy, ctx, '| raw'), {
                    format: action.copyFormat
                });
        }
        else if (action.actionType === 'saveAs') {
            // 使用 saveAs 实现下载
            // 不支持 env，除非以后将 saveAs 代码拷过来改
            var api$1 = api.normalizeApi(action.api);
            if (typeof api$1.url === 'string') {
                var fileName = action.fileName || 'data.txt';
                if (api$1.url.indexOf('.') !== -1) {
                    fileName = api$1.url.split('/').pop();
                }
                fileSaver.saveAs(api$1.url, fileName);
            }
        }
    };
    RootRenderer.prototype.handleDialogConfirm = function (values, action) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var store = this.store;
        if (action.mergeData && values.length === 1 && values[0]) {
            store.updateData(values[0]);
        }
        var dialog = store.action.dialog;
        if (dialog &&
            dialog.onConfirm &&
            dialog.onConfirm.apply(dialog, tslib.__spreadArray([values, action], args, false)) === false) {
            return;
        }
        store.closeDialog(true);
    };
    RootRenderer.prototype.handleDialogClose = function (confirmed) {
        if (confirmed === void 0) { confirmed = false; }
        var store = this.store;
        store.closeDialog(confirmed);
    };
    RootRenderer.prototype.handleDrawerConfirm = function (values, action) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var store = this.store;
        if (action.mergeData && values.length === 1 && values[0]) {
            store.updateData(values[0]);
        }
        var drawer = store.action.drawer;
        if (drawer &&
            drawer.onConfirm &&
            drawer.onConfirm.apply(drawer, tslib.__spreadArray([values, action], args, false)) === false) {
            return;
        }
        store.closeDrawer();
    };
    RootRenderer.prototype.handleDrawerClose = function () {
        var store = this.store;
        store.closeDrawer();
    };
    RootRenderer.prototype.openFeedback = function (dialog, ctx) {
        var _this = this;
        return new Promise(function (resolve) {
            var store = _this.store;
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
    RootRenderer.prototype.reloadTarget = function (scoped, target, data) {
        scoped.reload(target, data);
    };
    RootRenderer.prototype.render = function () {
        var _a;
        var _b = this.props, pathPrefix = _b.pathPrefix, schema = _b.schema, render = _b.render, rest = tslib.__rest(_b, ["pathPrefix", "schema", "render"]);
        var store = this.store;
        if (store.runtimeError) {
            return render('error', {
                type: 'alert',
                level: 'danger'
            }, tslib.__assign(tslib.__assign({}, rest), { topStore: this.store, body: (React__default["default"].createElement(React__default["default"].Fragment, null,
                    React__default["default"].createElement("h3", null, (_a = this.store.runtimeError) === null || _a === void 0 ? void 0 : _a.toString()),
                    React__default["default"].createElement("pre", null,
                        React__default["default"].createElement("code", null, this.store.runtimeErrorStack.componentStack)))) }));
        }
        return (React__default["default"].createElement(React__default["default"].Fragment, null,
            render(pathPrefix, schema, tslib.__assign(tslib.__assign({}, rest), { topStore: this.store, data: this.store.downStream, onAction: this.handleAction })),
            render('spinner', {
                type: 'spinner'
            }, tslib.__assign(tslib.__assign({}, rest), { topStore: this.store, show: store.loading })),
            store.error
                ? render('error', {
                    type: 'alert'
                }, tslib.__assign(tslib.__assign({}, rest), { topStore: this.store, body: store.msg, showCloseButton: true, onClose: store.clearMessage }))
                : null,
            render('dialog', tslib.__assign(tslib.__assign({}, (store.action &&
                store.action.dialog)), { type: 'dialog' }), tslib.__assign(tslib.__assign({}, rest), { key: 'dialog', topStore: this.store, data: store.dialogData, onConfirm: this.handleDialogConfirm, onClose: this.handleDialogClose, show: store.dialogOpen, onAction: this.handleAction })),
            render('drawer', tslib.__assign(tslib.__assign({}, (store.action &&
                store.action.drawer)), { type: 'drawer' }), tslib.__assign(tslib.__assign({}, rest), { key: 'drawer', topStore: this.store, data: store.drawerData, onConfirm: this.handleDrawerConfirm, onClose: this.handleDrawerClose, show: store.drawerOpen, onAction: this.handleAction }))));
    };
    RootRenderer.contextType = Scoped.ScopedContext;
    RootRenderer = tslib.__decorate([
        mobxReact.observer,
        tslib.__metadata("design:paramtypes", [Object])
    ], RootRenderer);
    return RootRenderer;
}(React__default["default"].Component));

exports.RootRenderer = RootRenderer;
