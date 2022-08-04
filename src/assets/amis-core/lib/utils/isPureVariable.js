/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var amisFormula = require('amis-formula');

function isPureVariable(path) {
    if (typeof path === 'string') {
        try {
            var ast = amisFormula.parse(path);
            // 只有一个成员说明是纯表达式模式
            return ast.body.length === 1 && ast.body[0].type === 'script';
        }
        catch (err) {
            return false;
        }
    }
    return false;
}

exports.isPureVariable = isPureVariable;
