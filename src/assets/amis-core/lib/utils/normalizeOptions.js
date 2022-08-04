/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var isPlainObject = require('lodash/isPlainObject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject);

function normalizeOptions(options, share, valueField) {
    if (share === void 0) { share = {
        values: [],
        options: []
    }; }
    if (valueField === void 0) { valueField = 'value'; }
    if (typeof options === 'string') {
        return options.split(',').map(function (item) {
            var idx = share.values.indexOf(item);
            if (~idx) {
                return share.options[idx];
            }
            var option = {
                label: item,
                value: item
            };
            share.values.push(option.value);
            share.options.push(option);
            return option;
        });
    }
    else if (Array.isArray(options) &&
        typeof options[0] === 'string') {
        return options.map(function (item) {
            var idx = share.values.indexOf(item);
            if (~idx) {
                return share.options[idx];
            }
            var option = {
                label: item,
                value: item
            };
            share.values.push(option.value);
            share.options.push(option);
            return option;
        });
    }
    else if (Array.isArray(options)) {
        return options.map(function (item) {
            var value = item && item[valueField];
            var idx = value !== undefined && !item.children
                ? share.values.indexOf(value)
                : -1;
            if (~idx) {
                return share.options[idx];
            }
            var option = tslib.__assign(tslib.__assign({}, item), { value: value });
            if (typeof option.children !== 'undefined') {
                option.children = normalizeOptions(option.children, share, valueField);
            }
            else if (value !== undefined) {
                share.values.push(value);
                share.options.push(option);
            }
            return option;
        });
    }
    else if (isPlainObject__default["default"](options)) {
        return Object.keys(options).map(function (key) {
            var idx = share.values.indexOf(key);
            if (~idx) {
                return share.options[idx];
            }
            var option = {
                label: options[key],
                value: key
            };
            share.values.push(option.value);
            share.options.push(option);
            return option;
        });
    }
    return [];
}

exports.normalizeOptions = normalizeOptions;
