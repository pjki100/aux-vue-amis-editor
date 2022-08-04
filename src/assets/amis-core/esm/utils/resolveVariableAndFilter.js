/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { parse, Evaluator } from 'amis-formula';

var resolveVariableAndFilter = function (path, data, defaultFilter, fallbackValue) {
    if (data === void 0) { data = {}; }
    if (defaultFilter === void 0) { defaultFilter = '| html'; }
    if (fallbackValue === void 0) { fallbackValue = function (value) { return value; }; }
    if (!path || typeof path !== 'string') {
        return undefined;
    }
    try {
        var ast = parse(path, {
            evalMode: false,
            allowFilter: true
        });
        var ret = new Evaluator(data, {
            defaultFilter: defaultFilter
        }).evalute(ast);
        return ret == null && !~path.indexOf('default') && !~path.indexOf('now')
            ? fallbackValue(ret)
            : ret;
    }
    catch (e) {
        console.warn(e);
        return undefined;
    }
};

export { resolveVariableAndFilter };
