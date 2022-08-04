/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { parse, Evaluator } from 'amis-formula';

var tokenize = function (str, data, defaultFilter) {
    if (defaultFilter === void 0) { defaultFilter = '| html'; }
    if (!str || typeof str !== 'string') {
        return str;
    }
    try {
        var ast = parse(str, {
            evalMode: false,
            allowFilter: true
        });
        var result = new Evaluator(data, {
            defaultFilter: defaultFilter
        }).evalute(ast);
        return "".concat(result == null ? '' : result);
    }
    catch (e) {
        console.warn(e);
        return str;
    }
};

export { tokenize };
