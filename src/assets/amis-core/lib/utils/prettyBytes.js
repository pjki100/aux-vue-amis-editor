/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
var prettyBytes = function (num) {
    if (!Number.isFinite(num)) {
        throw new TypeError("Expected a finite number, got ".concat(typeof num, ": ").concat(num));
    }
    var neg = num < 0;
    if (neg) {
        num = -num;
    }
    if (num < 1) {
        return (neg ? '-' : '') + num + ' B';
    }
    var exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), UNITS.length - 1);
    var numStr = Number((num / Math.pow(1000, exponent)).toPrecision(3));
    var unit = UNITS[exponent];
    return (neg ? '-' : '') + numStr + ' ' + unit;
};

exports.prettyBytes = prettyBytes;
