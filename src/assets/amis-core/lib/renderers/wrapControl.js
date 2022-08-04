/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var debouce = require('lodash/debounce');
var isEqual = require('lodash/isEqual');
var combo = require('../store/combo.js');
var helper = require('../utils/helper.js');
var formula = require('../utils/formula.js');
var Scoped = require('../Scoped.js');
var formItem = require('../store/formItem.js');
var mobxStateTree = require('mobx-state-tree');
var mobxReact = require('mobx-react');
var hoistNonReactStatic = require('hoist-non-react-statics');
var WithRootStore = require('../WithRootStore.js');
var table = require('../store/table.js');
var getVariable = require('../utils/getVariable.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var debouce__default = /*#__PURE__*/_interopDefaultLegacy(debouce);
var isEqual__default = /*#__PURE__*/_interopDefaultLegacy(isEqual);
var hoistNonReactStatic__default = /*#__PURE__*/_interopDefaultLegacy(hoistNonReactStatic);

function wrapControl(ComposedComponent) {
    var _a;
    var result = hoistNonReactStatic__default["default"](WithRootStore.withRootStore(mobxReact.observer((_a = /** @class */ (function (_super) {
            tslib.__extends(class_1, _super);
            function class_1(props) {
                var _this = this;
                var _a, _b;
                _this = _super.call(this, props) || this;
                _this.value = undefined;
                _this.lazyEmitChange = debouce__default["default"](_this.emitChange.bind(_this), 250, {
                    trailing: true,
                    leading: false
                });
                var _c = _this.props, form = _c.formStore, formItem$1 = _c.formItem, rootStore = _c.rootStore, store = _c.store, onChange = _c.onChange, data = _c.data, _d = _c.$schema, name = _d.name, id = _d.id, type = _d.type, required = _d.required, validations = _d.validations, validationErrors = _d.validationErrors, unique = _d.unique, value = _d.value, multiple = _d.multiple, delimiter = _d.delimiter, valueField = _d.valueField, labelField = _d.labelField, joinValues = _d.joinValues, extractValue = _d.extractValue, selectFirst = _d.selectFirst, autoFill = _d.autoFill, clearValueOnHidden = _d.clearValueOnHidden, validateApi = _d.validateApi, minLength = _d.minLength, maxLength = _d.maxLength, validateOnChange = _d.validateOnChange, label = _d.label;
                _this.getValue = _this.getValue.bind(_this);
                _this.setValue = _this.setValue.bind(_this);
                _this.handleChange = _this.handleChange.bind(_this);
                _this.setPrinstineValue = _this.setPrinstineValue.bind(_this);
                _this.controlRef = _this.controlRef.bind(_this);
                _this.handleBlur = _this.handleBlur.bind(_this);
                if (!name) {
                    return _this;
                }
                var propValue = _this.props.value;
                var model = rootStore.addStore({
                    id: helper.guid(),
                    path: _this.props.$path,
                    storeType: formItem.FormItemStore.name,
                    parentId: store === null || store === void 0 ? void 0 : store.id,
                    name: name
                });
                _this.model = model;
                // @issue 打算干掉这个
                formItem$1 === null || formItem$1 === void 0 ? void 0 : formItem$1.addSubFormItem(model);
                model.config({
                    id: id,
                    type: type,
                    required: required,
                    unique: unique,
                    value: value,
                    rules: validations,
                    messages: validationErrors,
                    multiple: multiple,
                    delimiter: delimiter,
                    valueField: valueField,
                    labelField: labelField,
                    joinValues: joinValues,
                    extractValue: extractValue,
                    selectFirst: selectFirst,
                    autoFill: autoFill,
                    clearValueOnHidden: clearValueOnHidden,
                    validateApi: validateApi,
                    minLength: minLength,
                    maxLength: maxLength,
                    validateOnChange: validateOnChange,
                    label: label
                });
                // issue 这个逻辑应该在 combo 里面自己实现。
                if (_this.model.unique &&
                    ((_a = form === null || form === void 0 ? void 0 : form.parentStore) === null || _a === void 0 ? void 0 : _a.storeType) === combo.ComboStore.name) {
                    var combo$1 = form.parentStore;
                    combo$1.bindUniuqueItem(model);
                }
                if (propValue !== undefined && propValue !== null) {
                    // 同步 value: 优先使用 props 中的 value
                    model.changeTmpValue(propValue);
                }
                else {
                    // 备注: 此处的 value 是 schema 中的 value（和props.defaultValue相同）
                    var curTmpValue = formula.isExpression(value)
                        ? formula.FormulaExec['formula'](value, data) // 对组件默认值进行运算
                        : (_b = store === null || store === void 0 ? void 0 : store.getValueByName(model.name)) !== null && _b !== void 0 ? _b : formula.replaceExpression(value); // 优先使用公式表达式
                    // 同步 value
                    model.changeTmpValue(curTmpValue);
                    if (onChange &&
                        value !== undefined &&
                        curTmpValue !== undefined) {
                        // 组件默认值支持表达式需要: 避免初始化时上下文中丢失组件默认值
                        onChange(model.tmpValue, model.name, false, true);
                    }
                }
                if (onChange &&
                    typeof propValue === 'undefined' &&
                    typeof (store === null || store === void 0 ? void 0 : store.getValueByName(model.name, false)) === 'undefined' &&
                    // todo 后续再优化这个判断，
                    // 目前 input-table 中默认值会给冲掉，所以加上这个判断
                    // 对应 issue 为 https://github.com/baidu/amis/issues/2674
                    (store === null || store === void 0 ? void 0 : store.storeType) !== table.TableStore.name) {
                    // 如果没有初始值，通过 onChange 设置过去
                    onChange(model.tmpValue, model.name, false, true);
                }
                return _this;
            }
            class_1.prototype.componentDidMount = function () {
                var _this = this;
                var _a = this.props; _a.store; _a.formStore; var _b = _a.$schema, name = _b.name, validate = _b.validate, addHook = _a.addHook;
                // 提交前先把之前的 lazyEmit 执行一下。
                this.hook3 = function () {
                    _this.lazyEmitChange.flush();
                };
                addHook === null || addHook === void 0 ? void 0 : addHook(this.hook3, 'flush');
                var formItem = this.model;
                if (formItem && validate) {
                    var finalValidate_1 = helper.promisify(validate.bind(formItem));
                    this.hook2 = function () {
                        formItem.clearError('control:valdiate');
                        return finalValidate_1(_this.props.data, _this.getValue(), name).then(function (ret) {
                            if ((typeof ret === 'string' || Array.isArray(ret)) && ret) {
                                formItem.addError(ret, 'control:valdiate');
                            }
                        });
                    };
                    addHook === null || addHook === void 0 ? void 0 : addHook(this.hook2);
                }
            };
            class_1.prototype.componentDidUpdate = function (prevProps) {
                var props = this.props;
                props.formStore;
                var model = this.model;
                if (model &&
                    helper.anyChanged([
                        'id',
                        'validations',
                        'validationErrors',
                        'value',
                        'defaultValue',
                        'required',
                        'unique',
                        'multiple',
                        'delimiter',
                        'valueField',
                        'labelField',
                        'joinValues',
                        'extractValue',
                        'selectFirst',
                        'autoFill',
                        'clearValueOnHidden',
                        'validateApi',
                        'minLength',
                        'maxLength',
                        'label'
                    ], prevProps.$schema, props.$schema)) {
                    model.config({
                        required: props.$schema.required,
                        id: props.$schema.id,
                        unique: props.$schema.unique,
                        value: props.$schema.value,
                        rules: props.$schema.validations,
                        multiple: props.$schema.multiple,
                        delimiter: props.$schema.delimiter,
                        valueField: props.$schema.valueField,
                        labelField: props.$schema.labelField,
                        joinValues: props.$schema.joinValues,
                        extractValue: props.$schema.extractValue,
                        messages: props.$schema.validationErrors,
                        selectFirst: props.$schema.selectFirst,
                        autoFill: props.$schema.autoFill,
                        clearValueOnHidden: props.$schema.clearValueOnHidden,
                        validateApi: props.$schema.validateApi,
                        minLength: props.$schema.minLength,
                        maxLength: props.$schema.maxLength,
                        label: props.$schema.label
                    });
                }
                // 此处需要同时考虑 defaultValue 和 value
                if (model && typeof props.value !== 'undefined') {
                    // 渲染器中的 value 优先
                    if (!isEqual__default["default"](props.value, prevProps.value) &&
                        !isEqual__default["default"](props.value, model.tmpValue)) {
                        // 外部直接传入的 value 无需执行运算器
                        model.changeTmpValue(props.value);
                    }
                }
                else if (model &&
                    typeof props.defaultValue !== 'undefined' &&
                    formula.isExpression(props.defaultValue)) {
                    // 渲染器中的 defaultValue 优先（备注: SchemaRenderer中会将 value 改成 defaultValue）
                    if (!isEqual__default["default"](props.defaultValue, prevProps.defaultValue) ||
                        (!isEqual__default["default"](props.data, prevProps.data) &&
                            formula.isNeedFormula(props.defaultValue, props.data, prevProps.data))) {
                        var curResult = formula.FormulaExec['formula'](props.defaultValue, props.data);
                        var prevResult = formula.FormulaExec['formula'](prevProps.defaultValue, prevProps.data);
                        if (!isEqual__default["default"](curResult, prevResult) &&
                            !isEqual__default["default"](curResult, model.tmpValue)) {
                            // 识别上下文变动、自身数值变动、公式运算结果变动
                            model.changeTmpValue(curResult);
                            if (props.onChange) {
                                props.onChange(curResult, model.name, false);
                            }
                        }
                    }
                }
                else if (model) {
                    var valueByName = getVariable.getVariable(props.data, model.name);
                    if (isEqual__default["default"](props.defaultValue, prevProps.defaultValue)) {
                        // value 非公式表达式时，name 值优先，若 defaultValue 主动变动时，则使用 defaultValue
                        if (
                        // 然后才是查看关联的 name 属性值是否变化
                        !isEqual__default["default"](props.data, prevProps.data) &&
                            (!model.emitedValue ||
                                isEqual__default["default"](model.emitedValue, model.tmpValue))) {
                            model.changeEmitedValue(undefined);
                            var prevValueByName = getVariable.getVariable(props.data, model.name);
                            if ((!isEqual__default["default"](valueByName, prevValueByName) ||
                                getVariable.getVariable(props.data, model.name, false) !==
                                    getVariable.getVariable(prevProps.data, model.name, false)) &&
                                !isEqual__default["default"](valueByName, model.tmpValue)) {
                                model.changeTmpValue(valueByName);
                            }
                        }
                    }
                    else if (typeof props.defaultValue !== 'undefined' &&
                        !isEqual__default["default"](props.defaultValue, prevProps.defaultValue) &&
                        !isEqual__default["default"](props.defaultValue, model.tmpValue)) {
                        // 组件默认值非公式
                        var curValue = formula.replaceExpression(props.defaultValue);
                        model.changeTmpValue(curValue);
                        if (props.onChange) {
                            props.onChange(curValue, model.name, false);
                        }
                    }
                }
            };
            class_1.prototype.componentWillUnmount = function () {
                var _a, _b, _c, _d, _e, _f, _g;
                this.hook && ((_b = (_a = this.props).removeHook) === null || _b === void 0 ? void 0 : _b.call(_a, this.hook));
                this.hook2 && ((_d = (_c = this.props).removeHook) === null || _d === void 0 ? void 0 : _d.call(_c, this.hook2));
                this.hook3 && ((_f = (_e = this.props).removeHook) === null || _f === void 0 ? void 0 : _f.call(_e, this.hook3, 'flush'));
                // this.lazyEmitChange.flush();
                this.lazyEmitChange.cancel();
                (_g = this.reaction) === null || _g === void 0 ? void 0 : _g.call(this);
                this.disposeModel();
            };
            class_1.prototype.disposeModel = function () {
                var _a;
                var _b = this.props, form = _b.formStore, formItem = _b.formItem, rootStore = _b.rootStore;
                if (this.model &&
                    this.model.unique &&
                    (form === null || form === void 0 ? void 0 : form.parentStore) &&
                    (form === null || form === void 0 ? void 0 : form.parentStore.storeType) === combo.ComboStore.name) {
                    var combo$1 = form.parentStore;
                    combo$1.unBindUniuqueItem(this.model);
                }
                if (this.model) {
                    formItem &&
                        mobxStateTree.isAlive(formItem) &&
                        formItem.removeSubFormItem(this.model);
                    this.model.clearValueOnHidden &&
                        ((_a = this.model.form) === null || _a === void 0 ? void 0 : _a.deleteValueByName(this.model.name));
                    mobxStateTree.isAlive(rootStore) && rootStore.removeStore(this.model);
                }
                delete this.model;
            };
            class_1.prototype.controlRef = function (control) {
                var _this = this;
                var _a = this.props, addHook = _a.addHook, removeHook = _a.removeHook; _a.formStore; var name = _a.$schema.name;
                // 因为 control 有可能被 n 层 hoc 包裹。
                while (control && control.getWrappedInstance) {
                    control = control.getWrappedInstance();
                }
                if (control && control.validate && this.model) {
                    var formItem_1 = this.model;
                    var validate_1 = helper.promisify(control.validate.bind(control));
                    this.hook = function () {
                        formItem_1.clearError('component:valdiate');
                        return validate_1(_this.props.data, _this.getValue(), name).then(function (ret) {
                            if ((typeof ret === 'string' || Array.isArray(ret)) &&
                                ret) {
                                formItem_1.setError(ret, 'component:valdiate');
                            }
                        });
                    };
                    addHook === null || addHook === void 0 ? void 0 : addHook(this.hook);
                }
                else if (!control && this.hook) {
                    removeHook === null || removeHook === void 0 ? void 0 : removeHook(this.hook);
                    this.hook = undefined;
                }
                // 注册到 Scoped 上
                var originRef = this.control;
                this.control = control;
                var scoped = this.context;
                if (control) {
                    scoped.registerComponent(this.control);
                }
                else if (originRef) {
                    scoped.unRegisterComponent(originRef);
                }
            };
            class_1.prototype.validate = function () {
                return tslib.__awaiter(this, void 0, void 0, function () {
                    var _a, form, data, formItemDispatchEvent, result, combo$1, group, validPromises, validPromises;
                    return tslib.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = this.props, form = _a.formStore, data = _a.data, formItemDispatchEvent = _a.formItemDispatchEvent;
                                if (!this.model) return [3 /*break*/, 4];
                                if (!(this.model.unique &&
                                    (form === null || form === void 0 ? void 0 : form.parentStore) &&
                                    form.parentStore.storeType === combo.ComboStore.name)) return [3 /*break*/, 2];
                                combo$1 = form.parentStore;
                                group = combo$1.uniques.get(this.model.name);
                                validPromises = group.items.map(function (item) {
                                    return item.validate(data);
                                });
                                return [4 /*yield*/, Promise.all(validPromises)];
                            case 1:
                                result = _b.sent();
                                return [3 /*break*/, 4];
                            case 2:
                                validPromises = form === null || form === void 0 ? void 0 : form.getItemsByName(this.model.name).map(function (item) { return item.validate(data); });
                                if (!(validPromises && validPromises.length)) return [3 /*break*/, 4];
                                return [4 /*yield*/, Promise.all(validPromises)];
                            case 3:
                                result = _b.sent();
                                _b.label = 4;
                            case 4:
                                if (result && result.length) {
                                    if (result.indexOf(false) > -1) {
                                        formItemDispatchEvent('formItemValidateError', data);
                                    }
                                    else {
                                        formItemDispatchEvent('formItemValidateSucc', data);
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            };
            class_1.prototype.handleChange = function (value, submitOnChange, changeImmediately) {
                if (submitOnChange === void 0) { submitOnChange = this.props.$schema.submitOnChange; }
                if (changeImmediately === void 0) { changeImmediately = false; }
                var _a = this.props; _a.formStore; var onChange = _a.onChange, _b = _a.$schema, type = _b.type, pipeOut = _b.pipeOut, conrolChangeImmediately = _b.changeImmediately, formInited = _a.formInited, data = _a.data;
                if (!this.model ||
                    // todo 以后想办法不要強耦合类型。
                    ~[
                        'service',
                        'group',
                        'hbox',
                        'panel',
                        'grid',
                        'input-group'
                    ].indexOf(type)) {
                    onChange && onChange.apply(null, arguments);
                    return;
                }
                if (pipeOut) {
                    var oldValue = this.model.value;
                    value = pipeOut(value, oldValue, data);
                }
                this.model.changeTmpValue(value);
                if (changeImmediately || conrolChangeImmediately || !formInited) {
                    this.emitChange(submitOnChange);
                }
                else {
                    // this.props.onTmpValueChange?.(value, this.model.name);
                    this.lazyEmitChange(submitOnChange);
                }
            };
            class_1.prototype.emitChange = function (submitOnChange) {
                var _a;
                if (submitOnChange === void 0) { submitOnChange = this.props.$schema.submitOnChange; }
                var _b = this.props, form = _b.formStore, onChange = _b.onChange, _c = _b.$schema, name = _c.name, id = _c.id, label = _c.label, type = _c.type, onFormItemChange = _c.onChange; _c.maxLength; _c.minLength; var data = _b.data, env = _b.env, validateOnChange = _b.validateOnChange, formSubmited = _b.formSubmited;
                if (!this.model) {
                    return;
                }
                var value = this.model.tmpValue;
                var oldValue = getVariable.getVariable(data, this.model.name, false);
                if (oldValue === value) {
                    return;
                }
                if (type !== 'input-password') {
                    env === null || env === void 0 ? void 0 : env.tracker({
                        eventType: 'formItemChange',
                        eventData: {
                            id: id,
                            name: name,
                            label: label,
                            type: type,
                            value: value
                        }
                    }, this.props);
                }
                this.model.changeEmitedValue(value);
                if ((onFormItemChange === null || onFormItemChange === void 0 ? void 0 : onFormItemChange(value, oldValue, this.model, form)) === false) {
                    return;
                }
                var validated = this.model.validated;
                onChange === null || onChange === void 0 ? void 0 : onChange(value, name, submitOnChange === true);
                if (
                // 如果配置了 minLength 或者 maxLength 就切成及时验证
                // this.model.rules.minLength ||
                // this.model.rules.maxLength ||
                validateOnChange === true ||
                    (validateOnChange !== false && (formSubmited || validated))) {
                    this.validate();
                }
                else if (validateOnChange === false) {
                    (_a = this.model) === null || _a === void 0 ? void 0 : _a.reset();
                }
            };
            class_1.prototype.handleBlur = function (e) {
                var _a = this.props, onBlur = _a.onBlur, validateOnBlur = _a.$schema.validateOnBlur;
                if (validateOnBlur && this.model) {
                    this.validate();
                }
                onBlur && onBlur(e);
            };
            class_1.prototype.setPrinstineValue = function (value) {
                if (!this.model) {
                    return;
                }
                var _a = this.props; _a.formStore; var name = _a.name, pipeOut = _a.$schema.pipeOut, onChange = _a.onChange, oldValue = _a.value, data = _a.data;
                if (pipeOut) {
                    value = pipeOut(value, oldValue, data);
                }
                onChange === null || onChange === void 0 ? void 0 : onChange(value, name, false, true);
            };
            class_1.prototype.getValue = function () {
                var _a = this.props, data = _a.formStore, control = _a.$schema;
                var value = this.model ? this.model.tmpValue : control.value;
                if (control.pipeIn) {
                    value = control.pipeIn(value, data);
                }
                return value;
            };
            // 兼容老版本用法，新版本直接用 onChange 就可以。
            class_1.prototype.setValue = function (value, key) {
                var _a;
                var _b = this.props, name = _b.$schema.name, onBulkChange = _b.onBulkChange;
                if (!key || key === name) {
                    this.handleChange(value);
                }
                else {
                    onBulkChange &&
                        onBulkChange((_a = {},
                            _a[key] = value,
                            _a));
                }
            };
            class_1.prototype.render = function () {
                var _a = this.props, controlWidth = _a.controlWidth, disabled = _a.disabled, formMode = _a.formMode, control = _a.$schema, store = _a.store, data = _a.data, invisible = _a.invisible;
                if (invisible) {
                    return null;
                }
                var value = this.getValue();
                var model = this.model;
                var injectedProps = {
                    defaultSize: controlWidth,
                    disabled: disabled !== null && disabled !== void 0 ? disabled : control.disabled,
                    formItem: this.model,
                    formMode: control.mode || formMode,
                    ref: this.controlRef,
                    data: data || (store === null || store === void 0 ? void 0 : store.data),
                    value: value,
                    defaultValue: control.value,
                    formItemValue: value,
                    onChange: this.handleChange,
                    onBlur: this.handleBlur,
                    setValue: this.setValue,
                    getValue: this.getValue,
                    prinstine: model ? model.prinstine : undefined,
                    setPrinstineValue: this.setPrinstineValue
                };
                return (React__default["default"].createElement(ComposedComponent, tslib.__assign({}, this.props, injectedProps)));
            };
            return class_1;
        }(React__default["default"].Component)),
        _a.contextType = Scoped.ScopedContext,
        _a.defaultProps = {},
        _a))), ComposedComponent);
    return result;
}

exports.wrapControl = wrapControl;
