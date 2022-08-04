/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/**
 * @file 图标支持的公共方法，主要是支持自动识别地址和 icon-font
 */
/**
 * 判断字符串来生成 i 或 img
 * @param icon icon 设置
 * @param className 内部用的 className
 * @param classNameProp amis 配置里设置的 className
 */
var generateIcon = function (cx, icon, className, classNameProp) {
    if (React__default["default"].isValidElement(icon)) {
        return icon;
    }
    var isURLIcon = (icon === null || icon === void 0 ? void 0 : icon.indexOf('.')) !== -1;
    return icon ? (isURLIcon ? (React__default["default"].createElement("img", { className: cx(className, classNameProp), src: icon, key: icon })) : (React__default["default"].createElement("i", { className: cx(className, icon, classNameProp), key: icon }))) : null;
};

exports.generateIcon = generateIcon;
