/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var hoistNonReactStatic = require('hoist-non-react-statics');
var mobxReact = require('mobx-react');
var mobxStateTree = require('mobx-state-tree');
var React = require('react');
var filterSchema = require('./utils/filter-schema.js');
var helper = require('./utils/helper.js');
require('amis-formula');
require('moment');
var object = require('./utils/object.js');
var dataMapping = require('./utils/dataMapping.js');
require('./utils/filter.js');
var WithRootStore = require('./WithRootStore.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var hoistNonReactStatic__default = /*#__PURE__*/_interopDefaultLegacy(hoistNonReactStatic);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function HocStoreFactory(renderer) {
    return function (Component) {
        var StoreFactory = /** @class */ (function (_super) {
            tslib.__extends(StoreFactory, _super);
            function StoreFactory(props, context) {
                var _this = _super.call(this, props) || this;
                var rootStore = context;
                _this.renderChild = _this.renderChild.bind(_this);
                _this.refFn = _this.refFn.bind(_this);
                var store = rootStore.addStore({
                    id: helper.guid(),
                    path: _this.props.$path,
                    storeType: renderer.storeType,
                    parentId: _this.props.store ? _this.props.store.id : ''
                });
                _this.store = store;
                var extendsData = typeof renderer.extendsData === 'function'
                    ? renderer.extendsData(props)
                    : renderer.extendsData;
                if (extendsData === false) {
                    store.initData(object.createObject(_this.props.data
                        ? _this.props.data.__super
                        : null, tslib.__assign(tslib.__assign({}, _this.formatData(dataMapping.dataMapping(_this.props.defaultData, _this.props.data))), _this.formatData(_this.props.data))));
                }
                else if (_this.props.scope ||
                    (_this.props.data && _this.props.data.__super)) {
                    if (_this.props.store && _this.props.data === _this.props.store.data) {
                        store.initData(object.createObject(_this.props.store.data, tslib.__assign({}, _this.formatData(dataMapping.dataMapping(_this.props.defaultData, _this.props.data)))));
                    }
                    else {
                        store.initData(object.createObject(_this.props.data.__super || _this.props.scope, tslib.__assign(tslib.__assign({}, _this.formatData(dataMapping.dataMapping(_this.props.defaultData, _this.props.data))), _this.formatData(_this.props.data))));
                    }
                }
                else {
                    store.initData(tslib.__assign(tslib.__assign({}, _this.formatData(dataMapping.dataMapping(_this.props.defaultData, _this.props.data))), _this.formatData(_this.props.data)));
                }
                return _this;
            }
            StoreFactory.prototype.getWrappedInstance = function () {
                return this.ref;
            };
            StoreFactory.prototype.refFn = function (ref) {
                this.ref = ref;
            };
            StoreFactory.prototype.formatData = function (data) {
                if (Array.isArray(data)) {
                    return {
                        items: data
                    };
                }
                return data;
            };
            StoreFactory.prototype.componentDidUpdate = function (prevProps) {
                var _a, _b;
                var props = this.props;
                var store = this.store;
                var shouldSync = (_a = renderer.shouldSyncSuperStore) === null || _a === void 0 ? void 0 : _a.call(renderer, store, props, prevProps);
                if (shouldSync === false) {
                    return;
                }
                var extendsData = typeof renderer.extendsData === 'function'
                    ? renderer.extendsData(props)
                    : renderer.extendsData;
                if (extendsData === false) {
                    if (shouldSync === true ||
                        prevProps.defaultData !== props.defaultData ||
                        helper.isObjectShallowModified(prevProps.data, props.data) ||
                        //
                        // 特殊处理 CRUD。
                        // CRUD 中 toolbar 里面的 data 是空对象，但是 __super 会不一样
                        (props.data &&
                            prevProps.data &&
                            props.data.__super !== prevProps.data.__super)) {
                        store.initData(object.extendObject(props.data, tslib.__assign(tslib.__assign(tslib.__assign({}, (store.hasRemoteData ? store.data : null)), this.formatData(props.defaultData)), this.formatData(props.data))));
                    }
                }
                else if (shouldSync === true ||
                    helper.isObjectShallowModified(prevProps.data, props.data) ||
                    (props.syncSuperStore !== false &&
                        helper.isSuperDataModified(props.data, prevProps.data, store))) {
                    if (props.store && props.store.data === props.data) {
                        store.initData(object.createObject(props.store.data, props.syncSuperStore === false
                            ? tslib.__assign({}, store.data) : helper.syncDataFromSuper(store.data, props.store.data, prevProps.scope, store, props.syncSuperStore === true)));
                    }
                    else if (props.data && props.data.__super) {
                        store.initData(object.extendObject(props.data, store.hasRemoteData || store.path === 'page'
                            ? tslib.__assign(tslib.__assign({}, store.data), props.data) : undefined));
                    }
                    else {
                        store.initData(object.createObject(props.scope, props.data));
                    }
                }
                else if ((shouldSync === true ||
                    !props.store ||
                    props.data !== props.store.data) &&
                    props.data &&
                    props.data.__super) {
                    // 这个用法很少，当 data.__super 值发生变化时，更新 store.data
                    if (!prevProps.data ||
                        helper.isObjectShallowModified(props.data.__super, prevProps.data.__super, false)) {
                        store.initData(object.createObject(props.data.__super, tslib.__assign(tslib.__assign({}, props.data), store.data)), store.storeType === 'FormStore' &&
                            ((_b = prevProps.store) === null || _b === void 0 ? void 0 : _b.storeType) === 'CRUDStore');
                    }
                    // nextProps.data.__super !== props.data.__super) &&
                }
                else if (props.scope &&
                    props.data === props.store.data &&
                    (shouldSync === true || prevProps.data !== props.data)) {
                    // 只有父级数据变动的时候才应该进来，
                    // 目前看来这个 case 很少有情况下能进来
                    store.initData(object.createObject(props.scope, tslib.__assign({}, store.data)));
                }
            };
            StoreFactory.prototype.componentWillUnmount = function () {
                var rootStore = this.context;
                var store = this.store;
                mobxStateTree.isAlive(store) && rootStore.removeStore(store);
                // @ts-ignore
                delete this.store;
            };
            StoreFactory.prototype.renderChild = function (region, node, subProps) {
                if (subProps === void 0) { subProps = {}; }
                var render = this.props.render;
                return render(region, node, tslib.__assign(tslib.__assign({ data: this.store.data, dataUpdatedAt: this.store.updatedAt }, subProps), { scope: this.store.data, store: this.store }));
            };
            StoreFactory.prototype.render = function () {
                var _a = this.props, detectField = _a.detectField, rest = tslib.__rest(_a, ["detectField"]);
                var exprProps = {};
                if (!detectField || detectField === 'data') {
                    exprProps = filterSchema.getExprProperties(rest, this.store.data, undefined, rest);
                    if (exprProps.hidden || exprProps.visible === false) {
                        return null;
                    }
                }
                return (React__default["default"].createElement(Component, tslib.__assign({}, rest /* todo */, exprProps, { ref: this.refFn, data: this.store.data, dataUpdatedAt: this.store.updatedAt, store: this.store, scope: this.store.data, render: this.renderChild })));
            };
            StoreFactory.displayName = "WithStore(".concat(Component.displayName || Component.name, ")");
            StoreFactory.ComposedComponent = Component;
            StoreFactory.contextType = WithRootStore.RootStoreContext;
            StoreFactory = tslib.__decorate([
                mobxReact.observer,
                tslib.__metadata("design:paramtypes", [Object, void 0])
            ], StoreFactory);
            return StoreFactory;
        }(React__default["default"].Component));
        hoistNonReactStatic__default["default"](StoreFactory, Component);
        return StoreFactory;
    };
}

exports.HocStoreFactory = HocStoreFactory;
