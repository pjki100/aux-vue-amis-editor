/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { keyToPath } from './keyToPath.js';

function getVariable(data, key, canAccessSuper) {
    if (canAccessSuper === void 0) { canAccessSuper = true; }
    if (!data || !key) {
        return undefined;
    }
    else if (canAccessSuper ? key in data : data.hasOwnProperty(key)) {
        return data[key];
    }
    return keyToPath(key).reduce(function (obj, key) {
        return obj &&
            typeof obj === 'object' &&
            (canAccessSuper ? key in obj : obj.hasOwnProperty(key))
            ? obj[key]
            : undefined;
    }, data);
}

export { getVariable };
