/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var Portal = require('../node_modules/react-overlays/esm/Portal.js');
var cx = require('classnames');
var ReactDOM = require('react-dom');
var React = require('react');
require('../utils/api.js');
require('../utils/ColorScale.js');
require('lodash/chunk');
require('amis-formula');
require('lodash/isPlainObject');
require('../utils/DataSchema.js');
require('../utils/DataScope.js');
require('moment');
require('../utils/debug.js');
var dom = require('../utils/dom.js');
require('../utils/errors.js');
require('../utils/tpl.js');
var helper = require('../utils/helper.js');
require('../utils/filter.js');
require('lodash/isObject');
require('lodash/isString');
require('lodash/isBoolean');
require('../utils/image.js');
require('../actions/Action.js');
var resizeSensor = require('../utils/resize-sensor.js');
var RootClose = require('../utils/RootClose.js');
require('../utils/SimpleMap.js');
require('lodash/mapValues');
require('lodash/camelCase');
require('uncontrollable');
require('hoist-non-react-statics');
require('../utils/validations.js');
require('../utils/Animation.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var cx__default = /*#__PURE__*/_interopDefaultLegacy(cx);
var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/**
 * @file Overlay
 * @description
 * @author fex
 */
function onScroll(elem, callback) {
    var handler = function () {
        requestAnimationFrame(callback);
    };
    elem.addEventListener('scroll', handler);
    return function () {
        elem.removeEventListener('scroll', handler);
    };
}
var Position = /** @class */ (function (_super) {
    tslib.__extends(Position, _super);
    function Position(props) {
        var _this = _super.call(this, props) || this;
        _this.getTarget = function () {
            var target = _this.props.target;
            var targetElement = typeof target === 'function' ? target() : target;
            return (targetElement && ReactDOM__default["default"].findDOMNode(targetElement)) || null;
        };
        _this.maybeUpdatePosition = function (placementChanged) {
            var target = _this.getTarget();
            if (!_this.props.shouldUpdatePosition &&
                target === _this._lastTarget &&
                !placementChanged) {
                return;
            }
            _this.updatePosition(target);
        };
        _this.state = {
            positionLeft: 0,
            positionTop: 0,
            arrowOffsetLeft: null,
            arrowOffsetTop: null
        };
        _this._lastTarget = null;
        return _this;
    }
    Position.prototype.updatePosition = function (target) {
        var _this = this;
        var _a;
        this._lastTarget = target;
        if (!target) {
            return this.setState({
                positionLeft: 0,
                positionTop: 0,
                arrowOffsetLeft: null,
                arrowOffsetTop: null
            });
        }
        var watchTargetSizeChange = this.props.watchTargetSizeChange;
        var overlay = ReactDOM.findDOMNode(this);
        var container = dom.getContainer(this.props.container, dom.ownerDocument(this).body);
        if ((!this.watchedTarget || this.watchedTarget !== target) &&
            resizeSensor.getComputedStyle(target, 'position') !== 'static') {
            (_a = this.resizeDispose) === null || _a === void 0 ? void 0 : _a.forEach(function (fn) { return fn(); });
            this.watchedTarget = target;
            this.resizeDispose = [
                watchTargetSizeChange !== false
                    ? resizeSensor.resizeSensor(target, function () { return _this.updatePosition(target); })
                    : helper.noop,
                resizeSensor.resizeSensor(overlay, function () { return _this.updatePosition(target); })
            ];
            var scrollParent = helper.getScrollParent(target);
            if (scrollParent && container.contains(scrollParent)) {
                this.resizeDispose.push(onScroll(scrollParent, function () {
                    _this.updatePosition(target);
                }));
            }
        }
        this.setState(dom.calculatePosition(this.props.placement, overlay, target, container, this.props.containerPadding, this.props.offset));
    };
    Position.prototype.componentDidMount = function () {
        this.updatePosition(this.getTarget());
    };
    Position.prototype.componentDidUpdate = function (prevProps) {
        this.maybeUpdatePosition(this.props.placement !== prevProps.placement);
    };
    Position.prototype.componentWillUnmount = function () {
        var _a;
        (_a = this.resizeDispose) === null || _a === void 0 ? void 0 : _a.forEach(function (fn) { return fn(); });
    };
    Position.prototype.render = function () {
        var _a = this.props, children = _a.children, className = _a.className, props = tslib.__rest(_a, ["children", "className"]);
        var _b = this.state, positionLeft = _b.positionLeft, positionTop = _b.positionTop, arrowPosition = tslib.__rest(_b, ["positionLeft", "positionTop"]);
        // These should not be forwarded to the child.
        delete props.target;
        delete props.container;
        delete props.containerPadding;
        delete props.shouldUpdatePosition;
        var child = React__default["default"].Children.only(children);
        return React.cloneElement(child, tslib.__assign(tslib.__assign(tslib.__assign({}, props), arrowPosition), { 
            // FIXME: Don't forward `positionLeft` and `positionTop` via both props
            // and `props.style`.
            positionLeft: positionLeft, positionTop: positionTop, className: cx__default["default"](className, child.props.className), style: tslib.__assign(tslib.__assign({}, child.props.style), { left: positionLeft, top: positionTop }) }));
    };
    Position.defaultProps = {
        containerPadding: 0,
        placement: 'right',
        shouldUpdatePosition: false
    };
    return Position;
}(React__default["default"].Component));
var Overlay = /** @class */ (function (_super) {
    tslib.__extends(Overlay, _super);
    function Overlay(props) {
        var _this = _super.call(this, props) || this;
        _this.position = null;
        _this.positionRef = function (position) {
            _this.position = position;
        };
        _this.state = {
            exited: !props.show
        };
        return _this;
    }
    Overlay.prototype.updatePosition = function () {
        var _a;
        (_a = this.position) === null || _a === void 0 ? void 0 : _a.maybeUpdatePosition(true);
    };
    Overlay.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.show !== props.show && props.show) {
            this.setState({ exited: false });
        }
        else if (props.transition !== prevProps.transition && !props.transition) {
            // Otherwise let handleHidden take care of marking exited.
            this.setState({ exited: true });
        }
    };
    Overlay.prototype.onHiddenListener = function (node) {
        this.setState({ exited: true });
        if (this.props.onExited) {
            this.props.onExited(node);
        }
    };
    Overlay.prototype.getContainerSelector = function () {
        var containerSelector = this.props.containerSelector;
        var container = null;
        if (typeof containerSelector === 'string') {
            container = document.querySelector(containerSelector);
        }
        return container;
    };
    Overlay.prototype.render = function () {
        var _a = this.props, containerPadding = _a.containerPadding, target = _a.target, placement = _a.placement, shouldUpdatePosition = _a.shouldUpdatePosition, rootClose = _a.rootClose, children = _a.children; _a.watchTargetSizeChange; var Transition = _a.transition, offset = _a.offset, props = tslib.__rest(_a, ["containerPadding", "target", "placement", "shouldUpdatePosition", "rootClose", "children", "watchTargetSizeChange", "transition", "offset"]);
        var container = this.getContainerSelector()
            ? this.getContainerSelector
            : this.props.container;
        var mountOverlay = props.show || (Transition && !this.state.exited);
        if (!mountOverlay) {
            // Don't bother showing anything if we don't have to.
            return null;
        }
        var child = children;
        // Position is be inner-most because it adds inline styles into the child,
        // which the other wrappers don't forward correctly.
        child = (
        // @ts-ignore
        React__default["default"].createElement(Position, tslib.__assign({}, {
            container: container,
            containerPadding: containerPadding,
            target: target,
            placement: placement,
            shouldUpdatePosition: shouldUpdatePosition,
            offset: offset
        }, { ref: this.positionRef }), child));
        if (Transition) {
            var onExit = props.onExit, onExiting = props.onExiting, onEnter = props.onEnter, onEntering = props.onEntering, onEntered = props.onEntered;
            // This animates the child node by injecting props, so it must precede
            // anything that adds a wrapping div.
            child = (React__default["default"].createElement(Transition, { in: props.show, appear: true, onExit: onExit, onExiting: onExiting, onExited: this.onHiddenListener, onEnter: onEnter, onEntering: onEntering, onEntered: onEntered }, child));
        }
        // This goes after everything else because it adds a wrapping div.
        if (rootClose) {
            return (
            // @ts-ignore
            React__default["default"].createElement(Portal["default"], { container: container },
                React__default["default"].createElement(RootClose.RootClose, { onRootClose: props.onHide }, function (ref) {
                    if (React__default["default"].isValidElement(child)) {
                        return React__default["default"].cloneElement(child, {
                            ref: ref
                        });
                    }
                    return React__default["default"].createElement("div", { ref: ref }, child);
                })));
        }
        // @ts-ignore
        return React__default["default"].createElement(Portal["default"], { container: container }, child);
    };
    Overlay.defaultProps = {
        placement: 'auto'
    };
    tslib.__decorate([
        helper.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", [HTMLElement]),
        tslib.__metadata("design:returntype", void 0)
    ], Overlay.prototype, "onHiddenListener", null);
    tslib.__decorate([
        helper.autobind,
        tslib.__metadata("design:type", Function),
        tslib.__metadata("design:paramtypes", []),
        tslib.__metadata("design:returntype", void 0)
    ], Overlay.prototype, "getContainerSelector", null);
    return Overlay;
}(React__default["default"].Component));

exports["default"] = Overlay;
