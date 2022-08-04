/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var template = require('lodash/template');
var amisFormula = require('amis-formula');
var moment = require('moment');
require('lodash/isPlainObject');
require('./filter.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var template__default = /*#__PURE__*/_interopDefaultLegacy(template);
var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);

var imports = {
    default: undefined,
    moment: moment__default["default"],
    countDown: function (end) {
        if (!end) {
            return '--';
        }
        var date = new Date(parseInt(end, 10) * 1000);
        var now = Date.now();
        if (date.getTime() < now) {
            return '已结束';
        }
        return Math.ceil((date.getTime() - now) / (1000 * 60 * 60 * 24)) + '天';
    },
    formatDate: function (value, format, inputFormat) {
        if (format === void 0) { format = 'LLL'; }
        if (inputFormat === void 0) { inputFormat = ''; }
        return moment__default["default"](value, inputFormat).format(format);
    }
};
// 缓存一下提升性能
var EVAL_CACHE = {};
function lodashCompile(str, data) {
    try {
        var filters = amisFormula.getFilters();
        var finnalImports = tslib.__assign(tslib.__assign(tslib.__assign({}, filters), { formatTimeStamp: filters.date, formatNumber: filters.number, defaultValue: filters.defaut }), imports);
        delete finnalImports.default; // default 是个关键字，不能 imports 到 lodash 里面去。
        var fn = EVAL_CACHE[str] ||
            (EVAL_CACHE[str] = template__default["default"](str, {
                imports: finnalImports,
                variable: 'data',
                // 如果不传这个，默认模板语法也存在 ${xxx} 语法，这个跟内置语法规则冲突。
                // 为了不带来困惑，禁用掉这种用法。
                interpolate: /<%=([\s\S]+?)%>/g
            }));
        return fn.call(data, data);
    }
    catch (e) {
        return "<span class=\"text-danger\">".concat(e.message, "</span>");
    }
}
function register() {
    return {
        name: 'lodash',
        test: function (str) { return !!~str.indexOf('<%'); },
        compile: function (str, data) { return lodashCompile(str, data); }
    };
}

exports.register = register;
