/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var amisFormula = require('amis-formula');
require('moment');
require('tslib');
require('lodash/isPlainObject');
var tokenize = require('./tokenize.js');
require('./filter.js');

function matchSynatax(str) {
    var from = 0;
    while (true) {
        var idx = str.indexOf('$', from);
        if (~idx) {
            var nextToken = str[idx + 1];
            // 如果没有下一个字符，或者下一个字符是引号或者空格
            // 这个一般不是取值用法
            if (!nextToken || ~['"', "'", ' '].indexOf(nextToken)) {
                from = idx + 1;
                continue;
            }
            // 如果上个字符是转义也不是取值用法
            var prevToken = str[idx - 1];
            if (prevToken && prevToken === '\\') {
                from = idx + 1;
                continue;
            }
            return true;
        }
        else {
            break;
        }
    }
    return false;
}
function register() {
    return {
        name: 'builtin',
        test: function (str) { return typeof str === 'string' && matchSynatax(str); },
        removeEscapeToken: function (str) {
            return typeof str === 'string' ? str.replace(/\\\$/g, '$') : str;
        },
        compile: function (str, data, defaultFilter) {
            if (defaultFilter === void 0) { defaultFilter = '| html'; }
            try {
                return tokenize.tokenize(str, data, defaultFilter);
            }
            catch (e) {
                return "error: ".concat(e.message);
            }
        }
    };
}

Object.defineProperty(exports, 'getFilters', {
    enumerable: true,
    get: function () { return amisFormula.getFilters; }
});
Object.defineProperty(exports, 'registerFilter', {
    enumerable: true,
    get: function () { return amisFormula.registerFilter; }
});
exports.tokenize = tokenize.tokenize;
exports.register = register;
