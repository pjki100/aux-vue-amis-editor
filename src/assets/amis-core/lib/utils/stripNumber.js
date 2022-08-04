/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// 主要用于解决 0.1+0.2 结果的精度问题导致太长
function stripNumber(number) {
    if (typeof number === 'number') {
        return parseFloat(number.toPrecision(12));
    }
    else {
        return number;
    }
}

exports.stripNumber = stripNumber;
