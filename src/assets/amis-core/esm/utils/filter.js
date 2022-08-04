/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __spreadArray } from 'tslib';
import { extendsFilters, filters } from 'amis-formula';
import moment from 'moment';
import { makeSorter } from './makeSorter.js';
import transform from 'lodash/transform';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import uniq from 'lodash/uniq';
import { pickValues, createObject } from './object.js';
import { string2regExp } from './string2regExp.js';
import { resolveVariable } from './resolveVariable.js';
import { escapeHtml } from './escapeHtml.js';
import { formatDuration } from './formatDuration.js';
import { prettyBytes } from './prettyBytes.js';
import { stripNumber } from './stripNumber.js';
import { filterDate } from './date.js';

function conditionalFilter(input, hasAlternate, filterContext, test, trueValue, falseValue) {
    var _a, _b, _c;
    (hasAlternate || test) && skipRestTest(filterContext.restFilters);
    var result = test ? trueValue : falseValue;
    var ast = test
        ? (_a = filterContext.filter) === null || _a === void 0 ? void 0 : _a.args[1]
        : (_b = filterContext.filter) === null || _b === void 0 ? void 0 : _b.args[2];
    return test || hasAlternate
        ? (_c = getStrOrVariable(result, filterContext.data, ast)) !== null && _c !== void 0 ? _c : result
        : input;
}
/**
 * 如果当前传入字符为：'xxx'或者"xxx"，则返回字符xxx
 * 否则去数据域中，获取变量xxx
 *
 * @param value 传入字符
 * @param data 数据域
 */
