/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { parse } from 'amis-formula';

/**
 * @file 公式语法解析
 */
function traverseAst(ast, iterator) {
    if (!ast || !ast.type) {
        return;
    }
    iterator(ast);
    Object.keys(ast).forEach(function (key) {
        var value = ast[key];
        if (Array.isArray(value)) {
            value.forEach(function (child) { return traverseAst(child, iterator); });
        }
        else {
            traverseAst(value, iterator);
        }
    });
}
// 缓存，用于提升性能
var COLLECT_EXPRESSION_CACHE = {};
// 提取表达式中有哪些变量
function collectVariables(strOrAst, execMode) {
    var variables = [];
    if (typeof strOrAst === 'string' && COLLECT_EXPRESSION_CACHE[strOrAst]) {
        return COLLECT_EXPRESSION_CACHE[strOrAst];
    }
    var ast = typeof strOrAst === 'string'
        ? parse(strOrAst, {
            evalMode: execMode !== null && execMode !== void 0 ? execMode : false
        })
        : strOrAst;
    traverseAst(ast, function (item) {
        if (item.type === 'variable') {
            variables.push(item.name);
        }
    });
    if (typeof strOrAst === 'string') {
        COLLECT_EXPRESSION_CACHE[strOrAst] = variables;
    }
    return variables;
}

export { collectVariables };
