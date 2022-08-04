/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __extends, __assign, __awaiter, __generator, __rest, __decorate, __metadata } from 'tslib';
import difference from 'lodash/difference';
import omit from 'lodash/omit';
import React from 'react';
import LazyComponent from './components/LazyComponent.js';
import { resolveRenderer, loadRenderer, filterSchema } from './factory.js';
import { asFormItem } from './renderers/Item.js';
import { ScopedContext } from './Scoped.js';
import { DebugWrapper } from './utils/debug.js';
import { getExprProperties } from './utils/filter-schema.js';
import { anyChanged, chainEvents, autobind } from './utils/helper.js';
import { SimpleMap } from './utils/SimpleMap.js';
import { bindEvent, dispatchEvent } from './utils/renderer-event.js';
import { isAlive } from 'mobx-state-tree';
import { reaction } from 'mobx';
import 'amis-formula';
import 'moment';
import 'lodash/isPlainObject';
import { resolveVariableAndFilter } from './utils/resolveVariableAndFilter.js';
import './utils/filter.js';

var defaultOmitList = [
    'type',
    'name',
    '$ref',
    'className',
    'data',
    'children',
    'ref',
    'visible',
    'visibleOn',
    'hidden',
    'hiddenOn',
    'disabled',
    'disabledOn',
    'component',
    'detectField',
    'defaultValue',
    'defaultData',
    'required',
    'requiredOn',
    'syncSuperStore',
    'mode',
    'body'
];
var componentCache = new SimpleMap();
var SchemaRenderer = /** @class */ (function (_super) {
    __extends(SchemaRenderer, _super);
    function SchemaRenderer(props) {
        var _this = _super.call(this, props) || this;
        _this.rendererKey = '';
        _this.unbindEvent = undefined;
        _this.refFn = _this.refFn.bind(_this);
        _this.renderChild = _this.renderChild.bind(_this);
        _this.reRender = _this.reRender.bind(_this);
        _this.resolveRenderer(_this.props);
        _this.dispatchEvent = _this.dispatchEvent.bind(_this);
        // 监听topStore更新
        _this.reaction = reaction(function () {
            return "".concat(props.topStore.visibleState[props.schema.id || props.$path]).concat(props.topStore.disableState[props.schema.id || props.$path]);
        }, function () { return _this.forceUpdate(); });
        return _this;
    }
    SchemaRenderer.prototype.componentDidMount = function () {
        // 这里无法区分监听的是不是广播，所以又bind一下，主要是为了绑广播
        this.unbindEvent = bindEvent(this.cRef);
    };
    SchemaRenderer.prototype.componentWillUnmount = function () {
        var _a, _b;
        (_a = this.reaction) === null || _a === void 0 ? void 0 : _a.call(this);
        (_b = this.unbindEvent) === null || _b === void 0 ? void 0 : _b.call(this);
    };
    // 限制：只有 schema 除外的 props 变化，或者 schema 里面的某个成员值发生变化才更新。
    SchemaRenderer.prototype.shouldComponentUpdate = function (nextProps) {
        var props = this.props;
        var list = difference(Object.keys(nextProps), [
            'schema',
            'scope'
        ]);
        if (difference(Object.keys(props), ['schema', 'scope']).length !==
            list.length ||
            anyChanged(list, this.props, nextProps)) {
            return true;
        }
        else {
            var list_1 = Object.keys(nextProps.schema);
            if (Object.keys(props.schema).length !== list_1.length ||
                anyChanged(list_1, props.schema, nextProps.schema)) {
                return true;
            }
        }
        return false;
    };
    SchemaRenderer.prototype.resolveRenderer = function (props, force) {
        if (force === void 0) { force = false; }
        var schema = props.schema;
        var path = props.$path;
        if (schema && schema.$ref) {
            schema = __assign(__assign({}, props.resolveDefinitions(schema.$ref)), schema);
            path = path.replace(/(?!.*\/).*/, schema.type);
        }
        if ((schema === null || schema === void 0 ? void 0 : schema.type) &&
            (force ||
                !this.renderer ||
                this.rendererKey !== "".concat(schema.type, "-").concat(schema.$$id))) {
            var rendererResolver = props.env.rendererResolver || resolveRenderer;
            this.renderer = rendererResolver(path, schema, props);
            this.rendererKey = "".concat(schema.type, "-").concat(schema.$$id);
        }
        else {
            // 自定义组件如果在节点设置了 label name 什么的，就用 formItem 包一层
            // 至少自动支持了 valdiations, label, description 等逻辑。
            if (schema.children && !schema.component && schema.asFormItem) {
                schema.component = PlaceholderComponent;
                schema.renderChildren = schema.children;
                delete schema.children;
            }
            if (schema.component &&
                !schema.component.wrapedAsFormItem &&
                schema.asFormItem) {
                var cache = componentCache.get(schema.component);
                if (cache) {
                    schema.component = cache;
                }
                else {
                    var cache_1 = asFormItem(__assign({ strictMode: false }, schema.asFormItem))(schema.component);
                    componentCache.set(schema.component, cache_1);
                    cache_1.wrapedAsFormItem = true;
                    schema.component = cache_1;
                }
            }
        }
        return { path: path, schema: schema };
    };
    SchemaRenderer.prototype.getWrappedInstance = function () {
        return this.cRef;
    };
    SchemaRenderer.prototype.refFn = function (ref) {
        this.ref = ref;
    };
    SchemaRenderer.prototype.childRef = function (ref) {
        while (ref && ref.getWrappedInstance) {
            ref = ref.getWrappedInstance();
        }
        this.cRef = ref;
    };
    SchemaRenderer.prototype.dispatchEvent = function (e, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dispatchEvent(e, this.cRef, this.context, data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SchemaRenderer.prototype.renderChild = function (region, node, subProps) {
        if (subProps === void 0) { subProps = {}; }
        var _a = this.props; _a.schema; _a.$path; var env = _a.env, render = _a.render, rest = __rest(_a, ["schema", "$path", "env", "render"]);
        var $path = this.resolveRenderer(this.props).path;
        var omitList = defaultOmitList.concat();
        if (this.renderer) {
            var Component = this.renderer.component;
            Component.propsList &&
                omitList.push.apply(omitList, Component.propsList);
        }
        return render("".concat($path).concat(region ? "/".concat(region) : ''), node || '', __assign(__assign(__assign({}, omit(rest, omitList)), subProps), { data: subProps.data || rest.data, env: env }));
    };
    SchemaRenderer.prototype.reRender = function () {
        this.resolveRenderer(this.props, true);
        this.forceUpdate();
    };
    SchemaRenderer.prototype.render = function () {
        var _this = this;
        var _a, _b, _c;
        var _d = this.props; _d.$path; var __ = _d.schema, rootStore = _d.rootStore, topStore = _d.topStore, render = _d.render, rest = __rest(_d, ["$path", "schema", "rootStore", "topStore", "render"]);
        if (__ == null) {
            return null;
        }
        var _e = this.resolveRenderer(this.props), $path = _e.path, schema = _e.schema;
        var theme = this.props.env.theme;
        if (Array.isArray(schema)) {
            return render($path, schema, rest);
        }
        var detectData = schema &&
            (schema.detectField === '&' ? rest : rest[schema.detectField || 'data']);
        var exprProps = detectData
            ? getExprProperties(schema, detectData, undefined, rest)
            : {};
        // 控制显隐
        var visible = isAlive(topStore)
            ? topStore.visibleState[schema.id || $path]
            : undefined;
        var disable = isAlive(topStore)
            ? topStore.disableState[schema.id || $path]
            : undefined;
        if (visible === false ||
            (visible !== true &&
                exprProps &&
                (exprProps.hidden ||
                    exprProps.visible === false ||
                    schema.hidden ||
                    schema.visible === false ||
                    rest.hidden ||
                    rest.visible === false))) {
            rest.invisible = true;
        }
        if (schema.children) {
            return rest.invisible
                ? null
                : React.isValidElement(schema.children)
                    ? schema.children
                    : schema.children(__assign(__assign(__assign({}, rest), exprProps), { $path: $path, $schema: schema, render: this.renderChild, forwardedRef: this.refFn, rootStore: rootStore, topStore: topStore, dispatchEvent: this.dispatchEvent }));
        }
        else if (typeof schema.component === 'function') {
            var isSFC = !(schema.component.prototype instanceof React.Component);
            var defaultData_1 = schema.data, defaultValue_1 = schema.value, // render时的value改放defaultValue中
            defaultActiveKey_1 = schema.activeKey, propKey_1 = schema.key, restSchema_1 = __rest(schema, ["data", "value", "activeKey", "key"]);
            return rest.invisible
                ? null
                : React.createElement(schema.component, __assign(__assign(__assign(__assign({}, rest), restSchema_1), exprProps), { 
                    // value: defaultValue, // 备注: 此处并没有将value传递给渲染器
                    defaultData: defaultData_1, defaultValue: defaultValue_1, defaultActiveKey: defaultActiveKey_1, propKey: propKey_1, $path: $path, $schema: schema, ref: isSFC ? undefined : this.refFn, forwardedRef: isSFC ? this.refFn : undefined, render: this.renderChild, rootStore: rootStore, topStore: topStore, dispatchEvent: this.dispatchEvent }));
        }
        else if (Object.keys(schema).length === 0) {
            return null;
        }
        else if (!this.renderer) {
            return rest.invisible ? null : (React.createElement(LazyComponent, __assign({}, rest, exprProps, { getComponent: function () { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, rest.env.loadRenderer(schema, $path, this.reRender)];
                            case 1:
                                result = _a.sent();
                                if (result && typeof result === 'function') {
                                    return [2 /*return*/, result];
                                }
                                else if (result && React.isValidElement(result)) {
                                    return [2 /*return*/, function () { return result; }];
                                }
                                this.reRender();
                                return [2 /*return*/, function () { return loadRenderer(schema, $path); }];
                        }
                    });
                }); }, "$path": $path, "$schema": schema, retry: this.reRender, rootStore: rootStore, topStore: topStore, dispatchEvent: this.dispatchEvent })));
        }
        var renderer = this.renderer;
        schema = filterSchema(schema, renderer, rest);
        var defaultData = schema.data, defaultValue = schema.value, propKey = schema.key, defaultActiveKey = schema.activeKey, restSchema = __rest(schema, ["data", "value", "key", "activeKey"]);
        var Component = renderer.component;
        // 原来表单项的 visible: false 和 hidden: true 表单项的值和验证是有效的
        // 而 visibleOn 和 hiddenOn 是无效的，
        // 这个本来就是个bug，但是已经被广泛使用了
        // 我只能继续实现这个bug了
        if (rest.invisible &&
            (exprProps.hidden ||
                exprProps.visible === false ||
                !renderer.isFormItem ||
                (schema.visible !== false && !schema.hidden))) {
            return null;
        }
        var isClassComponent = (_a = Component.prototype) === null || _a === void 0 ? void 0 : _a.isReactComponent;
        var $schema = __assign(__assign({}, schema), exprProps);
        var props = __assign(__assign(__assign(__assign(__assign({}, theme.getRendererConfig(renderer.name)), restSchema), chainEvents(rest, restSchema)), exprProps), { 
            // value: defaultValue, // 备注: 此处并没有将value传递给渲染器
            defaultData: (_b = restSchema.defaultData) !== null && _b !== void 0 ? _b : defaultData, defaultValue: (_c = restSchema.defaultValue) !== null && _c !== void 0 ? _c : defaultValue, defaultActiveKey: defaultActiveKey, propKey: propKey, $path: $path, $schema: $schema, ref: this.refFn, render: this.renderChild, rootStore: rootStore, topStore: topStore, dispatchEvent: this.dispatchEvent });
        if (disable !== undefined) {
            props.disabled = disable;
        }
        // 自动解析变量模式，主要是方便直接引入第三方组件库，无需为了支持变量封装一层
        if (renderer.autoVar) {
            for (var _i = 0, _f = Object.keys($schema); _i < _f.length; _i++) {
                var key = _f[_i];
                if (typeof props[key] === 'string') {
                    props[key] = resolveVariableAndFilter(props[key], props.data, '| raw');
                }
            }
        }
        var component = isClassComponent ? (React.createElement(Component, __assign({}, props, { ref: this.childRef }))) : (React.createElement(Component, __assign({}, props)));
        return this.props.env.enableAMISDebug ? (React.createElement(DebugWrapper, { renderer: renderer }, component)) : (component);
    };
    SchemaRenderer.displayName = 'Renderer';
    SchemaRenderer.contextType = ScopedContext;
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], SchemaRenderer.prototype, "childRef", null);
    return SchemaRenderer;
}(React.Component));
var PlaceholderComponent = /** @class */ (function (_super) {
    __extends(PlaceholderComponent, _super);
    function PlaceholderComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlaceholderComponent.prototype.render = function () {
        var _a = this.props, renderChildren = _a.renderChildren, rest = __rest(_a, ["renderChildren"]);
        if (typeof renderChildren === 'function') {
            return renderChildren(rest);
        }
        return null;
    };
    return PlaceholderComponent;
}(React.Component));

export { SchemaRenderer };
