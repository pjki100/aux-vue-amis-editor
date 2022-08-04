/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __extends, __rest, __assign, __decorate, __metadata } from 'tslib';
import isPlainObject from 'lodash/isPlainObject';
import React from 'react';
import { LocaleContext } from './locale.js';
import { RootRenderer } from './RootRenderer.js';
import { SchemaRenderer } from './SchemaRenderer.js';
import { HocScoped } from './Scoped.js';
import { ThemeContext } from './theme.js';
import { isEmpty, autobind } from './utils/helper.js';
import { RootStoreContext } from './WithRootStore.js';

var rootWrappers = [];
function addRootWrapper(fn) {
    rootWrappers.push(fn);
}
var Root = /** @class */ (function (_super) {
    __extends(Root, _super);
    function Root() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Root.prototype.resolveDefinitions = function (name) {
        var definitions = this.props.schema.definitions;
        if (!name || isEmpty(definitions)) {
            return {};
        }
        return definitions && definitions[name];
    };
    Root.prototype.render = function () {
        var _a = this.props, schema = _a.schema, rootStore = _a.rootStore, env = _a.env, pathPrefix = _a.pathPrefix, location = _a.location, data = _a.data, locale = _a.locale, translate = _a.translate, rest = __rest(_a, ["schema", "rootStore", "env", "pathPrefix", "location", "data", "locale", "translate"]);
        var theme = env.theme;
        var themeName = this.props.theme || 'cxd';
        if (themeName === 'default') {
            themeName = 'cxd';
        }
        return (React.createElement(RootStoreContext.Provider, { value: rootStore },
            React.createElement(ThemeContext.Provider, { value: themeName },
                React.createElement(LocaleContext.Provider, { value: this.props.locale }, rootWrappers.reduce(function (props, wrapper) {
                    return __assign(__assign({}, props), { children: wrapper(props) });
                }, __assign(__assign({ pathPrefix: pathPrefix || '', schema: isPlainObject(schema)
                        ? __assign({ type: 'page' }, schema) : schema }, rest), { render: renderChild, rootStore: rootStore, resolveDefinitions: this.resolveDefinitions, location: location, data: data, env: env, classnames: theme.classnames, classPrefix: theme.classPrefix, locale: locale, translate: translate, children: (React.createElement(RootRenderer, __assign({ pathPrefix: pathPrefix || '', schema: isPlainObject(schema)
                            ? __assign({ type: 'page' }, schema) : schema }, rest, { render: renderChild, rootStore: rootStore, resolveDefinitions: this.resolveDefinitions, location: location, data: data, env: env, classnames: theme.classnames, classPrefix: theme.classPrefix, locale: locale, translate: translate }))) })).children))));
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], Root.prototype, "resolveDefinitions", null);
    return Root;
}(React.Component));
function renderChildren(prefix, node, props) {
    if (Array.isArray(node)) {
        var elemKey = props.key || props.propKey || props.id || '';
        return node.map(function (node, index) {
            return renderChild("".concat(prefix, "/").concat(index), node, __assign(__assign({}, props), { key: "".concat(elemKey ? "".concat(elemKey, "-") : '').concat(index) }));
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
    else if (React.isValidElement(node)) {
        return node;
    }
    var schema = typeofnode === 'string' || typeofnode === 'number'
        ? { type: 'tpl', tpl: String(node) }
        : node;
    var transform = props.propsTransform;
    if (transform) {
        props = __assign({}, props);
        delete props.propsTransform;
        props = transform(props);
    }
    return (React.createElement(SchemaRenderer, __assign({ render: renderChild }, props, { schema: schema, propKey: schema.key, "$path": "".concat(prefix ? "".concat(prefix, "/") : '').concat((schema && schema.type) || '') })));
}
var ScopedRootRenderer = HocScoped(Root);

export { Root, addRootWrapper, ScopedRootRenderer as default, renderChild, renderChildren };
