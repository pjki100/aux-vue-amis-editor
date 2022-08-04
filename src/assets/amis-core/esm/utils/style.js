/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import 'amis-formula';
import 'moment';
import 'tslib';
import 'lodash/isPlainObject';
import { resolveVariableAndFilter } from './resolveVariableAndFilter.js';
import './filter.js';
import mapValues from 'lodash/mapValues';
import camelCase from 'lodash/camelCase';

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
        ? resolveVariableAndFilter(style, data, '| raw') || {}
        : mapValues(style, function (s) { return resolveVariableAndFilter(s, data, '| raw') || s; });
    Object.keys(styleVar).forEach(function (key) {
        if (key.indexOf('-') !== -1) {
            styleVar[camelCase(key)] = styleVar[key];
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

export { buildStyle };
