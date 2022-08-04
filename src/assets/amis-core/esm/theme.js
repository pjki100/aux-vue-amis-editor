/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __assign, __extends } from 'tslib';
import cx from 'classnames';
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

var themes = {
    default: {},
    cxd: {
        classPrefix: 'cxd-'
    }
};
function theme(name, config) {
    themes[name] = __assign(__assign({}, themes[name]), config);
}
var fns = {};
function makeClassnames(ns) {
    if (ns && fns[ns]) {
        return fns[ns];
    }
    var fn = function () {
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        var str = cx.apply(void 0, classes);
        return str && ns
            ? str
                .replace(/(^|\s)([A-Z])/g, '$1' + ns + '$2')
                .replace(/(^|\s)\:/g, '$1')
            : str || '';
    };
    ns && (fns[ns] = fn);
    return fn;
}
function hasTheme(theme) {
    return !!themes[theme];
}
function setDefaultTheme(theme) {
    if (hasTheme(theme)) {
        defaultTheme = theme;
    }
}
function classnames() {
    var classes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classes[_i] = arguments[_i];
    }
    return getTheme(defaultTheme).classnames.apply(null, classes);
}
function getClassPrefix() {
    return getTheme(defaultTheme).classPrefix;
}
function getTheme(theme) {
    var config = themes[theme || 'cxd'];
    if (!config.getRendererConfig) {
        config.getRendererConfig = function (name) {
            var config = themes[theme || 'cxd'];
            return config.renderers && name ? config.renderers[name] : null;
        };
    }
    if (!config.classnames) {
        var ns = config.classPrefix;
        config.classnames = config.classnames || makeClassnames(ns);
    }
    if (!config.getComponentConfig) {
        config.getComponentConfig = function (name) {
            return config.components && name ? config.components[name] : null;
        };
    }
    return config;
}
var defaultTheme = 'cxd';
var ThemeContext = React.createContext('');
function themeable(ComposedComponent) {
    var _a;
    var result = hoistNonReactStatic((_a = /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1(props) {
                var _this = _super.call(this, props) || this;
                _this.childRef = _this.childRef.bind(_this);
                _this.getWrappedInstance = _this.getWrappedInstance.bind(_this);
                return _this;
            }
            class_1.prototype.childRef = function (ref) {
                while (ref && ref.getWrappedInstance) {
                    ref = ref.getWrappedInstance();
                }
                this.ref = ref;
            };
            class_1.prototype.getWrappedInstance = function () {
                return this.ref;
            };
            class_1.prototype.render = function () {
                var _a;
                var theme = this.props.theme || this.context || defaultTheme;
                var config = hasTheme(theme)
                    ? getTheme(theme)
                    : getTheme(defaultTheme);
                var injectedProps = {
                    classPrefix: config.classPrefix,
                    classnames: config.classnames,
                    theme: theme
                };
                var refConfig = ((_a = ComposedComponent.prototype) === null || _a === void 0 ? void 0 : _a.isReactComponent)
                    ? { ref: this.childRef }
                    : { forwardedRef: this.childRef };
                return (React.createElement(ThemeContext.Provider, { value: theme },
                    React.createElement(ComposedComponent, __assign({}, config.getComponentConfig(ComposedComponent.themeKey), this.props, injectedProps, refConfig))));
            };
            return class_1;
        }(React.Component)),
        _a.displayName = "Themeable(".concat(ComposedComponent.displayName || ComposedComponent.name, ")"),
        _a.contextType = ThemeContext,
        _a.ComposedComponent = ComposedComponent,
        _a), ComposedComponent);
    return result;
}

export { ThemeContext, classnames, defaultTheme, getClassPrefix, getTheme, hasTheme, makeClassnames, setDefaultTheme, theme, themeable };
