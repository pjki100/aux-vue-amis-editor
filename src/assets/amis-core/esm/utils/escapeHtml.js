/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

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

export { escapeHtml };
