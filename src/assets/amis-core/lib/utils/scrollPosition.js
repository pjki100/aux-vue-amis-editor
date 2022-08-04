/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var position = require('./position.js');

function getScrollParent(element, includeHidden) {
    if (!element) {
        return document.body;
    }
    var style = getComputedStyle(element);
    var excludeStaticParent = style.position === 'absolute';
    var overflowRegex = includeHidden
        ? /(auto|scroll|hidden)/
        : /(auto|scroll)/;
    if (style.position === 'fixed')
        return document.body;
    for (var parent_1 = element; (parent_1 = parent_1.parentElement);) {
        style = getComputedStyle(parent_1);
        if (excludeStaticParent && style.position === 'static') {
            continue;
        }
        if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
            return parent_1;
    }
    return document.body;
}
function scrollPosition(dom) {
    return position.position(dom, getScrollParent(dom));
}

exports.scrollPosition = scrollPosition;
