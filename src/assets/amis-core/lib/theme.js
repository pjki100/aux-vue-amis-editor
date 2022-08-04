/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var cx = require('classnames');
var React = require('react');
var hoistNonReactStatic = require('hoist-non-react-statics');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var cx__default = /*#__PURE__*/_interopDefaultLegacy(cx);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var hoistNonReactStatic__default = /*#__PURE__*/_interopDefaultLegacy(hoistNonReactStatic);

var themes = {
    default: {},
    cxd: {
        classPrefix: 'cxd-'
    }
};
function theme(name, config) {
    themes[name] = tslib.__assign(tslib.__assign({}, themes[name]), config);
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
        var str = cx__default["default"].apply(void 0, classes);
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
        exports.defaultTheme = theme;
    }
}
function classnames() {
    var classes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classes[_i] = arguments[_i];
    }
    return getTheme(exports.defaultTheme).classnames.apply(null, classes);
}
function getClassPrefix() {
    return getTheme(exports.defaultTheme).classPrefix;
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
exports.defaultTheme = 'cxd';
var ThemeContext = React__default["default"].createContext('');
function themeable(ComposedComponent) {
    var _a;
    var result = hoistNonReactStatic__default["default"]((_a = /** @class */ (function (_super) {
            tslib.__extends(class_1, _super);
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
                var theme = this.props.theme || this.context || exports.defaultTheme;
                var config = hasTheme(theme)
                    ? getTheme(theme)
                    : getTheme(exports.defaultTheme);
                var injectedProps = {
                    classPrefix: config.classPrefix,
                    classnames: config.classnames,
                    theme: theme
                };
                var refConfig = ((_a = ComposedComponent.prototype) === null || _a === void 0 ? void 0 : _a.isReactComponent)
                    ? { ref: this.childRef }
                    : { forwardedRef: this.childRef };
                return (React__default["default"].createElement(ThemeContext.Provider, { value: theme },
                    React__default["default"].createElement(ComposedComponent, tslib.__assign({}, config.getComponentConfig(ComposedComponent.themeKey), this.props, injectedProps, refConfig))));
            };
            return class_1;
        }(React__default["default"].Component)),
        _a.displayName = "Themeable(".concat(ComposedComponent.displayName || ComposedComponent.name, ")"),
        _a.contextType = ThemeContext,
        _a.ComposedComponent = ComposedComponent,
        _a), ComposedComponent);
    return result;
}

exports.ThemeContext = ThemeContext;
exports.classnames = classnames;
exports.getClassPrefix = getClassPrefix;
exports.getTheme = getTheme;
exports.hasTheme = hasTheme;
exports.makeClassnames = makeClassnames;
exports.setDefaultTheme = setDefaultTheme;
exports.theme = theme;
exports.themeable = themeable;
