/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var hoistNonReactStatic = require('hoist-non-react-statics');
require('amis-formula');
require('moment');
require('lodash/isPlainObject');
var resolveVariable = require('./utils/resolveVariable.js');
require('./utils/filter.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var hoistNonReactStatic__default = /*#__PURE__*/_interopDefaultLegacy(hoistNonReactStatic);

var defaultLocale = 'zh-CN';
var locales = {};
function register(name, config) {
    locales[name] = config;
}
function extendLocale(name, config) {
    locales[name] = tslib.__assign(tslib.__assign({}, (locales[name] || {})), config);
}
var fns = {};
function format(str, data) {
    return str.replace(/(\\)?\{\{([\s\S]+?)\}\}/g, function (_, escape, key) {
        if (escape) {
            return _.substring(1);
        }
        return resolveVariable.resolveVariable(key, data || {});
    });
}
function makeTranslator(locale) {
    if (locale && fns[locale]) {
        return fns[locale];
    }
    var fn = function (str) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!str || typeof str !== 'string') {
            return str;
        }
        var dict = locales[locale] || locales[defaultLocale];
        return format.apply(void 0, tslib.__spreadArray([(dict === null || dict === void 0 ? void 0 : dict[str]) || str], args, false));
    };
    locale && (fns[locale] = fn);
    return fn;
}
function getDefaultLocale() {
    return defaultLocale;
}
function setDefaultLocale(loacle) {
    defaultLocale = loacle;
}
var LocaleContext = React__default["default"].createContext('');
function localeable(ComposedComponent) {
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
                var locale = this.props.locale || this.context || defaultLocale;
                var translate = this.props.translate || makeTranslator(locale);
                var injectedProps = {
                    locale: locale,
                    translate: translate
                };
                var refConfig = ((_a = ComposedComponent.prototype) === null || _a === void 0 ? void 0 : _a.isReactComponent)
                    ? { ref: this.childRef }
                    : { forwardedRef: this.childRef };
                return (React__default["default"].createElement(LocaleContext.Provider, { value: locale },
                    React__default["default"].createElement(ComposedComponent, tslib.__assign({}, this.props, injectedProps, refConfig))));
            };
            return class_1;
        }(React__default["default"].Component)),
        _a.displayName = "I18N(".concat(ComposedComponent.displayName || ComposedComponent.name, ")"),
        _a.contextType = LocaleContext,
        _a.ComposedComponent = ComposedComponent,
        _a), ComposedComponent);
    return result;
}

exports.LocaleContext = LocaleContext;
exports.extendLocale = extendLocale;
exports.getDefaultLocale = getDefaultLocale;
exports.localeable = localeable;
exports.makeTranslator = makeTranslator;
exports.register = register;
exports.setDefaultLocale = setDefaultLocale;