function getStrOrVariable(value, data, ast) {
    // 通过读取 ast 来判断，只有 literal 才可能是变量，也可能是字符串
    // 其他的直接返回值即可。
    if ((ast === null || ast === void 0 ? void 0 : ast.type) && ast.type !== 'literal') {
        return value;
    }
    return typeof value === 'string' && /,/.test(value)
        ? value.split(/\s*,\s*/).filter(function (item) { return item; })
        : typeof value === 'string'
            ? resolveVariable(value, data)
            : value;
}
function str2array(list) {
    if (list && typeof list === 'string') {
        if (/^\[.*\]$/.test(list)) {
            return list
                .substring(1, list.length - 1)
                .split(/\s*,\s*/)
                .filter(function (item) { return item; });
        }
        else {
            return list.split(/\s*,\s*/).filter(function (item) { return item; });
        }
    }
    return list;
}
function skipRestTest(restFilters) {
    var _a;
    while (~[
        'isTrue',
        'isFalse',
        'isMatch',
        'isEquals',
        'notMatch',
        'notEquals'
    ].indexOf((_a = restFilters[0]) === null || _a === void 0 ? void 0 : _a.name)) {
        restFilters.shift();
    }
}
extendsFilters({
    map: function (input, fn) {
        var _this = this;
        var arg = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            arg[_i - 2] = arguments[_i];
        }
        return Array.isArray(input) && filters[fn]
            ? input.map(function (item) {
                var _a;
                return (_a = filters[fn]).call.apply(_a, __spreadArray([_this, item], arg, false));
            })
            : input;
    },
    html: function (input) {
        if (input == null) {
            return input;
        }
        return escapeHtml(input);
    },
    json: function (input, tabSize) {
        if (tabSize === void 0) { tabSize = 2; }
        return tabSize
            ? JSON.stringify(input, null, parseInt(tabSize, 10))
            : JSON.stringify(input);
    },
    toJson: function (input) {
        var ret;
        try {
            ret = JSON.parse(input);
        }
        catch (e) {
            ret = null;
        }
        return ret;
    },
    toInt: function (input) { return (typeof input === 'string' ? parseInt(input, 10) : input); },
    toFloat: function (input) { return (typeof input === 'string' ? parseFloat(input) : input); },
    raw: function (input) { return input; },
    now: function () { return new Date(); },
    toDate: function (input, inputFormat) {
        if (inputFormat === void 0) { inputFormat = ''; }
        var date = moment(input, inputFormat);
        return date.isValid() ? date.toDate() : undefined;
    },
    fromNow: function (input, inputFormat) {
        if (inputFormat === void 0) { inputFormat = ''; }
        return moment(input, inputFormat).fromNow();
    },
    dateModify: function (input, modifier, amount, unit) {
        if (modifier === void 0) { modifier = 'add'; }
        if (amount === void 0) { amount = 0; }
        if (unit === void 0) { unit = 'days'; }
        if (!(input instanceof Date)) {
            input = new Date();
        }
        if (modifier === 'endOf' || modifier === 'startOf') {
            return moment(input)[modifier === 'endOf' ? 'endOf' : 'startOf'](amount || 'day')
                .toDate();
        }
        return moment(input)[modifier === 'add' ? 'add' : 'subtract'](parseInt(amount, 10) || 0, unit)
            .toDate();
    },
    date: function (input, format, inputFormat) {
        if (format === void 0) { format = 'LLL'; }
        if (inputFormat === void 0) { inputFormat = 'X'; }
        return moment(input, inputFormat).format(format);
    },
    number: function (input) {
        var parts = String(input).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    },
    trim: function (input) { return (typeof input === 'string' ? input.trim() : input); },
    percent: function (input, decimals) {
        if (decimals === void 0) { decimals = 0; }
        input = parseFloat(input) || 0;
        decimals = parseInt(decimals, 10) || 0;
        var whole = input * 100;
        var multiplier = Math.pow(10, decimals);
        return ((Math.round(whole * multiplier) / multiplier).toFixed(decimals) + '%');
    },
    duration: function (input) { return (input ? formatDuration(input) : input); },
    bytes: function (input) { return (input ? prettyBytes(parseFloat(input)) : input); },
    round: function (input, decimals) {
        var _a;
        if (decimals === void 0) { decimals = 2; }
        if (isNaN(input)) {
            return 0;
        }
        decimals = (_a = parseInt(decimals, 10)) !== null && _a !== void 0 ? _a : 2;
        var multiplier = Math.pow(10, decimals);
        return (Math.round(input * multiplier) / multiplier).toFixed(decimals);
    },
    truncate: function (input, length, end) {
        if (typeof input !== 'string') {
            return input;
        }
        end = end || '...';
        if (length == null) {
            return input;
        }
        length = parseInt(length, 10) || 200;
        return input.substring(0, length) + (input.length > length ? end : '');
    },
    url_encode: function (input) {
        if (input == null) {
            return '';
        }
        return encodeURIComponent(input);
    },
    url_decode: function (input) { return decodeURIComponent(input); },
    default: function (input, defaultValue, strict) {
        var _a;
        if (strict === void 0) { strict = false; }
        return (_a = (strict ? input : input ? input : undefined)) !== null && _a !== void 0 ? _a : (function () {
            try {
                if (defaultValue === 'undefined') {
                    return undefined;
                }
                return JSON.parse(defaultValue);
            }
            catch (e) {
                return defaultValue;
            }
        })();
    },
    join: function (input, glue) { return (input && input.join ? input.join(glue) : input); },
    split: function (input, delimiter) {
        if (delimiter === void 0) { delimiter = ','; }
        return typeof input === 'string' ? input.split(delimiter) : input;
    },
    sortBy: function (input, key, method, order) {
        if (key === void 0) { key = '&'; }
        if (method === void 0) { method = 'alpha'; }
        return Array.isArray(input) ? input.sort(makeSorter(key, method, order)) : input;
    },
    objectToArray: function (input, label, value) {
        if (label === void 0) { label = 'label'; }
        if (value === void 0) { value = 'value'; }
        return transform(input, function (result, v, k) {
            var _a;
            (result || (result = [])).push((_a = {},
                _a[label] = v,
                _a[value] = k,
                _a));
        }, []);
    },
    unique: function (input, key) {
        return Array.isArray(input) ? (key ? uniqBy(input, key) : uniq(input)) : input;
    },
    topAndOther: function (input, len, labelField, restLabel) {
        if (len === void 0) { len = 10; }
        if (labelField === void 0) { labelField = 'name'; }
        if (restLabel === void 0) { restLabel = '其他'; }
        if (Array.isArray(input) && len) {
            var grouped_1 = groupBy(input, function (item) {
                var index = input.indexOf(item) + 1;
                return index >= len ? len : index;
            });
            return Object.keys(grouped_1).map(function (key, index) {
                var group = grouped_1[key];
                var obj = group.reduce(function (obj, item) {
                    Object.keys(item).forEach(function (key) {
                        if (!obj.hasOwnProperty(key) || key === 'labelField') {
                            obj[key] = item[key];
                        }
                        else if (typeof item[key] === 'number' &&
                            typeof obj[key] === 'number') {
                            obj[key] += item[key];
                        }
                        else if (typeof item[key] === 'string' &&
                            /^(?:\-|\.)\d/.test(item[key]) &&
                            typeof obj[key] === 'number') {
                            obj[key] += parseFloat(item[key]) || 0;
                        }
                        else if (typeof item[key] === 'string' &&
                            typeof obj[key] === 'string') {
                            obj[key] += ", ".concat(item[key]);
                        }
                        else {
                            obj[key] = item[key];
                        }
                    });
                    return obj;
                }, {});
                if (index === len - 1) {
                    obj[labelField] = restLabel || '其他';
                }
                return obj;
            });
        }
        return input;
    },
    first: function (input) { return input && input[0]; },
    nth: function (input, nth) {
        if (nth === void 0) { nth = 0; }
        return input && input[nth];
    },
    last: function (input) { return input && (input.length ? input[input.length - 1] : null); },
    minus: function (input, step) {
        var _a;
        if (step === void 0) { step = 1; }
        return stripNumber((Number(input) || 0) -
            Number(getStrOrVariable(step, this.data, (_a = this.filter) === null || _a === void 0 ? void 0 : _a.args[0])));
    },
    plus: function (input, step) {
        var _a;
        if (step === void 0) { step = 1; }
        return stripNumber((Number(input) || 0) +
            Number(getStrOrVariable(step, this.data, (_a = this.filter) === null || _a === void 0 ? void 0 : _a.args[0])));
    },
    times: function (input, step) {
        var _a;
        if (step === void 0) { step = 1; }
        return stripNumber((Number(input) || 0) *
            Number(getStrOrVariable(step, this.data, (_a = this.filter) === null || _a === void 0 ? void 0 : _a.args[0])));
    },
    division: function (input, step) {
        var _a;
        if (step === void 0) { step = 1; }
        return stripNumber((Number(input) || 0) /
            Number(getStrOrVariable(step, this.data, (_a = this.filter) === null || _a === void 0 ? void 0 : _a.args[0])));
    },
    count: function (input) {
        return Array.isArray(input) || typeof input === 'string' ? input.length : 0;
    },
    sum: function (input, field) {
        if (!Array.isArray(input)) {
            return input;
        }
        var restult = input.reduce(function (sum, item) {
            return sum + (parseFloat(field ? pickValues(field, item) : item) || 0);
        }, 0);
        return stripNumber(restult);
    },
    abs: function (input) { return (typeof input === 'number' ? Math.abs(input) : input); },
    pick: function (input, path) {
        if (path === void 0) { path = '&'; }
        return Array.isArray(input) && !/^\d+$/.test(path)
            ? input.map(function (item, index) {
                return pickValues(path, createObject({ index: index }, item));
            })
            : pickValues(path, input);
    },
    pick_if_exist: function (input, path) {
        if (path === void 0) { path = '&'; }
        return Array.isArray(input)
            ? input.map(function (item) { return resolveVariable(path, item) || item; })
            : resolveVariable(path, input) || input;
    },
    str2date: function (input, inputFormat, outputFormat) {
        if (inputFormat === void 0) { inputFormat = 'X'; }
        if (outputFormat === void 0) { outputFormat = 'X'; }
        return input
            ? filterDate(input, this.data, inputFormat).format(outputFormat)
            : '';
    },
    asArray: function (input) { return (Array.isArray(input) ? input : input ? [input] : input); },
    concat: function (input) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return Array.isArray(input)
            ? input.concat.apply(input, args.map(function (arg, index) { var _a; return getStrOrVariable(arg, _this.data, (_a = _this.filter) === null || _a === void 0 ? void 0 : _a.args[index]); })) : input;
    },
    filter: function (input, keys, expOrDirective, arg1) {
        var _a, _b, _c, _d;
        if (!Array.isArray(input) || !keys || !expOrDirective) {
            return input;
        }
        var directive = expOrDirective;
        var fn = function () { return true; };
        if (directive === 'isTrue') {
            fn = function (value) { return !!value; };
        }
        else if (directive === 'isFalse') {
            fn = function (value) { return !value; };
        }
        else if (directive === 'isExists') {
            fn = function (value) { return typeof value !== 'undefined'; };
        }
        else if (directive === 'equals' || directive === 'equal') {
            arg1 = arg1
                ? getStrOrVariable(arg1, this.data, (_a = this.filter) === null || _a === void 0 ? void 0 : _a.args[2])
                : '';
            fn = function (value) { return arg1 == value; };
        }
        else if (directive === 'isIn') {
            var list_1 = arg1
                ? getStrOrVariable(arg1, this.data, (_b = this.filter) === null || _b === void 0 ? void 0 : _b.args[2])
                : [];
            list_1 = str2array(list_1);
            list_1 = Array.isArray(list_1) ? list_1 : list_1 ? [list_1] : [];
            fn = function (value) { return (list_1.length ? !!~list_1.indexOf(value) : true); };
        }
        else if (directive === 'notIn') {
            var list_2 = arg1
                ? getStrOrVariable(arg1, this.data, (_c = this.filter) === null || _c === void 0 ? void 0 : _c.args[2])
                : [];
            list_2 = str2array(list_2);
            list_2 = Array.isArray(list_2) ? list_2 : list_2 ? [list_2] : [];
            fn = function (value) { return !~list_2.indexOf(value); };
        }
        else {
            if (directive !== 'match') {
                directive = 'match';
                arg1 = expOrDirective;
            }
            arg1 = arg1
                ? getStrOrVariable(arg1, this.data, (_d = this.filter) === null || _d === void 0 ? void 0 : _d.args[2])
                : '';
            // 比对的值是空时直接返回。
            if (!arg1) {
                return input;
            }
            var reg_1 = string2regExp("".concat(arg1), false);
            fn = function (value) { return reg_1.test(String(value)); };
        }
        // 判断keys是否为*
        var isAsterisk = /\s*\*\s*/.test(keys);
        keys = keys.split(/\s*,\s*/);
        return input.filter(function (item) {
            // 当keys为*时从item中获取key
            return (isAsterisk ? Object.keys(item) : keys).some(function (key) {
                return fn(resolveVariable(key, item), key, item);
            });
        });
    },
    base64Encode: function (str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
            return String.fromCharCode(('0x' + p1));
        }));
    },
    base64Decode: function (str) {
        return decodeURIComponent(atob(str)
            .split('')
            .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
            .join(''));
    },
    substring: function (input, start, end) {
        return input && typeof input === 'string'
            ? input.substring(start, end)
            : input;
    },
    lowerCase: function (input) {
        return input && typeof input === 'string' ? input.toLowerCase() : input;
    },
    upperCase: function (input) {
        return input && typeof input === 'string' ? input.toUpperCase() : input;
    },
    isTrue: function (input, trueValue, falseValue) {
        var hasAlternate = arguments.length > 2;
        return conditionalFilter(input, hasAlternate, this, !!input, trueValue, falseValue);
    },
    isFalse: function (input, trueValue, falseValue) {
        var hasAlternate = arguments.length > 2;
        return conditionalFilter(input, hasAlternate, this, !input, trueValue, falseValue);
    },
    isMatch: function (input, matchArg, trueValue, falseValue) {
        var _a, _b;
        var hasAlternate = arguments.length > 3;
        matchArg =
            (_b = getStrOrVariable(matchArg, this.data, (_a = this.filter) === null || _a === void 0 ? void 0 : _a.args[0])) !== null && _b !== void 0 ? _b : matchArg;
        return conditionalFilter(input, hasAlternate, this, matchArg && string2regExp("".concat(matchArg), false).test(String(input)), trueValue, falseValue);
    },
    notMatch: function (input, matchArg, trueValue, falseValue) {
        var _a, _b;
        var hasAlternate = arguments.length > 3;
        matchArg =
            (_b = getStrOrVariable(matchArg, this.data, (_a = this.filter) === null || _a === void 0 ? void 0 : _a.args[0])) !== null && _b !== void 0 ? _b : matchArg;
        return conditionalFilter(input, hasAlternate, this, matchArg && !string2regExp("".concat(matchArg), false).test(String(input)), trueValue, falseValue);
    },
    isEquals: function (input, equalsValue, trueValue, falseValue) {
        var _a, _b;
        equalsValue =
            (_b = getStrOrVariable(equalsValue, this.data, (_a = this.filter) === null || _a === void 0 ? void 0 : _a.args[0])) !== null && _b !== void 0 ? _b : equalsValue;
        var hasAlternate = arguments.length > 3;
        return conditionalFilter(input, hasAlternate, this, input === equalsValue, trueValue, falseValue);
    },
    notEquals: function (input, equalsValue, trueValue, falseValue) {
        var _a, _b;
        equalsValue =
            (_b = getStrOrVariable(equalsValue, this.data, (_a = this.filter) === null || _a === void 0 ? void 0 : _a.args[0])) !== null && _b !== void 0 ? _b : equalsValue;
        var hasAlternate = arguments.length > 3;
        return conditionalFilter(input, hasAlternate, this, input !== equalsValue, trueValue, falseValue);
    }
});
