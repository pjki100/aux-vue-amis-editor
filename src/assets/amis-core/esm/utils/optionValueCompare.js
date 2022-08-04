/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import './helper.js';
import { isObject } from './object.js';

function matchOptionValue(a, b, valueField) {
    if (valueField === void 0) { valueField = 'value'; }
    return isObject(a)
        ? a === b[valueField || 'value']
        : String(b[valueField || 'value']) === String(a);
}
function optionValueCompare(a, valueField) {
    if (valueField === void 0) { valueField = 'value'; }
    return function (b) { return matchOptionValue(a, b, valueField); };
}

export { matchOptionValue, optionValueCompare };
