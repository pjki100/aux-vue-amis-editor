/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { resolveVariable } from './resolveVariable.js';

function makeSorter(key, method, order) {
    return function (a, b) {
        if (!a || !b) {
            return 0;
        }
        var va = resolveVariable(key, a);
        var vb = resolveVariable(key, b);
        var result = 0;
        if (method === 'numerical') {
            result = (parseFloat(va) || 0) - (parseFloat(vb) || 0);
        }
        else {
            result = String(va).localeCompare(String(vb));
        }
        return result * (order === 'desc' ? -1 : 1);
    };
}

export { makeSorter };
