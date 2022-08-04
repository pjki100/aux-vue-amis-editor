/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __extends, __rest, __assign } from 'tslib';
import React from 'react';
import { findDOMNode } from 'react-dom';
import { themeable } from '../theme.js';
import '../utils/api.js';
import '../utils/ColorScale.js';
import 'lodash/chunk';
import 'amis-formula';
import 'lodash/isPlainObject';
import '../utils/DataSchema.js';
import '../utils/DataScope.js';
import 'moment';
import '../utils/debug.js';
import '../utils/errors.js';
import '../utils/tpl.js';
import { preventDefault, camel } from '../utils/helper.js';
import 'classnames';
import '../utils/filter.js';
import 'lodash/isObject';
import 'lodash/isString';
import 'lodash/isBoolean';
import '../utils/image.js';
import '../actions/Action.js';
import '../utils/resize-sensor.js';
import '../node_modules/dom-helpers/esm/addEventListener.js';
import '../node_modules/warning/warning.js';
import '../utils/SimpleMap.js';
import 'lodash/mapValues';
import 'lodash/camelCase';
import 'uncontrollable';
import 'hoist-non-react-statics';
import '../utils/validations.js';
import '../utils/Animation.js';

/**
 * @file PopOver
 * @description
 * @author fex
 */
var PopOver = /** @class */ (function (_super) {
    __extends(PopOver, _super);
    function PopOver() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            xOffset: 0,
            yOffset: 0
        };
        _this.wrapperRef = React.createRef();
        return _this;
    }
    PopOver.prototype.componentDidMount = function () {
        this.mayUpdateOffset();
        var dom = findDOMNode(this);
        this.parent = dom.parentNode;
        this.parent.classList.add('has-popover');
        if (this.wrapperRef && this.wrapperRef.current) {
            // https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#使用_passive_改善的滚屏性能
            this.wrapperRef.current.addEventListener('touchmove', preventDefault, {
                passive: false,
                capture: false
            });
        }
    };
    PopOver.prototype.componentDidUpdate = function () {
        this.mayUpdateOffset();
    };
    PopOver.prototype.componentWillUnmount = function () {
        this.parent && this.parent.classList.remove('has-popover');
        if (this.wrapperRef && this.wrapperRef.current) {
            this.wrapperRef.current.removeEventListener('touchmove', preventDefault);
        }
    };
    PopOver.prototype.mayUpdateOffset = function () {
        var offset;
        var getOffset = this.props.offset;
        if (getOffset && typeof getOffset === 'function') {
            var _a = this.props, placement = _a.placement, y = _a.positionTop, x = _a.positionLeft;
            offset = getOffset(findDOMNode(this).getBoundingClientRect(), {
                x: x,
                y: y,
                placement: placement
            });
        }
        else {
            offset = getOffset;
        }
        this.setState({
            xOffset: offset && offset.x ? offset.x : 0,
            yOffset: offset && offset.y ? offset.y : 0
        });
    };
    PopOver.prototype.render = function () {
        var _a = this.props; _a.placement; var activePlacement = _a.activePlacement, positionTop = _a.positionTop, positionLeft = _a.positionLeft; _a.arrowOffsetLeft; _a.arrowOffsetTop; var style = _a.style, children = _a.children; _a.offset; var overlay = _a.overlay, onHide = _a.onHide, ns = _a.classPrefix, cx = _a.classnames, className = _a.className, rest = __rest(_a, ["placement", "activePlacement", "positionTop", "positionLeft", "arrowOffsetLeft", "arrowOffsetTop", "style", "children", "offset", "overlay", "onHide", "classPrefix", "classnames", "className"]);
        var _b = this.state, xOffset = _b.xOffset, yOffset = _b.yOffset;
        var outerStyle = __assign(__assign({ display: 'block' }, style), { top: positionTop + yOffset, left: positionLeft + xOffset });
        return (React.createElement("div", __assign({ ref: this.wrapperRef, className: cx("".concat(ns, "PopOver"), className, "".concat(ns, "PopOver--").concat(camel(activePlacement))), style: outerStyle }, rest),
            overlay ? (React.createElement("div", { className: "".concat(ns, "PopOver-overlay"), onClick: onHide })) : null,
            children));
    };
    PopOver.defaultProps = {
        className: '',
        offset: {
            x: 0,
            y: 0
        },
        overlay: false,
        placement: 'auto'
    };
    return PopOver;
}(React.PureComponent));
var PopOver$1 = themeable(PopOver);

export { PopOver, PopOver$1 as default };
