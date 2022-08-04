/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var keyToPath = require('./keyToPath.js');

function getVariable(data, key, canAccessSuper) {
    if (canAccessSuper === void 0) { canAccessSuper = true; }
    if (!data || !key) {
        return undefined;
    }
    else if (canAccessSuper ? key in data : data.hasOwnProperty(key)) {
        return data[key];
    }
    return keyToPath.keyToPath(key).reduce(function (obj, key) {
        return obj &&
            typeof obj === 'object' &&
            (canAccessSuper ? key in obj : obj.hasOwnProperty(key))
            ? obj[key]
            : undefined;
    }, data);
}

exports.getVariable = getVariable;
