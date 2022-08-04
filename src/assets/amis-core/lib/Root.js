/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var isPlainObject = require('lodash/isPlainObject');
var React = require('react');
var locale = require('./locale.js');
var RootRenderer = require('./RootRenderer.js');
var SchemaRenderer = require('./SchemaRenderer.js');
var Scoped = require('./Scoped.js');
var theme = require('./theme.js');
var helper = require('./utils/helper.js');
var WithRootStore = require('./WithRootStore.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var rootWrappers = [];
function addRootWrapper(fn) {
    rootWrappers.push(fn);
}
var Root = /** @class */ (function (_super) {
    tslib.__extends(Root, _super);
    function Root() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Root.prototype.resolveDefinitions = function (name) {
        var definitions = this.props.schema.definitions;
        if (!name || helper.isEmpty(definitions)) {
            return {};
        }
        return definitions && definitions[name];
    };
    Root.prototype.render = function () {
        var _a = this.props, schema = _a.schema, rootStore = _a.rootStore, env = _a.env, pathPrefix = _a.pathPrefix, location = _a.location, data = _a.data, locale$1 = _a.locale, translate = _a.translate, rest = tslib.__rest(_a, ["schema", "rootStore", "env", "pathPrefix", "location", "data", "locale", "translate"]);
        var theme$1 = env.theme;
        var themeName = this.props.theme || 'cxd';
        if (themeName === 'default') {
            themeName = 'cxd';
        }
        return (React__default["default"].createElement(WithRootStore.RootStoreContext.Provider, { value: rootStore },
            React__default["default"].createElement(theme.ThemeContext.Provider, { value: themeName },
                React__default["default"].createElement(locale.LocaleContext.Provider, { value: this.props.locale }, rootWrappers.reduce(function (props, wrapper) {
                    return tslib.__assign(tslib.__assign({}, props), { children: wrapper(props) });
                }, tslib.__assign(tslib.__assign({ pathPrefix: pathPrefix || '', schema: isPlainObject__default["default"](schema)
                        ? tslib.__assign({ type: 'page' }, schema) : schema }, rest), { render: renderChild, rootStore: rootStore, resolveDefinitions: this.resolveDefinitions, location: location, data: data, env: env, classnames: theme$1.classnames, classPrefix: theme$1.classPrefix, locale: locale$1, translate: translate, children: (React__default["default"].createElement(RootRenderer.RootRenderer, tslib.__assign({ pathPrefix: pathPrefix || '', schema: isPlainObject__default["default"](schema)
                            ? tslib.__assign({ type: 'page' }, schema) : schema }, rest, { render: renderChild, rootStore: rootStore, resolveDefinitions: this.resolveDefinitions, location: location, data: data, env: env, classnames: theme$1.classnames, classPrefix: theme$1.classPrefix, locale: locale$1, translate: translate }))) })).children))));
    };
    tslib.__decorate([
        helper.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [String]),
        tslib.__metadata("design:returntype", void 0)
    ], Root.prototype, "resolveDefinitions", null);
    return Root;
}(React__default["default"].Component));
function renderChildren(prefix, node, props) {
    if (Array.isArray(node)) {
        var elemKey = props.key || props.propKey || props.id || '';
        return node.map(function (node, index) {
            return renderChild("".concat(prefix, "/").concat(index), node, tslib.__assign(tslib.__assign({}, props), { key: "".concat(elemKey ? "".concat(elemKey, "-") : '').concat(index) }));
        });
    }
    return renderChild(prefix, node, props);
}
function renderChild(prefix, node, props) {
    if (Array.isArray(node)) {
        return renderChildren(prefix, node, props);
    }
    var typeofnode = typeof node;
    if (typeofnode === 'undefined' || node === null) {
        return null;
    }
    else if (React__default["default"].isValidElement(node)) {
        return node;
    }
    var schema = typeofnode === 'string' || typeofnode === 'number'
        ? { type: 'tpl', tpl: String(node) }
        : node;
    var transform = props.propsTransform;
    if (transform) {
        props = tslib.__assign({}, props);
        delete props.propsTransform;
        props = transform(props);
    }
    return (React__default["default"].createElement(SchemaRenderer.SchemaRenderer, tslib.__assign({ render: renderChild }, props, { schema: schema, propKey: schema.key, "$path": "".concat(prefix ? "".concat(prefix, "/") : '').concat((schema && schema.type) || '') })));
}
var ScopedRootRenderer = Scoped.HocScoped(Root);

exports.Root = Root;
exports.addRootWrapper = addRootWrapper;
exports["default"] = ScopedRootRenderer;
exports.renderChild = renderChild;
exports.renderChildren = renderChildren;
