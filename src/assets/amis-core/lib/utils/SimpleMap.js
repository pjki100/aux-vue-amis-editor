/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var find = require('lodash/find');
var findIndex = require('lodash/findIndex');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var find__default = /*#__PURE__*/_interopDefaultLegacy(find);
var findIndex__default = /*#__PURE__*/_interopDefaultLegacy(findIndex);

var SimpleMap = /** @class */ (function () {
    function SimpleMap() {
        this.list = [];
    }
    SimpleMap.prototype.has = function (key) {
        var resolved = find__default["default"](this.list, function (item) { return item.key === key; });
        return !!resolved;
    };
    SimpleMap.prototype.set = function (key, value) {
        this.list.push({
            key: key,
            value: value
        });
    };
    SimpleMap.prototype.get = function (key) {
        var resolved = find__default["default"](this.list, function (item) { return item.key === key; });
        return resolved ? resolved.value : null;
    };
    SimpleMap.prototype.delete = function (key) {
        var idx = findIndex__default["default"](this.list, function (item) { return item.key === key; });
        ~idx && this.list.splice(idx, 1);
    };
    SimpleMap.prototype.dispose = function () {
        this.list.splice(0, this.list.length);
    };
    return SimpleMap;
}());

exports.SimpleMap = SimpleMap;
