/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var memoize = require('lodash/memoize');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var memoize__default = /*#__PURE__*/_interopDefaultLegacy(memoize);

/**
 * @file image 相关的工具
 * @param url
 */
/**
 * 将 url 转成 dataurl
 * @param url
 */
var toDataURL = memoize__default["default"](function (url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = reject;
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    });
});
/**
 * 根据 url 获取图片尺寸
 * @param url
 */
var getImageDimensions = memoize__default["default"](function (url) {
    return new Promise(function (resolved, rejected) {
        var i = new Image();
        i.onerror = rejected;
        i.onload = function () {
            resolved({ width: i.width, height: i.height });
        };
        i.src = url;
    });
});

exports.getImageDimensions = getImageDimensions;
exports.toDataURL = toDataURL;
