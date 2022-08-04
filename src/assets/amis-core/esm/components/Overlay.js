/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __extends, __rest, __assign, __decorate, __metadata } from 'tslib';
import Portal from '../node_modules/react-overlays/esm/Portal.js';
import cx from 'classnames';
import ReactDOM, { findDOMNode } from 'react-dom';
import React, { cloneElement } from 'react';
import '../utils/api.js';
import '../utils/ColorScale.js';
import 'lodash/chunk';
import 'amis-formula';
import 'lodash/isPlainObject';
import '../utils/DataSchema.js';
import '../utils/DataScope.js';
import 'moment';
import '../utils/debug.js';
import { getContainer, ownerDocument, calculatePosition } from '../utils/dom.js';
import '../utils/errors.js';
import '../utils/tpl.js';
import { noop, getScrollParent, autobind } from '../utils/helper.js';
import '../utils/filter.js';
import 'lodash/isObject';
import 'lodash/isString';
import 'lodash/isBoolean';
import '../utils/image.js';
import '../actions/Action.js';
import { getComputedStyle, resizeSensor } from '../utils/resize-sensor.js';
import { RootClose } from '../utils/RootClose.js';
import '../utils/SimpleMap.js';
import 'lodash/mapValues';
import 'lodash/camelCase';
import 'uncontrollable';
import 'hoist-non-react-statics';
import '../utils/validations.js';
import '../utils/Animation.js';

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
    __extends(Position, _super);
    function Position(props) {
        var _this = _super.call(this, props) || this;
        _this.getTarget = function () {
            var target = _this.props.target;
            var targetElement = typeof target === 'function' ? target() : target;
            return (targetElement && ReactDOM.findDOMNode(targetElement)) || null;
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
        var overlay = findDOMNode(this);
        var container = getContainer(this.props.container, ownerDocument(this).body);
        if ((!this.watchedTarget || this.watchedTarget !== target) &&
            getComputedStyle(target, 'position') !== 'static') {
            (_a = this.resizeDispose) === null || _a === void 0 ? void 0 : _a.forEach(function (fn) { return fn(); });
            this.watchedTarget = target;
            this.resizeDispose = [
                watchTargetSizeChange !== false
                    ? resizeSensor(target, function () { return _this.updatePosition(target); })
                    : noop,
                resizeSensor(overlay, function () { return _this.updatePosition(target); })
            ];
            var scrollParent = getScrollParent(target);
            if (scrollParent && container.contains(scrollParent)) {
                this.resizeDispose.push(onScroll(scrollParent, function () {
                    _this.updatePosition(target);
                }));
            }
        }
        this.setState(calculatePosition(this.props.placement, overlay, target, container, this.props.containerPadding, this.props.offset));
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
        var _a = this.props, children = _a.children, className = _a.className, props = __rest(_a, ["children", "className"]);
        var _b = this.state, positionLeft = _b.positionLeft, positionTop = _b.positionTop, arrowPosition = __rest(_b, ["positionLeft", "positionTop"]);
        // These should not be forwarded to the child.
        delete props.target;
        delete props.container;
        delete props.containerPadding;
        delete props.shouldUpdatePosition;
        var child = React.Children.only(children);
        return cloneElement(child, __assign(__assign(__assign({}, props), arrowPosition), { 
            // FIXME: Don't forward `positionLeft` and `positionTop` via both props
            // and `props.style`.
            positionLeft: positionLeft, positionTop: positionTop, className: cx(className, child.props.className), style: __assign(__assign({}, child.props.style), { left: positionLeft, top: positionTop }) }));
    };
    Position.defaultProps = {
        containerPadding: 0,
        placement: 'right',
        shouldUpdatePosition: false
    };
    return Position;
}(React.Component));
var Overlay = /** @class */ (function (_super) {
    __extends(Overlay, _super);
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
        var _a = this.props, containerPadding = _a.containerPadding, target = _a.target, placement = _a.placement, shouldUpdatePosition = _a.shouldUpdatePosition, rootClose = _a.rootClose, children = _a.children; _a.watchTargetSizeChange; var Transition = _a.transition, offset = _a.offset, props = __rest(_a, ["containerPadding", "target", "placement", "shouldUpdatePosition", "rootClose", "children", "watchTargetSizeChange", "transition", "offset"]);
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
        React.createElement(Position, __assign({}, {
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
            child = (React.createElement(Transition, { in: props.show, appear: true, onExit: onExit, onExiting: onExiting, onExited: this.onHiddenListener, onEnter: onEnter, onEntering: onEntering, onEntered: onEntered }, child));
        }
        // This goes after everything else because it adds a wrapping div.
        if (rootClose) {
            return (
            // @ts-ignore
            React.createElement(Portal, { container: container },
                React.createElement(RootClose, { onRootClose: props.onHide }, function (ref) {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, {
                            ref: ref
                        });
                    }
                    return React.createElement("div", { ref: ref }, child);
                })));
        }
        // @ts-ignore
        return React.createElement(Portal, { container: container }, child);
    };
    Overlay.defaultProps = {
        placement: 'auto'
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [HTMLElement]),
        __metadata("design:returntype", void 0)
    ], Overlay.prototype, "onHiddenListener", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Overlay.prototype, "getContainerSelector", null);
    return Overlay;
}(React.Component));

export { Overlay as default };
