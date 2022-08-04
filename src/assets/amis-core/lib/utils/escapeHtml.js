/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
};
var escapeHtml = function (str) {
    return String(str).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
};

exports.escapeHtml = escapeHtml;
