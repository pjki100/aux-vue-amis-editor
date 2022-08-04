/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('amis-formula');
require('moment');
require('tslib');
require('lodash/isPlainObject');
var resolveVariableAndFilter = require('./resolveVariableAndFilter.js');
require('./filter.js');
var mapValues = require('lodash/mapValues');
var camelCase = require('lodash/camelCase');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var mapValues__default = /*#__PURE__*/_interopDefaultLegacy(mapValues);
var camelCase__default = /*#__PURE__*/_interopDefaultLegacy(camelCase);

/**
 * 处理样式相关的工具方法，不放 helper 里是为了避免循环依赖
 */
function autoAddImageURL(image) {
    // 只支持单个的情况，并简单滤掉 linear-gradient 等情况
    if (typeof image === 'string' &&
        image.indexOf(',') === -1 &&
        image.indexOf('(') === -1) {
        return "url(\"".concat(image, "\")");
    }
    return image;
}
/**
 * 处理配置中的 style，主要做三件事：
 * 1. 变量解析
 * 2. 将 font-size 之类的错误写法转成 fontSize
 * 3. 针对 image 自动加 url
 */
function buildStyle(style, data) {
    if (!style) {
        return style;
    }
    var styleVar = typeof style === 'string'
        ? resolveVariableAndFilter.resolveVariableAndFilter(style, data, '| raw') || {}
        : mapValues__default["default"](style, function (s) { return resolveVariableAndFilter.resolveVariableAndFilter(s, data, '| raw') || s; });
    Object.keys(styleVar).forEach(function (key) {
        if (key.indexOf('-') !== -1) {
            styleVar[camelCase__default["default"](key)] = styleVar[key];
            delete styleVar[key];
        }
    });
    if (styleVar.backgroundImage) {
        styleVar.backgroundImage = autoAddImageURL(styleVar.backgroundImage);
    }
    if (styleVar.borderImage) {
        styleVar.borderImage = autoAddImageURL(styleVar.borderImage);
    }
    if (styleVar.listStyleImage) {
        styleVar.listStyleImage = autoAddImageURL(styleVar.listStyleImage);
    }
    return styleVar;
}

exports.buildStyle = buildStyle;
