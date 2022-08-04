/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var isPureVariable = require('./isPureVariable.js');
var resolveVariableAndFilter = require('./resolveVariableAndFilter.js');
var tokenize = require('./tokenize.js');
var isPlainObject = require('lodash/isPlainObject');
var object = require('./object.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject);

function resolveMapping(value, data, defaultFilter) {
    if (defaultFilter === void 0) { defaultFilter = '| raw'; }
    return typeof value === 'string' && isPureVariable.isPureVariable(value)
        ? resolveVariableAndFilter.resolveVariableAndFilter(value, data, defaultFilter, function () { return ''; })
        : typeof value === 'string' && ~value.indexOf('$')
            ? tokenize.tokenize(value, data, defaultFilter)
            : value;
}
/**
 * 遍历对象，对每个字符串 key 进行数据映射
 * @param value 要映射的对象
 * @param data 数据上下文
 */
function resolveMappingObject(value, data) {
    for (var _i = 0, _a = Object.keys(value); _i < _a.length; _i++) {
        var key = _a[_i];
        if (typeof value[key] === 'string') {
            value[key] = resolveMapping(value[key], data);
        }
    }
    return value;
}
function dataMapping(to, from, ignoreFunction, convertKeyToPath) {
    if (from === void 0) { from = {}; }
    if (ignoreFunction === void 0) { ignoreFunction = false; }
    if (Array.isArray(to)) {
        return to.map(function (item) {
            return dataMapping(item, from, ignoreFunction, convertKeyToPath);
        });
    }
    else if (typeof to === 'string') {
        return resolveMapping(to, from);
    }
    else if (!isPlainObject__default["default"](to)) {
        return to;
    }
    var ret = {};
    Object.keys(to).forEach(function (key) {
        var value = to[key];
        var keys;
        if (typeof ignoreFunction === 'function' && ignoreFunction(key, value)) {
            // 如果被ignore，不做数据映射处理。
            object.setVariable(ret, key, value, convertKeyToPath);
        }
        else if (key === '&' && value === '$$') {
            ret = tslib.__assign(tslib.__assign({}, ret), from);
        }
        else if (key === '&') {
            var v = isPlainObject__default["default"](value) &&
                (keys = Object.keys(value)) &&
                keys.length === 1 &&
                from[keys[0].substring(1)] &&
                Array.isArray(from[keys[0].substring(1)])
                ? from[keys[0].substring(1)].map(function (raw) {
                    return dataMapping(value[keys[0]], object.createObject(from, raw), ignoreFunction, convertKeyToPath);
                })
                : resolveMapping(value, from);
            if (Array.isArray(v) || typeof v === 'string') {
                ret = v;
            }
            else if (typeof v === 'function') {
                ret = tslib.__assign(tslib.__assign({}, ret), v(from));
            }
            else {
                ret = tslib.__assign(tslib.__assign({}, ret), v);
            }
        }
        else if (value === '$$') {
            object.setVariable(ret, key, from, convertKeyToPath);
        }
        else if (value && value[0] === '$') {
            var v = resolveMapping(value, from);
            object.setVariable(ret, key, v, convertKeyToPath);
            if (v === '__undefined') {
                object.deleteVariable(ret, key);
            }
        }
        else if (isPlainObject__default["default"](value) &&
            (keys = Object.keys(value)) &&
            keys.length === 1 &&
            keys[0][0] === '$' &&
            isPlainObject__default["default"](value[keys[0]])) {
            // from[keys[0].substring(1)] &&
            // Array.isArray(from[keys[0].substring(1)])
            // 支持只取数组中的部分值这个需求
            // 如:
            // data: {
            //   items: {
            //     '$rows': {
            //        id: '$id',
            //        forum_id: '$forum_id'
            //      }
            //   }
            // }
            var arr = Array.isArray(from[keys[0].substring(1)])
                ? from[keys[0].substring(1)]
                : [];
            var mapping_1 = value[keys[0]];
            ret[key] = arr.map(function (raw) {
                return dataMapping(mapping_1, object.createObject(from, raw), ignoreFunction, convertKeyToPath);
            });
        }
        else if (isPlainObject__default["default"](value)) {
            object.setVariable(ret, key, dataMapping(value, from, ignoreFunction, convertKeyToPath), convertKeyToPath);
        }
        else if (Array.isArray(value)) {
            object.setVariable(ret, key, value.map(function (value) {
                return isPlainObject__default["default"](value)
                    ? dataMapping(value, from, ignoreFunction, convertKeyToPath)
                    : resolveMapping(value, from);
            }), convertKeyToPath);
        }
        else if (typeof value == 'string' && ~value.indexOf('$')) {
            object.setVariable(ret, key, resolveMapping(value, from), convertKeyToPath);
        }
        else if (typeof value === 'function' && ignoreFunction !== true) {
            object.setVariable(ret, key, value(from), convertKeyToPath);
        }
        else {
            object.setVariable(ret, key, value, convertKeyToPath);
            if (value === '__undefined') {
                object.deleteVariable(ret, key);
            }
        }
    });
    return ret;
}

exports.dataMapping = dataMapping;
exports.resolveMapping = resolveMapping;
exports.resolveMappingObject = resolveMappingObject;
