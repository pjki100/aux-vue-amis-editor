/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import find from 'lodash/find';
import findIndex from 'lodash/findIndex';

var SimpleMap = /** @class */ (function () {
    function SimpleMap() {
        this.list = [];
    }
    SimpleMap.prototype.has = function (key) {
        var resolved = find(this.list, function (item) { return item.key === key; });
        return !!resolved;
    };
    SimpleMap.prototype.set = function (key, value) {
        this.list.push({
            key: key,
            value: value
        });
    };
    SimpleMap.prototype.get = function (key) {
        var resolved = find(this.list, function (item) { return item.key === key; });
        return resolved ? resolved.value : null;
    };
    SimpleMap.prototype.delete = function (key) {
        var idx = findIndex(this.list, function (item) { return item.key === key; });
        ~idx && this.list.splice(idx, 1);
    };
    SimpleMap.prototype.dispose = function () {
        this.list.splice(0, this.list.length);
    };
    return SimpleMap;
}());

export { SimpleMap };
