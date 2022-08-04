/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('./helper.js');
var object = require('./object.js');

function matchOptionValue(a, b, valueField) {
    if (valueField === void 0) { valueField = 'value'; }
    return object.isObject(a)
        ? a === b[valueField || 'value']
        : String(b[valueField || 'value']) === String(a);
}
function optionValueCompare(a, valueField) {
    if (valueField === void 0) { valueField = 'value'; }
    return function (b) { return matchOptionValue(a, b, valueField); };
}

exports.matchOptionValue = matchOptionValue;
exports.optionValueCompare = optionValueCompare;
