/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { JSONTraverse } from './helper.js';
import { isObject } from './object.js';

/**
 * 对文本进行替换
 */
function replaceText(schema, replaceText, replaceTextIgnoreKeys) {
    // 进行文本替换
    if (replaceText && isObject(replaceText)) {
        var replaceKeys_1 = Object.keys(replaceText);
        replaceKeys_1.sort(function (a, b) { return b.length - a.length; }); // 避免用户将短的放前面
        var IgnoreKeys_1 = new Set(replaceTextIgnoreKeys || []);
        JSONTraverse(schema, function (value, key, object) {
            if (typeof value === 'string' && !IgnoreKeys_1.has(key)) {
                for (var _i = 0, replaceKeys_2 = replaceKeys_1; _i < replaceKeys_2.length; _i++) {
                    var replaceKey = replaceKeys_2[_i];
                    if (~value.indexOf(replaceKey)) {
                        value = object[key] = value.replaceAll(replaceKey, replaceText[replaceKey]);
                    }
                }
            }
        });
    }
}

export { replaceText };
