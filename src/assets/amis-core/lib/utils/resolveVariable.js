/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var amisFormula = require('amis-formula');
var getVariable = require('./getVariable.js');

function resolveVariable(path, data) {
    if (data === void 0) { data = {}; }
    if (path === '&' || path == '$$') {
        return data;
    }
    else if (!path || typeof path !== 'string') {
        return undefined;
    }
    else if (!~path.indexOf(':')) {
        // 简单用法直接用 getVariable
        return getVariable.getVariable(data, path[0] === '$' ? path.substring(1) : path);
    }
    // window:xxx  ls:xxx.xxx
    // 带 namespace 的用公式
    // 主要是用公式会严格点，不能出现奇怪的变量名
    try {
        return new amisFormula.Evaluator(data).evalute(amisFormula.parse(path, {
            variableMode: true,
            allowFilter: false
        }));
    }
    catch (e) {
        return undefined;
    }
}

exports.resolveVariable = resolveVariable;
