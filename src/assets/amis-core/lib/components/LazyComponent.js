/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var VisibilitySensor = require('react-visibility-sensor');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var VisibilitySensor__default = /*#__PURE__*/_interopDefaultLegacy(VisibilitySensor);

/**
 * @file LazyComponent
 * @description
 * @author fex
 */
var LazyComponent = /** @class */ (function (_super) {
    tslib.__extends(LazyComponent, _super);
    function LazyComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.mounted = false;
        _this.handleVisibleChange = _this.handleVisibleChange.bind(_this);
        _this.mounted = true;
        _this.state = {
            visible: false,
            component: props.component
        };
        return _this;
    }
    LazyComponent.prototype.componentDidMount = function () {
        // jest 里面有点异常，先手动让它总是可见
        if (typeof jest !== 'undefined') {
            this.handleVisibleChange(true);
        }
    };
    LazyComponent.prototype.componentWillUnmount = function () {
        this.mounted = false;
    };
    LazyComponent.prototype.handleVisibleChange = function (visible) {
        var _this = this;
        this.setState({
            visible: visible
        });
        if (!visible || this.state.component || !this.props.getComponent) {
            return;
        }
        this.props
            .getComponent()
            .then(function (component) {
            return _this.mounted &&
                typeof component === 'function' &&
                _this.setState({
                    component: component
                });
        })
            .catch(function (reason) {
            return _this.mounted &&
                _this.setState({
                    component: function () { return (React__default["default"].createElement("div", { className: "alert alert-danger" }, String(reason))); }
                });
        });
    };
    LazyComponent.prototype.render = function () {
        var _a = this.props, placeholder = _a.placeholder, unMountOnHidden = _a.unMountOnHidden, childProps = _a.childProps, visiblilityProps = _a.visiblilityProps, partialVisibility = _a.partialVisibility, children = _a.children, rest = tslib.__rest(_a, ["placeholder", "unMountOnHidden", "childProps", "visiblilityProps", "partialVisibility", "children"]);
        var _b = this.state, visible = _b.visible, Component = _b.component;
        // 需要监听从可见到不可见。
        if (unMountOnHidden) {
            return (React__default["default"].createElement(VisibilitySensor__default["default"], tslib.__assign({}, visiblilityProps, { partialVisibility: partialVisibility, onChange: this.handleVisibleChange }),
                React__default["default"].createElement("div", { className: "visibility-sensor" }, Component && visible ? (React__default["default"].createElement(Component, tslib.__assign({}, rest, childProps))) : children && visible ? (children) : (placeholder))));
        }
        if (!visible) {
            return (React__default["default"].createElement(VisibilitySensor__default["default"], tslib.__assign({}, visiblilityProps, { partialVisibility: partialVisibility, onChange: this.handleVisibleChange }),
                React__default["default"].createElement("div", { className: "visibility-sensor" }, placeholder)));
        }
        else if (Component) {
            // 只监听不可见到可见，一旦可见了，就销毁检查。
            return React__default["default"].createElement(Component, tslib.__assign({}, rest, childProps));
        }
        else if (children) {
            return children;
        }
        return React__default["default"].createElement("div", null, placeholder);
    };
    LazyComponent.defaultProps = {
        placeholder: React__default["default"].createElement("span", null, "Loading..."),
        unMountOnHidden: false,
        partialVisibility: true
    };
    return LazyComponent;
}(React__default["default"].Component));

exports["default"] = LazyComponent;
