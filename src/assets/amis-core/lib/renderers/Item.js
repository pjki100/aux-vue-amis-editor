/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var hoistNonReactStatic = require('hoist-non-react-statics');
var mobx = require('mobx');
var factory = require('../factory.js');
var helper = require('../utils/helper.js');
var mobxReact = require('mobx-react');
var tpl = require('../utils/tpl.js');
var WithStore = require('../WithStore.js');
var wrapControl = require('./wrapControl.js');
var debouce = require('lodash/debounce');
var api = require('../utils/api.js');
var ReactDOM = require('react-dom');
require('../utils/ColorScale.js');
require('lodash/chunk');
var dataMapping = require('../utils/dataMapping.js');
require('../utils/DataSchema.js');
require('../utils/DataScope.js');
require('moment');
var object = require('../utils/object.js');
require('amis-formula');
require('../utils/debug.js');
require('../utils/errors.js');
require('lodash/isPlainObject');
require('classnames');
require('../utils/filter.js');
require('lodash/isObject');
require('lodash/isString');
require('lodash/isBoolean');
var getVariable = require('../utils/getVariable.js');
require('../utils/image.js');
require('../actions/Action.js');
require('../utils/resize-sensor.js');
require('../node_modules/dom-helpers/esm/addEventListener.js');
require('../node_modules/warning/warning.js');
require('../utils/SimpleMap.js');
require('lodash/mapValues');
require('lodash/camelCase');
require('uncontrollable');
require('../utils/validations.js');
require('../utils/Animation.js');
var Overlay = require('../components/Overlay.js');
var PopOver = require('../components/PopOver.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var hoistNonReactStatic__default = /*#__PURE__*/_interopDefaultLegacy(hoistNonReactStatic);
var debouce__default = /*#__PURE__*/_interopDefaultLegacy(debouce);

var FormItemWrap = /** @class */ (function (_super) {
    tslib.__extends(FormItemWrap, _super);
    function FormItemWrap(props) {
        var _this = _super.call(this, props) || this;
        _this.reaction = [];
        _this.syncAutoFill = debouce__default["default"](function (term, reload) {
            (function (term, reload) { return tslib.__awaiter(_this, void 0, void 0, function () {
                var _a, autoFill, onBulkChange, formItem, data, itemName, ctx, result;
                var _b;
                var _c, _d;
                return tslib.__generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _a = this.props, autoFill = _a.autoFill, onBulkChange = _a.onBulkChange, formItem = _a.formItem, data = _a.data;
                            // 参照录入
                            if (!autoFill || (autoFill && !(autoFill === null || autoFill === void 0 ? void 0 : autoFill.hasOwnProperty('api')))) {
                                return [2 /*return*/];
                            }
                            if (!(autoFill === null || autoFill === void 0 ? void 0 : autoFill.showSuggestion)) return [3 /*break*/, 1];
                            this.handleAutoFill('change');
                            return [3 /*break*/, 3];
                        case 1:
                            itemName = formItem === null || formItem === void 0 ? void 0 : formItem.name;
                            ctx = object.createObject(data, (_b = {},
                                _b[itemName || ''] = term,
                                _b));
                            if (!((onBulkChange &&
                                api.isEffectiveApi(autoFill.api, ctx) &&
                                this.lastSearchTerm !== term) ||
                                reload)) return [3 /*break*/, 3];
                            return [4 /*yield*/, (formItem === null || formItem === void 0 ? void 0 : formItem.loadAutoUpdateData(autoFill.api, ctx, !!((_c = autoFill.api) === null || _c === void 0 ? void 0 : _c.silent)))];
                        case 2:
                            result = _e.sent();
                            this.lastSearchTerm =
                                (_d = (result && getVariable.getVariable(result, itemName))) !== null && _d !== void 0 ? _d : term;
                            if (autoFill === null || autoFill === void 0 ? void 0 : autoFill.fillMapping) {
                                result = dataMapping.dataMapping(autoFill.fillMapping, result);
                            }
                            result && (onBulkChange === null || onBulkChange === void 0 ? void 0 : onBulkChange(result));
                            _e.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); })(term, reload).catch(function (e) { return console.error(e); });
        }, 250, {
            trailing: true,
            leading: false
        });
        _this.state = {
            isOpened: false
        };
        var model = props.formItem;
        if (model) {
            _this.reaction.push(mobx.reaction(function () { return "".concat(model.errors.join('')).concat(model.isFocused).concat(model.dialogOpen); }, function () { return _this.forceUpdate(); }));
            _this.reaction.push(mobx.reaction(function () { return JSON.stringify(model.tmpValue); }, function () { return _this.syncAutoFill(model.tmpValue); }));
        }
        return _this;
    }
    FormItemWrap.prototype.componentDidUpdate = function (prevProps) {
        var _a, _b, _c;
        var props = this.props;
        var model = props.formItem;
        if (api.isEffectiveApi((_a = props.autoFill) === null || _a === void 0 ? void 0 : _a.api, props.data) &&
            api.isApiOutdated((_b = prevProps.autoFill) === null || _b === void 0 ? void 0 : _b.api, (_c = props.autoFill) === null || _c === void 0 ? void 0 : _c.api, prevProps.data, props.data)) {
            this.syncAutoFill(model === null || model === void 0 ? void 0 : model.tmpValue, true);
        }
    };
    FormItemWrap.prototype.componentDidMount = function () {
        this.target = ReactDOM.findDOMNode(this);
    };
    FormItemWrap.prototype.componentWillUnmount = function () {
        this.reaction.forEach(function (fn) { return fn(); });
        this.reaction = [];
        this.syncAutoFill.cancel();
    };
    FormItemWrap.prototype.handleFocus = function (e) {
        var _a = this.props, model = _a.formItem, autoFill = _a.autoFill;
        model && model.focus();
        this.props.onFocus && this.props.onFocus(e);
        if (!autoFill ||
            (autoFill && !(autoFill === null || autoFill === void 0 ? void 0 : autoFill.hasOwnProperty('showSuggestion')))) {
            return;
        }
        this.handleAutoFill('focus');
    };
    FormItemWrap.prototype.handleBlur = function (e) {
        var model = this.props.formItem;
        model && model.blur();
        this.props.onBlur && this.props.onBlur(e);
    };
    FormItemWrap.prototype.handleAutoFill = function (type) {
        var _this = this;
        var _a = this.props, autoFill = _a.autoFill; _a.onBulkChange; var formItem = _a.formItem, data = _a.data;
        var trigger = autoFill.trigger, mode = autoFill.mode;
        if (trigger === type && mode === 'popOver') {
            // 参照录入 popOver形式
            this.setState({
                isOpened: true
            });
        }
        else if (
        // 参照录入 dialog | drawer
        trigger === type &&
            (mode === 'dialog' || mode === 'drawer')) {
            formItem === null || formItem === void 0 ? void 0 : formItem.openDialog(this.buildSchema(), data, function (result) {
                if (!(result === null || result === void 0 ? void 0 : result.selectedItems)) {
                    return;
                }
                _this.updateAutoFillData(result.selectedItems);
            });
        }
    };
    FormItemWrap.prototype.updateAutoFillData = function (context) {
        var _a = this.props, formStore = _a.formStore, autoFill = _a.autoFill, onBulkChange = _a.onBulkChange;
        var fillMapping = autoFill.fillMapping, multiple = autoFill.multiple;
        // form原始数据
        var data = formStore === null || formStore === void 0 ? void 0 : formStore.data;
        var contextData = object.createObject(tslib.__assign({ items: !multiple ? [context] : context }, data), tslib.__assign({}, context));
        var responseData = {};
        responseData = dataMapping.dataMapping(fillMapping, contextData);
        if (!multiple && !fillMapping) {
            responseData = context;
        }
        onBulkChange === null || onBulkChange === void 0 ? void 0 : onBulkChange(responseData);
    };
    FormItemWrap.prototype.buildSchema = function () {
        var _this = this;
        var _a = this.props, render = _a.render, autoFill = _a.autoFill, ns = _a.classPrefix, cx = _a.classnames, __ = _a.translate;
        if (!autoFill || (autoFill && !(autoFill === null || autoFill === void 0 ? void 0 : autoFill.hasOwnProperty('api')))) {
            return;
        }
        var api = autoFill.api, mode = autoFill.mode, size = autoFill.size, offset = autoFill.offset, position = autoFill.position, multiple = autoFill.multiple, filter = autoFill.filter, columns = autoFill.columns, labelField = autoFill.labelField, popOverContainer = autoFill.popOverContainer, popOverClassName = autoFill.popOverClassName;
        var form = {
            type: 'form',
            // debug: true,
            title: '',
            className: 'suggestion-form',
            body: {
                type: 'picker',
                embed: true,
                joinValues: false,
                label: false,
                labelField: labelField,
                multiple: multiple,
                name: 'selectedItems',
                options: [],
                required: true,
                source: api,
                pickerSchema: {
                    type: 'crud',
                    affixHeader: false,
                    alwaysShowPagination: true,
                    keepItemSelectionOnPageChange: true,
                    headerToolbar: [],
                    footerToolbar: [
                        {
                            type: 'pagination',
                            align: 'left'
                        },
                        {
                            type: 'bulkActions',
                            align: 'right',
                            className: 'ml-2'
                        }
                    ],
                    multiple: multiple,
                    filter: filter,
                    columns: columns || []
                }
            },
            actions: [
                {
                    type: 'button',
                    actionType: 'cancel',
                    label: __('cancel')
                },
                {
                    type: 'submit',
                    actionType: 'submit',
                    level: 'primary',
                    label: __('confirm')
                }
            ]
        };
        var schema = {
            type: mode,
            className: 'auto-fill-dialog',
            title: __('FormItem.autoFillSuggest'),
            size: size,
            body: form,
            actions: [
                {
                    type: 'button',
                    actionType: 'cancel',
                    label: __('cancel')
                },
                {
                    type: 'submit',
                    actionType: 'submit',
                    level: 'primary',
                    label: __('confirm')
                }
            ]
        };
        if (mode === 'popOver') {
            return (React__default["default"].createElement(Overlay["default"], { container: popOverContainer || this.target, target: function () { return _this.target; }, placement: position || 'left-bottom-left-top', show: true },
                React__default["default"].createElement(PopOver["default"], { classPrefix: ns, className: cx("".concat(ns, "auto-fill-popOver"), popOverClassName), style: {
                        minWidth: this.target ? this.target.offsetWidth : undefined
                    }, offset: offset, onHide: this.hanldeClose, overlay: true }, render('popOver-auto-fill-form', form, {
                    onSubmit: this.hanldeSubmit
                }))));
        }
        else {
            return schema;
        }
    };
    // 参照录入popOver提交
    FormItemWrap.prototype.hanldeSubmit = function (values) {
        var _a = this.props; _a.onBulkChange; var autoFill = _a.autoFill;
        if (!autoFill || (autoFill && !(autoFill === null || autoFill === void 0 ? void 0 : autoFill.hasOwnProperty('api')))) {
            return;
        }
        this.updateAutoFillData(values.selectedItems);
        this.hanldeClose();
    };
    FormItemWrap.prototype.hanldeClose = function () {
        this.setState({
            isOpened: false
        });
    };
    FormItemWrap.prototype.handleOpenDialog = function (schema, data) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var model;
            return tslib.__generator(this, function (_a) {
                model = this.props.formItem;
                if (!model) {
                    return [2 /*return*/];
                }
                return [2 /*return*/, new Promise(function (resolve) {
                        return model.openDialog(schema, data, function (result) { return resolve(result); });
                    })];
            });
        });
    };
    FormItemWrap.prototype.handleDialogConfirm = function (_a) {
        var values = _a[0];
        var model = this.props.formItem;
        if (!model) {
            return;
        }
        model.closeDialog(values);
    };
    FormItemWrap.prototype.handleDialogClose = function (confirmed) {
        if (confirmed === void 0) { confirmed = false; }
        var model = this.props.formItem;
        if (!model) {
            return;
        }
        model.closeDialog(confirmed);
    };
    FormItemWrap.prototype.renderControl = function () {
        var _a;
        var _b = this.props, inputClassName = _b.inputClassName, model = _b.formItem, cx = _b.classnames; _b.children; var type = _b.type, renderControl = _b.renderControl; _b.formItemConfig; var sizeMutable = _b.sizeMutable, size = _b.size, defaultSize = _b.defaultSize, useMobileUI = _b.useMobileUI, rest = tslib.__rest(_b, ["inputClassName", "formItem", "classnames", "children", "type", "renderControl", "formItemConfig", "sizeMutable", "size", "defaultSize", "useMobileUI"]);
        var mobileUI = useMobileUI && helper.isMobile();
        if (renderControl) {
            var controlSize = size || defaultSize;
            return renderControl(tslib.__assign(tslib.__assign({}, rest), { onOpenDialog: this.handleOpenDialog, type: type, classnames: cx, formItem: model, className: cx("Form-control", (_a = {
                        'is-inline': !!rest.inline && !mobileUI,
                        'is-error': model && !model.valid
                    },
                    _a["Form-control--withSize Form-control--size".concat(helper.ucFirst(controlSize))] = sizeMutable !== false &&
                        typeof controlSize === 'string' &&
                        !!controlSize &&
                        controlSize !== 'full',
                    _a), model === null || model === void 0 ? void 0 : model.errClassNames, inputClassName) }));
        }
        return null;
    };
    FormItemWrap.prototype.render = function () {
        var _a = this.props, formMode = _a.formMode, inputOnly = _a.inputOnly, wrap = _a.wrap, render = _a.render, model = _a.formItem;
        var mode = this.props.mode || formMode;
        if (wrap === false || inputOnly) {
            return this.renderControl();
        }
        var renderLayout = FormItemWrap.layoutRenderers[mode] ||
            FormItemWrap.layoutRenderers['normal'];
        return (React__default["default"].createElement(React__default["default"].Fragment, null,
            renderLayout(this.props, this.renderControl.bind(this)),
            model
                ? render('modal', tslib.__assign({ type: 'dialog' }, model.dialogSchema), {
                    show: model.dialogOpen,
                    onClose: this.handleDialogClose,
                    onConfirm: this.handleDialogConfirm,
                    data: model.dialogData,
                    formStore: undefined
                })
                : null));
    };
    /**
     * 布局扩充点，可以自己扩充表单项的布局方式
     */
    FormItemWrap.layoutRenderers = {
        horizontal: function (props, renderControl) {
            var _a, _b, _c;
            var className = props.className, cx = props.classnames, description = props.description, descriptionClassName = props.descriptionClassName, captionClassName = props.captionClassName, desc = props.desc, label = props.label, labelClassName = props.labelClassName, render = props.render, required = props.required, caption = props.caption, remark = props.remark, labelRemark = props.labelRemark, env = props.env, model = props.formItem, renderLabel = props.renderLabel, renderDescription = props.renderDescription, hint = props.hint, data = props.data, showErrorMsg = props.showErrorMsg, useMobileUI = props.useMobileUI, __ = props.translate;
            // 强制不渲染 label 的话
            if (renderLabel === false) {
                label = label === false ? false : '';
            }
            description = description || desc;
            var horizontal = props.horizontal || props.formHorizontal || {};
            var left = helper.getWidthRate(horizontal.left);
            var right = helper.getWidthRate(horizontal.right);
            var labelAlign = props.labelAlign || props.formLabelAlign;
            var labelWidth = props.labelWidth || props.formLabelWidth;
            return (React__default["default"].createElement("div", { "data-role": "form-item", className: cx("Form-item Form-item--horizontal", className, (_a = {
                        'Form-item--horizontal-justify': horizontal.justify
                    },
                    _a["is-error"] = model && !model.valid,
                    _a["is-required"] = required,
                    _a), model === null || model === void 0 ? void 0 : model.errClassNames) },
                label !== false ? (React__default["default"].createElement("label", { className: cx("Form-label", (_b = {},
                        _b["Form-itemColumn--".concat(typeof horizontal.leftFixed === 'string'
                            ? horizontal.leftFixed
                            : 'normal')] = horizontal.leftFixed,
                        _b["Form-itemColumn--".concat(left)] = !horizontal.leftFixed,
                        _b['Form-label--left'] = labelAlign === 'left',
                        _b), labelClassName), style: labelWidth != null ? { width: labelWidth } : undefined },
                    React__default["default"].createElement("span", null,
                        label
                            ? render('label', typeof label === 'string'
                                ? tpl.filter(__(label), data)
                                : label)
                            : null,
                        required && (label || labelRemark) ? (React__default["default"].createElement("span", { className: cx("Form-star") }, "*")) : null,
                        labelRemark
                            ? render('label-remark', {
                                type: 'remark',
                                icon: labelRemark.icon || 'warning-mark',
                                tooltip: labelRemark,
                                useMobileUI: useMobileUI,
                                className: cx("Form-labelRemark"),
                                container: props.popOverContainer
                                    ? props.popOverContainer
                                    : env && env.getModalContainer
                                        ? env.getModalContainer
                                        : undefined
                            })
                            : null))) : null,
                React__default["default"].createElement("div", { className: cx("Form-value", (_c = {},
                        // [`Form-itemColumn--offset${getWidthRate(horizontal.offset)}`]: !label && label !== false,
                        _c["Form-itemColumn--".concat(right)] = !horizontal.leftFixed && !!right && right !== 12 - left,
                        _c)) },
                    renderControl(),
                    caption
                        ? render('caption', caption, {
                            className: cx("Form-caption", captionClassName)
                        })
                        : null,
                    remark
                        ? render('remark', {
                            type: 'remark',
                            icon: remark.icon || 'warning-mark',
                            tooltip: remark,
                            className: cx("Form-remark"),
                            useMobileUI: useMobileUI,
                            container: props.popOverContainer
                                ? props.popOverContainer
                                : env && env.getModalContainer
                                    ? env.getModalContainer
                                    : undefined
                        })
                        : null,
                    hint && model && model.isFocused
                        ? render('hint', hint, {
                            className: cx("Form-hint")
                        })
                        : null,
                    model &&
                        !model.valid &&
                        showErrorMsg !== false &&
                        Array.isArray(model.errors) ? (React__default["default"].createElement("ul", { className: cx("Form-feedback") }, model.errors.map(function (msg, key) { return (React__default["default"].createElement("li", { key: key }, msg)); }))) : null,
                    renderDescription !== false && description
                        ? render('description', description, {
                            className: cx("Form-description", descriptionClassName)
                        })
                        : null)));
        },
        normal: function (props, renderControl) {
            var _a;
            var className = props.className, cx = props.classnames, desc = props.desc, description = props.description, label = props.label, labelClassName = props.labelClassName, render = props.render, required = props.required, caption = props.caption, remark = props.remark, labelRemark = props.labelRemark, env = props.env, descriptionClassName = props.descriptionClassName, captionClassName = props.captionClassName, model = props.formItem, renderLabel = props.renderLabel, renderDescription = props.renderDescription, hint = props.hint, data = props.data, showErrorMsg = props.showErrorMsg, useMobileUI = props.useMobileUI, __ = props.translate;
            description = description || desc;
            return (React__default["default"].createElement("div", { "data-role": "form-item", className: cx("Form-item Form-item--normal", className, (_a = {
                        'is-error': model && !model.valid
                    },
                    _a["is-required"] = required,
                    _a), model === null || model === void 0 ? void 0 : model.errClassNames) },
                label && renderLabel !== false ? (React__default["default"].createElement("label", { className: cx("Form-label", labelClassName) },
                    React__default["default"].createElement("span", null,
                        label
                            ? render('label', typeof label === 'string'
                                ? tpl.filter(__(label), data)
                                : label)
                            : null,
                        required && (label || labelRemark) ? (React__default["default"].createElement("span", { className: cx("Form-star") }, "*")) : null,
                        labelRemark
                            ? render('label-remark', {
                                type: 'remark',
                                icon: labelRemark.icon || 'warning-mark',
                                tooltip: labelRemark,
                                className: cx("Form-lableRemark"),
                                useMobileUI: useMobileUI,
                                container: props.popOverContainer
                                    ? props.popOverContainer
                                    : env && env.getModalContainer
                                        ? env.getModalContainer
                                        : undefined
                            })
                            : null))) : null,
                renderControl(),
                caption
                    ? render('caption', caption, {
                        className: cx("Form-caption", captionClassName)
                    })
                    : null,
                remark
                    ? render('remark', {
                        type: 'remark',
                        icon: remark.icon || 'warning-mark',
                        className: cx("Form-remark"),
                        tooltip: remark,
                        useMobileUI: useMobileUI,
                        container: env && env.getModalContainer
                            ? env.getModalContainer
                            : undefined
                    })
                    : null,
                hint && model && model.isFocused
                    ? render('hint', hint, {
                        className: cx("Form-hint")
                    })
                    : null,
                model &&
                    !model.valid &&
                    showErrorMsg !== false &&
                    Array.isArray(model.errors) ? (React__default["default"].createElement("ul", { className: cx("Form-feedback") }, model.errors.map(function (msg, key) { return (React__default["default"].createElement("li", { key: key }, msg)); }))) : null,
                renderDescription !== false && description
                    ? render('description', description, {
                        className: cx("Form-description", descriptionClassName)
                    })
                    : null));
        },
        inline: function (props, renderControl) {
            var _a;
            var className = props.className, cx = props.classnames, desc = props.desc, description = props.description, label = props.label, labelClassName = props.labelClassName, render = props.render, required = props.required, caption = props.caption, descriptionClassName = props.descriptionClassName, captionClassName = props.captionClassName, model = props.formItem, remark = props.remark, labelRemark = props.labelRemark, env = props.env, hint = props.hint, renderLabel = props.renderLabel, renderDescription = props.renderDescription, data = props.data, showErrorMsg = props.showErrorMsg, useMobileUI = props.useMobileUI, __ = props.translate;
            var labelWidth = props.labelWidth || props.formLabelWidth;
            description = description || desc;
            return (React__default["default"].createElement("div", { "data-role": "form-item", className: cx("Form-item Form-item--inline", className, (_a = {
                        'is-error': model && !model.valid
                    },
                    _a["is-required"] = required,
                    _a), model === null || model === void 0 ? void 0 : model.errClassNames) },
                label && renderLabel !== false ? (React__default["default"].createElement("label", { className: cx("Form-label", labelClassName), style: labelWidth != null ? { width: labelWidth } : undefined },
                    React__default["default"].createElement("span", null,
                        label
                            ? render('label', typeof label === 'string'
                                ? tpl.filter(__(label), data)
                                : label)
                            : label,
                        required && (label || labelRemark) ? (React__default["default"].createElement("span", { className: cx("Form-star") }, "*")) : null,
                        labelRemark
                            ? render('label-remark', {
                                type: 'remark',
                                icon: labelRemark.icon || 'warning-mark',
                                tooltip: labelRemark,
                                className: cx("Form-lableRemark"),
                                useMobileUI: useMobileUI,
                                container: props.popOverContainer
                                    ? props.popOverContainer
                                    : env && env.getModalContainer
                                        ? env.getModalContainer
                                        : undefined
                            })
                            : null))) : null,
                React__default["default"].createElement("div", { className: cx("Form-value") },
                    renderControl(),
                    caption
                        ? render('caption', caption, {
                            className: cx("Form-caption", captionClassName)
                        })
                        : null,
                    remark
                        ? render('remark', {
                            type: 'remark',
                            icon: remark.icon || 'warning-mark',
                            className: cx("Form-remark"),
                            tooltip: remark,
                            useMobileUI: useMobileUI,
                            container: props.popOverContainer
                                ? props.popOverContainer
                                : env && env.getModalContainer
                                    ? env.getModalContainer
                                    : undefined
                        })
                        : null,
                    hint && model && model.isFocused
                        ? render('hint', hint, {
                            className: cx("Form-hint")
                        })
                        : null,
                    model &&
                        !model.valid &&
                        showErrorMsg !== false &&
                        Array.isArray(model.errors) ? (React__default["default"].createElement("ul", { className: cx("Form-feedback") }, model.errors.map(function (msg, key) { return (React__default["default"].createElement("li", { key: key }, msg)); }))) : null,
                    renderDescription !== false && description
                        ? render('description', description, {
                            className: cx("Form-description", descriptionClassName)
                        })
                        : null)));
        },
        row: function (props, renderControl) {
            var _a;
            var className = props.className, cx = props.classnames, desc = props.desc, description = props.description, label = props.label, labelClassName = props.labelClassName, render = props.render, required = props.required, caption = props.caption, remark = props.remark, labelRemark = props.labelRemark, env = props.env, descriptionClassName = props.descriptionClassName, captionClassName = props.captionClassName, model = props.formItem, renderLabel = props.renderLabel, renderDescription = props.renderDescription, hint = props.hint, data = props.data, showErrorMsg = props.showErrorMsg, useMobileUI = props.useMobileUI, __ = props.translate;
            var labelWidth = props.labelWidth || props.formLabelWidth;
            description = description || desc;
            return (React__default["default"].createElement("div", { "data-role": "form-item", className: cx("Form-item Form-item--row", className, (_a = {
                        'is-error': model && !model.valid
                    },
                    _a["is-required"] = required,
                    _a), model === null || model === void 0 ? void 0 : model.errClassNames) },
                React__default["default"].createElement("div", { className: cx('Form-rowInner') },
                    label && renderLabel !== false ? (React__default["default"].createElement("label", { className: cx("Form-label", labelClassName), style: labelWidth != null ? { width: labelWidth } : undefined },
                        React__default["default"].createElement("span", null,
                            render('label', typeof label === 'string' ? tpl.filter(__(label), data) : label),
                            required && (label || labelRemark) ? (React__default["default"].createElement("span", { className: cx("Form-star") }, "*")) : null,
                            labelRemark
                                ? render('label-remark', {
                                    type: 'remark',
                                    icon: labelRemark.icon || 'warning-mark',
                                    tooltip: labelRemark,
                                    className: cx("Form-lableRemark"),
                                    useMobileUI: useMobileUI,
                                    container: props.popOverContainer
                                        ? props.popOverContainer
                                        : env && env.getModalContainer
                                            ? env.getModalContainer
                                            : undefined
                                })
                                : null))) : null,
                    renderControl(),
                    caption
                        ? render('caption', caption, {
                            className: cx("Form-caption", captionClassName)
                        })
                        : null,
                    remark
                        ? render('remark', {
                            type: 'remark',
                            icon: remark.icon || 'warning-mark',
                            className: cx("Form-remark"),
                            tooltip: remark,
                            container: env && env.getModalContainer
                                ? env.getModalContainer
                                : undefined
                        })
                        : null),
                hint && model && model.isFocused
                    ? render('hint', hint, {
                        className: cx("Form-hint")
                    })
                    : null,
                model &&
                    !model.valid &&
                    showErrorMsg !== false &&
                    Array.isArray(model.errors) ? (React__default["default"].createElement("ul", { className: cx('Form-feedback') }, model.errors.map(function (msg, key) { return (React__default["default"].createElement("li", { key: key }, msg)); }))) : null,
                description && renderDescription !== false
                    ? render('description', description, {
                        className: cx("Form-description", descriptionClassName)
                    })
                    : null));
        }
    };
    tslib.__decorate([
        helper.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], FormItemWrap.prototype, "handleFocus", null);
    tslib.__decorate([
        helper.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], FormItemWrap.prototype, "handleBlur", null);
    tslib.__decorate([
        helper.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], FormItemWrap.prototype, "hanldeSubmit", null);
    tslib.__decorate([
        helper.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], FormItemWrap.prototype, "hanldeClose", null);
    tslib.__decorate([
        helper.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object, Object]),
        tslib.__metadata("design:returntype", Promise)
    ], FormItemWrap.prototype, "handleOpenDialog", null);
    tslib.__decorate([
        helper.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Array]),
        tslib.__metadata("design:returntype", void 0)
    ], FormItemWrap.prototype, "handleDialogConfirm", null);
    tslib.__decorate([
        helper.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [Object]),
        tslib.__metadata("design:returntype", void 0)
    ], FormItemWrap.prototype, "handleDialogClose", null);
    return FormItemWrap;
}(React__default["default"].Component));
// 白名单形式，只有这些属性发生变化，才会往下更新。
// 除非配置  strictMode
var detectProps = [
    'formPristine',
    'formInited',
    'addable',
    'addButtonClassName',
    'addButtonText',
    'addOn',
    'btnClassName',
    'btnLabel',
    'btnDisabled',
    'className',
    'clearable',
    'columns',
    'columnsCount',
    'controls',
    'desc',
    'description',
    'disabled',
    'draggable',
    'editable',
    'editButtonClassName',
    'formHorizontal',
    'formMode',
    'hideRoot',
    'horizontal',
    'icon',
    'inline',
    'inputClassName',
    'label',
    'labelClassName',
    'labelField',
    'language',
    'level',
    'max',
    'maxRows',
    'min',
    'minRows',
    'multiLine',
    'multiple',
    'option',
    'placeholder',
    'removable',
    'required',
    'remark',
    'hint',
    'rows',
    'searchable',
    'showCompressOptions',
    'size',
    'step',
    'showInput',
    'unit',
    'value',
    'diffValue',
    'borderMode',
    'items',
    'showCounter',
    'minLength',
    'maxLength',
    'embed',
    'displayMode',
    'revealPassword'
];
function asFormItem(config) {
    return function (Control) {
        var _a;
        var isSFC = !(Control.prototype instanceof React__default["default"].Component);
        // 兼容老的 FormItem 用法。
        if (config.validate && !Control.prototype.validate) {
            var fn_1 = config.validate;
            Control.prototype.validate = function () {
                var host = {
                    input: this
                };
                return fn_1.apply(host, arguments);
            };
        }
        else if (config.validate) {
            console.error('FormItem配置中的 validate 将不起作用，因为类的成员函数中已经定义了 validate 方法，将优先使用类里面的实现。');
        }
        if (config.storeType) {
            Control = WithStore.HocStoreFactory({
                storeType: config.storeType,
                extendsData: config.extendsData
            })(mobxReact.observer(Control));
            delete config.storeType;
        }
        return wrapControl.wrapControl(hoistNonReactStatic__default["default"]((_a = /** @class */ (function (_super) {
                tslib.__extends(class_1, _super);
                function class_1(props) {
                    var _this = _super.call(this, props) || this;
                    _this.refFn = _this.refFn.bind(_this);
                    var validations = props.validations, model = props.formItem;
                    // 组件注册的时候可能默认指定验证器类型
                    if (model && !validations && config.validations) {
                        model.config({
                            rules: config.validations
                        });
                    }
                    return _this;
                }
                class_1.prototype.shouldComponentUpdate = function (nextProps) {
                    var _a;
                    if (((_a = config.shouldComponentUpdate) === null || _a === void 0 ? void 0 : _a.call(config, this.props, nextProps)) ||
                        nextProps.strictMode === false ||
                        config.strictMode === false) {
                        return true;
                    }
                    // 把可能会影响视图的白名单弄出来，减少重新渲染次数。
                    if (helper.anyChanged(detectProps.concat(config.detectProps || []), this.props, nextProps)) {
                        return true;
                    }
                    return false;
                };
                class_1.prototype.getWrappedInstance = function () {
                    return this.ref;
                };
                class_1.prototype.refFn = function (ref) {
                    this.ref = ref;
                };
                class_1.prototype.renderControl = function () {
                    var _a;
                    var _b = this.props, inputClassName = _b.inputClassName, model = _b.formItem, cx = _b.classnames; _b.children; var type = _b.type, size = _b.size, defaultSize = _b.defaultSize, useMobileUI = _b.useMobileUI, rest = tslib.__rest(_b, ["inputClassName", "formItem", "classnames", "children", "type", "size", "defaultSize", "useMobileUI"]);
                    var controlSize = size || defaultSize;
                    var mobileUI = useMobileUI && helper.isMobile();
                    //@ts-ignore
                    var isOpened = this.state.isOpened;
                    return (React__default["default"].createElement(React__default["default"].Fragment, null,
                        React__default["default"].createElement(Control, tslib.__assign({}, rest, { useMobileUI: useMobileUI, onOpenDialog: this.handleOpenDialog, size: config.sizeMutable !== false ? undefined : size, onFocus: this.handleFocus, onBlur: this.handleBlur, type: type, classnames: cx, ref: isSFC ? undefined : this.refFn, forwardedRef: isSFC ? this.refFn : undefined, formItem: model, className: cx("Form-control", (_a = {
                                    'is-inline': !!rest.inline && !mobileUI,
                                    'is-error': model && !model.valid
                                },
                                _a["Form-control--withSize Form-control--size".concat(helper.ucFirst(controlSize))] = config.sizeMutable !== false &&
                                    typeof controlSize === 'string' &&
                                    !!controlSize &&
                                    controlSize !== 'full',
                                _a), model === null || model === void 0 ? void 0 : model.errClassNames, inputClassName) })),
                        isOpened ? this.buildSchema() : null));
                };
                return class_1;
            }(FormItemWrap)),
            _a.defaultProps = tslib.__assign({ className: '', renderLabel: config.renderLabel, renderDescription: config.renderDescription, sizeMutable: config.sizeMutable, wrap: config.wrap, showErrorMsg: config.showErrorMsg }, Control.defaultProps),
            _a.propsList = tslib.__spreadArray([
                'value',
                'defaultValue',
                'onChange',
                'setPrinstineValue',
                'readOnly',
                'strictMode'
            ], (Control.propsList || []), true),
            _a.displayName = "FormItem".concat(config.type ? "(".concat(config.type, ")") : ''),
            _a.ComposedComponent = Control,
            _a), Control));
    };
}
function registerFormItem(config) {
    var Control = asFormItem(config)(config.component);
    return factory.registerRenderer(tslib.__assign(tslib.__assign({}, config), { weight: typeof config.weight !== 'undefined' ? config.weight : -100, component: Control, isFormItem: true }));
}
function FormItem(config) {
    return function (component) {
        var renderer = registerFormItem(tslib.__assign(tslib.__assign({}, config), { component: component }));
        return renderer.component;
    };
}

exports.FormItem = FormItem;
exports.FormItemWrap = FormItemWrap;
exports.asFormItem = asFormItem;
exports["default"] = FormItem;
exports.detectProps = detectProps;
exports.registerFormItem = registerFormItem;
