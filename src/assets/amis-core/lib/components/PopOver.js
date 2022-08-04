/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var ReactDOM = require('react-dom');
var theme = require('../theme.js');
require('../utils/api.js');
require('../utils/ColorScale.js');
require('lodash/chunk');
require('amis-formula');
require('lodash/isPlainObject');
require('../utils/DataSchema.js');
require('../utils/DataScope.js');
require('moment');
require('../utils/debug.js');
require('../utils/errors.js');
require('../utils/tpl.js');
var helper = require('../utils/helper.js');
require('classnames');
require('../utils/filter.js');
require('lodash/isObject');
require('lodash/isString');
require('lodash/isBoolean');
require('../utils/image.js');
require('../actions/Action.js');
require('../utils/resize-sensor.js');
require('../node_modules/dom-helpers/esm/addEventListener.js');
require('../node_modules/warning/warning.js');
require('../utils/SimpleMap.js');
require('lodash/mapValues');
require('lodash/camelCase');
require('uncontrollable');
require('hoist-non-react-statics');
require('../utils/validations.js');
require('../utils/Animation.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/**
 * @file PopOver
 * @description
 * @author fex
 */
var PopOver = /** @class */ (function (_super) {
    tslib.__extends(PopOver, _super);
    function PopOver() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            xOffset: 0,
            yOffset: 0
        };
        _this.wrapperRef = React__default["default"].createRef();
        return _this;
    }
    PopOver.prototype.componentDidMount = function () {
        this.mayUpdateOffset();
        var dom = ReactDOM.findDOMNode(this);
        this.parent = dom.parentNode;
        this.parent.classList.add('has-popover');
        if (this.wrapperRef && this.wrapperRef.current) {
            // https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#使用_passive_改善的滚屏性能
            this.wrapperRef.current.addEventListener('touchmove', helper.preventDefault, {
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
            this.wrapperRef.current.removeEventListener('touchmove', helper.preventDefault);
        }
    };
    PopOver.prototype.mayUpdateOffset = function () {
        var offset;
        var getOffset = this.props.offset;
        if (getOffset && typeof getOffset === 'function') {
            var _a = this.props, placement = _a.placement, y = _a.positionTop, x = _a.positionLeft;
            offset = getOffset(ReactDOM.findDOMNode(this).getBoundingClientRect(), {
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
        var _a = this.props; _a.placement; var activePlacement = _a.activePlacement, positionTop = _a.positionTop, positionLeft = _a.positionLeft; _a.arrowOffsetLeft; _a.arrowOffsetTop; var style = _a.style, children = _a.children; _a.offset; var overlay = _a.overlay, onHide = _a.onHide, ns = _a.classPrefix, cx = _a.classnames, className = _a.className, rest = tslib.__rest(_a, ["placement", "activePlacement", "positionTop", "positionLeft", "arrowOffsetLeft", "arrowOffsetTop", "style", "children", "offset", "overlay", "onHide", "classPrefix", "classnames", "className"]);
        var _b = this.state, xOffset = _b.xOffset, yOffset = _b.yOffset;
        var outerStyle = tslib.__assign(tslib.__assign({ display: 'block' }, style), { top: positionTop + yOffset, left: positionLeft + xOffset });
        return (React__default["default"].createElement("div", tslib.__assign({ ref: this.wrapperRef, className: cx("".concat(ns, "PopOver"), className, "".concat(ns, "PopOver--").concat(helper.camel(activePlacement))), style: outerStyle }, rest),
            overlay ? (React__default["default"].createElement("div", { className: "".concat(ns, "PopOver-overlay"), onClick: onHide })) : null,
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
}(React__default["default"].PureComponent));
var PopOver$1 = theme.themeable(PopOver);

exports.PopOver = PopOver;
exports["default"] = PopOver$1;
