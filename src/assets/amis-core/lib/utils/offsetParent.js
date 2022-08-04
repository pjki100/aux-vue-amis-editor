/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * 删减自 https://github.com/react-bootstrap/dom-helpers/blob/master/src/offsetParent.ts
 */
var isHTMLElement = function (e) {
    return !!e && 'offsetParent' in e;
};
function offsetParent(node) {
    var doc = node === null || node === void 0 ? void 0 : node.ownerDocument;
    var parent = node && node.offsetParent;
    while (isHTMLElement(parent) &&
        parent.nodeName !== 'HTML' &&
        getComputedStyle(parent).getPropertyValue('position') === 'static') {
        parent = parent.offsetParent;
    }
    return (parent || doc.documentElement);
}

exports["default"] = offsetParent;
exports.offsetParent = offsetParent;
