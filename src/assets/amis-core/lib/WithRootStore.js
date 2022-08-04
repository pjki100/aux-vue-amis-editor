/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var hoistNonReactStatic = require('hoist-non-react-statics');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var hoistNonReactStatic__default = /*#__PURE__*/_interopDefaultLegacy(hoistNonReactStatic);

var RootStoreContext = React__default["default"].createContext(undefined);
function withRootStore(ComposedComponent) {
    var _a;
    var result = hoistNonReactStatic__default["default"]((_a = /** @class */ (function (_super) {
            tslib.__extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.render = function () {
                var rootStore = this.context;
                var injectedProps = {
                    rootStore: rootStore
                };
                return (React__default["default"].createElement(ComposedComponent, tslib.__assign({}, this.props, injectedProps)));
            };
            return class_1;
        }(React__default["default"].Component)),
        _a.displayName = "WithRootStore(".concat(ComposedComponent.displayName || ComposedComponent.name, ")"),
        _a.contextType = RootStoreContext,
        _a.ComposedComponent = ComposedComponent,
        _a), ComposedComponent);
    return result;
}

exports.RootStoreContext = RootStoreContext;
exports.withRootStore = withRootStore;
