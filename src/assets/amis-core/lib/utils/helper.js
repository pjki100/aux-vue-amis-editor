/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var isPlainObject = require('lodash/isPlainObject');
var isEqual = require('lodash/isEqual');
var isNaN = require('lodash/isNaN');
var uniq = require('lodash/uniq');
var last = require('lodash/last');
var tpl = require('./tpl.js');
var qs = require('qs');
var autobind$1 = require('./autobind.js');
require('amis-formula');
require('moment');
var object = require('./object.js');
var isPureVariable = require('./isPureVariable.js');
var resolveVariable = require('./resolveVariable.js');
var resolveVariableAndFilter = require('./resolveVariableAndFilter.js');
require('./filter.js');
var mobx = require('mobx');
var string2regExp = require('./string2regExp.js');
var getVariable = require('./getVariable.js');
var keyToPath = require('./keyToPath.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject);
var isEqual__default = /*#__PURE__*/_interopDefaultLegacy(isEqual);
var isNaN__default = /*#__PURE__*/_interopDefaultLegacy(isNaN);
var uniq__default = /*#__PURE__*/_interopDefaultLegacy(uniq);
var last__default = /*#__PURE__*/_interopDefaultLegacy(last);
var qs__default = /*#__PURE__*/_interopDefaultLegacy(qs);

function preventDefault(event) {
    if (typeof event.cancelable !== 'boolean' || event.cancelable) {
        event.preventDefault();
    }
}
function isMobile() {
    var _a, _b;
    return (_b = (_a = window).matchMedia) === null || _b === void 0 ? void 0 : _b.call(_a, '(max-width: 768px)').matches;
}
function range(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
/**
 * 给目标对象添加其他属性，可读取但是不会被遍历。
 * @param target
 * @param props
 */
function injectPropsToObject(target, props) {
    var sup = Object.create(target.__super || null);
    Object.keys(props).forEach(function (key) { return (sup[key] = props[key]); });
    var result = Object.create(sup);
    Object.keys(target).forEach(function (key) { return (result[key] = target[key]); });
    return result;
}
function isSuperDataModified(data, prevData, store) {
    var keys = [];
    if (store && store.storeType === 'FormStore') {
        keys = uniq__default["default"](store.items
            .map(function (item) { return "".concat(item.name).replace(/\..*$/, ''); })
            .concat(Object.keys(store.data)));
    }
    else {
        keys = Object.keys(store.data);
    }
    if (Array.isArray(keys) && keys.length) {
        return keys.some(function (key) { return data[key] !== prevData[key]; });
    }
    return false;
}
function syncDataFromSuper(data, superObject, prevSuperObject, store, force) {
    var obj = tslib.__assign({}, data);
    var keys = [];
    // 如果是 form store，则从父级同步 formItem 种东西。
    if (store && store.storeType === 'FormStore') {
        keys = uniq__default["default"](store.items
            .map(function (item) { return "".concat(item.name).replace(/\..*$/, ''); })
            .concat(Object.keys(obj)));
    }
    else if (force) {
        keys = Object.keys(obj);
    }
    if (superObject || prevSuperObject) {
        keys.forEach(function (key) {
            if (!key) {
                return;
            }
            if (((superObject && typeof superObject[key] !== 'undefined') ||
                (prevSuperObject && typeof prevSuperObject[key] !== 'undefined')) &&
                ((prevSuperObject && !superObject) ||
                    (!prevSuperObject && superObject) ||
                    prevSuperObject[key] !== superObject[key])) {
                obj[key] = superObject[key];
            }
        });
    }
    return obj;
}
/**
 * 生成 8 位随机数字。
 *
 * @return {string} 8位随机数字
 */
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4();
}
function findIndex(arr, detect) {
    for (var i = 0, len = arr.length; i < len; i++) {
        if (detect(arr[i], i)) {
            return i;
        }
    }
    return -1;
}
function hasOwnPropertyInPath(data, key) {
    var parts = keyToPath.keyToPath(key);
    while (parts.length) {
        var key_1 = parts.shift();
        if (!object.isObject(data) || !data.hasOwnProperty(key_1)) {
            return false;
        }
        data = data[key_1];
    }
    return true;
}
function noop() { }
function anyChanged(attrs, from, to, strictMode) {
    if (strictMode === void 0) { strictMode = true; }
    return (typeof attrs === 'string' ? attrs.split(/\s*,\s*/) : attrs).some(function (key) { return (strictMode ? from[key] !== to[key] : from[key] != to[key]); });
}
function rmUndefined(obj) {
    var newObj = {};
    if (typeof obj !== 'object') {
        return obj;
    }
    var keys = Object.keys(obj);
    keys.forEach(function (key) {
        if (obj[key] !== undefined) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
}
function isObjectShallowModified(prev, next, strictMode, ignoreUndefined, statck) {
    if (strictMode === void 0) { strictMode = true; }
    if (ignoreUndefined === void 0) { ignoreUndefined = false; }
    if (statck === void 0) { statck = []; }
    if (Array.isArray(prev) && Array.isArray(next)) {
        return prev.length !== next.length
            ? true
            : prev.some(function (prev, index) {
                return isObjectShallowModified(prev, next[index], strictMode, ignoreUndefined, statck);
            });
    }
    else if (isNaN__default["default"](prev) && isNaN__default["default"](next)) {
        return false;
    }
    else if (null == prev ||
        null == next ||
        !object.isObject(prev) ||
        !object.isObject(next) ||
        mobx.isObservable(prev) ||
        mobx.isObservable(next)) {
        return strictMode ? prev !== next : prev != next;
    }
    if (ignoreUndefined) {
        prev = rmUndefined(prev);
        next = rmUndefined(next);
    }
    var keys = Object.keys(prev);
    var nextKeys = Object.keys(next);
    if (keys.length !== nextKeys.length ||
        keys.sort().join(',') !== nextKeys.sort().join(',')) {
        return true;
    }
    // 避免循环引用死循环。
    if (~statck.indexOf(prev)) {
        return false;
    }
    statck.push(prev);
    for (var i = keys.length - 1; i >= 0; i--) {
        var key = keys[i];
        if (isObjectShallowModified(prev[key], next[key], strictMode, ignoreUndefined, statck)) {
            return true;
        }
    }
    return false;
}
function isArrayChildrenModified(prev, next, strictMode) {
    if (strictMode === void 0) { strictMode = true; }
    if (!Array.isArray(prev) || !Array.isArray(next)) {
        return strictMode ? prev !== next : prev != next;
    }
    if (prev.length !== next.length) {
        return true;
    }
    for (var i = prev.length - 1; i >= 0; i--) {
        if (strictMode ? prev[i] !== next[i] : prev[i] != next[i]) {
            return true;
        }
    }
    return false;
}
function immutableExtends(to, from, deep) {
    // 不是对象，不可以merge
    if (!object.isObject(to) || !object.isObject(from)) {
        return to;
    }
    var ret = to;
    Object.keys(from).forEach(function (key) {
        var origin = to[key];
        var value = from[key];
        // todo 支持深度merge
        if (origin !== value) {
            // 一旦有修改，就创建个新对象。
            ret = ret !== to ? ret : tslib.__assign({}, to);
            ret[key] = value;
        }
    });
    return ret;
}
// 即将抛弃
function makeColumnClassBuild(steps, classNameTpl) {
    if (classNameTpl === void 0) { classNameTpl = 'col-sm-$value'; }
    var count = 12;
    var step = Math.floor(count / steps);
    return function (schema) {
        if (schema.columnClassName &&
            /\bcol-(?:xs|sm|md|lg)-(\d+)\b/.test(schema.columnClassName)) {
            var flex = parseInt(RegExp.$1, 10);
            count -= flex;
            steps--;
            step = Math.floor(count / steps);
            return schema.columnClassName;
        }
        else if (schema.columnClassName) {
            count -= step;
            steps--;
            return schema.columnClassName;
        }
        count -= step;
        steps--;
        return classNameTpl.replace('$value', '' + step);
    };
}
function hasVisibleExpression(schema) {
    return (schema === null || schema === void 0 ? void 0 : schema.visibleOn) || (schema === null || schema === void 0 ? void 0 : schema.hiddenOn);
}
function isVisible(schema, data) {
    return !(schema.hidden ||
        schema.visible === false ||
        (schema.hiddenOn && tpl.evalExpression(schema.hiddenOn, data) === true) ||
        (schema.visibleOn && tpl.evalExpression(schema.visibleOn, data) === false));
}
function isUnfolded(node, config) {
    var foldedField = config.foldedField, unfoldedField = config.unfoldedField;
    unfoldedField = unfoldedField || 'unfolded';
    foldedField = foldedField || 'folded';
    var ret = false;
    if (unfoldedField && typeof node[unfoldedField] !== 'undefined') {
        ret = !!node[unfoldedField];
    }
    else if (foldedField && typeof node[foldedField] !== 'undefined') {
        ret = !node[foldedField];
    }
    return ret;
}
/**
 * 过滤掉被隐藏的数组元素
 */
function visibilityFilter(items, data) {
    return items.filter(function (item) {
        return isVisible(item, data);
    });
}
function isDisabled(schema, data) {
    return (schema.disabled ||
        (schema.disabledOn && tpl.evalExpression(schema.disabledOn, data)));
}
function hasAbility(schema, ability, data, defaultValue) {
    if (defaultValue === void 0) { defaultValue = true; }
    return schema.hasOwnProperty(ability)
        ? schema[ability]
        : schema.hasOwnProperty("".concat(ability, "On"))
            ? tpl.evalExpression(schema["".concat(ability, "On")], data || schema)
            : defaultValue;
}
function makeHorizontalDeeper(horizontal, count) {
    if (count > 1 && /\bcol-(xs|sm|md|lg)-(\d+)\b/.test(horizontal.left)) {
        var flex = parseInt(RegExp.$2, 10) * count;
        return {
            leftFixed: horizontal.leftFixed,
            left: flex,
            right: 12 - flex,
            offset: flex
        };
    }
    else if (count > 1 && typeof horizontal.left === 'number') {
        var flex = horizontal.left * count;
        return {
            leftFixed: horizontal.leftFixed,
            left: flex,
            right: 12 - flex,
            offset: flex
        };
    }
    return horizontal;
}
function promisify(fn) {
    var promisified = function () {
        try {
            var ret_1 = fn.apply(null, arguments);
            if (ret_1 && ret_1.then) {
                return ret_1;
            }
            else if (typeof ret_1 === 'function') {
                // thunk support
                return new Promise(function (resolve, reject) {
                    return ret_1(function (error, value) {
                        return error ? reject(error) : resolve(value);
                    });
                });
            }
            return Promise.resolve(ret_1);
        }
        catch (e) {
            return Promise.reject(e);
        }
    };
    promisified.raw = fn;
    return promisified;
}
/**
 *
 * @param node 当前元素
 * @param compute 自定义计算，找到的父元素是否满足特殊场景
 * @returns 返回控制当前元素滚动的父元素
 */
function getScrollParent(node, compute) {
    if (compute === void 0) { compute = function () { return true; }; }
    if (node == null) {
        return null;
    }
    var style = getComputedStyle(node);
    if (!style) {
        return null;
    }
    var text = style.getPropertyValue('overflow') +
        style.getPropertyValue('overflow-x') +
        style.getPropertyValue('overflow-y');
    if (node.nodeName === 'BODY' || (/auto|scroll/.test(text) && compute(node))) {
        return node;
    }
    return getScrollParent(node.parentNode, compute);
}
/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference(object$1, base, keepProps) {
    function changes(object$1, base) {
        if (object.isObject(object$1) && object.isObject(base)) {
            var keys = uniq__default["default"](Object.keys(object$1).concat(Object.keys(base)));
            var result_1 = {};
            keys.forEach(function (key) {
                var a = object$1[key];
                var b = base[key];
                if (keepProps && ~keepProps.indexOf(key)) {
                    result_1[key] = a;
                }
                if (isEqual__default["default"](a, b)) {
                    return;
                }
                if (!object$1.hasOwnProperty(key)) {
                    result_1[key] = undefined;
                }
                else if (Array.isArray(a) && Array.isArray(b)) {
                    result_1[key] = a;
                }
                else {
                    result_1[key] = changes(a, b);
                }
            });
            return result_1;
        }
        else {
            return object$1;
        }
    }
    return changes(object$1, base);
}
var padArr = function (arr, size) {
    if (size === void 0) { size = 4; }
    var ret = [];
    var pool = arr.concat();
    var from = 0;
    while (pool.length) {
        var host = ret[from] || (ret[from] = []);
        if (host.length >= size) {
            from += 1;
            continue;
        }
        host.push(pool.shift());
    }
    return ret;
};
function __uri(id) {
    return id;
}
// xs < 768px
// sm >= 768px
// md >= 992px
// lg >= 1200px
function isBreakpoint(str) {
    if (typeof str !== 'string') {
        return !!str;
    }
    var breaks = str.split(/\s*,\s*|\s+/);
    if (window.matchMedia) {
        return breaks.some(function (item) {
            return item === '*' ||
                (item === 'xs' &&
                    matchMedia("screen and (max-width: 767px)").matches) ||
                (item === 'sm' &&
                    matchMedia("screen and (min-width: 768px) and (max-width: 991px)")
                        .matches) ||
                (item === 'md' &&
                    matchMedia("screen and (min-width: 992px) and (max-width: 1199px)")
                        .matches) ||
                (item === 'lg' && matchMedia("screen and (min-width: 1200px)").matches);
        });
    }
    else {
        var width_1 = window.innerWidth;
        return breaks.some(function (item) {
            return item === '*' ||
                (item === 'xs' && width_1 < 768) ||
                (item === 'sm' && width_1 >= 768 && width_1 < 992) ||
                (item === 'md' && width_1 >= 992 && width_1 < 1200) ||
                (item === 'lg' && width_1 >= 1200);
        });
    }
}
function until(fn, when, getCanceler, interval) {
    var _this = this;
    if (interval === void 0) { interval = 5000; }
    var timer;
    var stoped = false;
    return new Promise(function (resolve, reject) {
        var cancel = function () {
            clearTimeout(timer);
            stoped = true;
        };
        var check = function () { return tslib.__awaiter(_this, void 0, void 0, function () {
            var ret, e_1;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fn()];
                    case 1:
                        ret = _a.sent();
                        if (stoped) {
                            return [2 /*return*/];
                        }
                        else if (when(ret)) {
                            stoped = true;
                            resolve(ret);
                        }
                        else {
                            timer = setTimeout(check, interval);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        reject(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        check();
        getCanceler && getCanceler(cancel);
    });
}
function omitControls(controls, omitItems) {
    return controls.filter(function (control) { return !~omitItems.indexOf(control.name || control._name); });
}
function isEmpty(thing) {
    if (object.isObject(thing) && Object.keys(thing).length) {
        return false;
    }
    return true;
}
/**
 * 基于时间戳的 uuid
 *
 * @returns uniqueId
 */
var uuid = function () {
    return (+new Date()).toString(36);
};
// 参考 https://github.com/streamich/v4-uuid
var str = function () {
    return ('00000000000000000' + (Math.random() * 0xffffffffffffffff).toString(16)).slice(-16);
};
var uuidv4 = function () {
    var a = str();
    var b = str();
    return (a.slice(0, 8) +
        '-' +
        a.slice(8, 12) +
        '-4' +
        a.slice(13) +
        '-a' +
        b.slice(1, 4) +
        '-' +
        b.slice(4));
};
/**
 * 类似于 arr.map 方法，此方法主要针对类似下面示例的树形结构。
 * [
 *     {
 *         children: []
 *     },
 *     // 其他成员
 * ]
 *
 * @param {Tree} tree 树形数据
 * @param {Function} iterator 处理函数，返回的数据会被替换成新的。
 * @return {Tree} 返回处理过的 tree
 */
function mapTree(tree, iterator, level, depthFirst, paths) {
    if (level === void 0) { level = 1; }
    if (depthFirst === void 0) { depthFirst = false; }
    if (paths === void 0) { paths = []; }
    return tree.map(function (item, index) {
        if (depthFirst) {
            var children = item.children
                ? mapTree(item.children, iterator, level + 1, depthFirst, paths.concat(item))
                : undefined;
            children && (item = tslib.__assign(tslib.__assign({}, item), { children: children }));
            item = iterator(item, index, level, paths) || tslib.__assign({}, item);
            return item;
        }
        item = iterator(item, index, level, paths) || tslib.__assign({}, item);
        if (item.children && item.children.splice) {
            item.children = mapTree(item.children, iterator, level + 1, depthFirst, paths.concat(item));
        }
        return item;
    });
}
/**
 * 遍历树
 * @param tree
 * @param iterator
 */
function eachTree(tree, iterator, level, paths) {
    if (level === void 0) { level = 1; }
    if (paths === void 0) { paths = []; }
    tree.map(function (item, index) {
        var _a;
        var currentPath = paths.concat(item);
        iterator(item, index, level, currentPath);
        if ((_a = item.children) === null || _a === void 0 ? void 0 : _a.splice) {
            eachTree(item.children, iterator, level + 1, currentPath);
        }
    });
}
/**
 * 在树中查找节点。
 * @param tree
 * @param iterator
 */
function findTree(tree, iterator) {
    var result = null;
    everyTree(tree, function (item, key, level, paths) {
        if (iterator(item, key, level, paths)) {
            result = item;
            return false;
        }
        return true;
    });
    return result;
}
/**
 * 在树中查找节点, 返回下标数组。
 * @param tree
 * @param iterator
 */
function findTreeIndex(tree, iterator) {
    var idx = [];
    findTree(tree, function (item, index, level, paths) {
        if (iterator(item, index, level, paths)) {
            idx = [index];
            paths = paths.concat();
            paths.unshift({
                children: tree
            });
            for (var i = paths.length - 1; i > 0; i--) {
                var prev = paths[i - 1];
                var current = paths[i];
                idx.unshift(prev.children.indexOf(current));
            }
            return true;
        }
        return false;
    });
    return idx.length ? idx : undefined;
}
function getTree(tree, idx) {
    var indexes = Array.isArray(idx) ? idx.concat() : [idx];
    var lastIndex = indexes.pop();
    var list = tree;
    for (var i = 0, len = indexes.length; i < len; i++) {
        var index = indexes[i];
        if (!list[index]) {
            list = null;
            break;
        }
        list = list[index].children;
    }
    return list ? list[lastIndex] : undefined;
}
/**
 * 过滤树节点
 *
 * @param tree
 * @param iterator
 */
function filterTree(tree, iterator, level, depthFirst) {
    if (level === void 0) { level = 1; }
    if (depthFirst === void 0) { depthFirst = false; }
    if (depthFirst) {
        return tree
            .map(function (item) {
            var children = item.children
                ? filterTree(item.children, iterator, level + 1, depthFirst)
                : undefined;
            if (Array.isArray(children) && Array.isArray(item.children)) {
                item = tslib.__assign(tslib.__assign({}, item), { children: children });
            }
            return item;
        })
            .filter(function (item, index) { return iterator(item, index, level); });
    }
    return tree
        .filter(function (item, index) { return iterator(item, index, level); })
        .map(function (item) {
        var _a;
        if ((_a = item.children) === null || _a === void 0 ? void 0 : _a.splice) {
            var children = filterTree(item.children, iterator, level + 1, depthFirst);
            if (Array.isArray(children) && Array.isArray(item.children)) {
                item = tslib.__assign(tslib.__assign({}, item), { children: children });
            }
        }
        return item;
    });
}
/**
 * 判断树中每个节点是否满足某个条件。
 * @param tree
 * @param iterator
 */
function everyTree(tree, iterator, level, paths, indexes) {
    if (level === void 0) { level = 1; }
    if (paths === void 0) { paths = []; }
    if (indexes === void 0) { indexes = []; }
    if (!Array.isArray(tree) && !mobx.isObservableArray(tree)) {
        return false;
    }
    return tree.every(function (item, index) {
        var _a;
        var value = iterator(item, index, level, paths, indexes);
        if (value && ((_a = item.children) === null || _a === void 0 ? void 0 : _a.splice)) {
            return everyTree(item.children, iterator, level + 1, paths.concat(item), indexes.concat(index));
        }
        return value;
    });
}
/**
 * 判断树中是否有某些节点满足某个条件。
 * @param tree
 * @param iterator
 */
function someTree(tree, iterator) {
    var result = false;
    everyTree(tree, function (item, key, level, paths) {
        if (iterator(item, key, level, paths)) {
            result = true;
            return false;
        }
        return true;
    });
    return result;
}
function flattenTree(tree, mapper) {
    var flattened = [];
    eachTree(tree, function (item, index) {
        return flattened.push(mapper ? mapper(item, index) : item);
    });
    return flattened;
}
function flattenTreeWithLeafNodes(tree, mapper) {
    var flattened = [];
    eachTree(tree, function (item, index) {
        if (!item.hasOwnProperty('children')) {
            flattened.push(mapper ? mapper(item, index) : item);
        }
    });
    return flattened;
}
/**
 * 操作树，遵循 imutable, 每次返回一个新的树。
 * 类似数组的 splice 不同的地方这个方法不修改原始数据，
 * 同时第二个参数不是下标，而是下标数组，分别代表每一层的下标。
 *
 * 至于如何获取下标数组，请查看 findTreeIndex
 *
 * @param tree
 * @param idx
 * @param deleteCount
 * @param ...items
 */
function spliceTree(tree, idx, deleteCount) {
    if (deleteCount === void 0) { deleteCount = 0; }
    var items = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        items[_i - 3] = arguments[_i];
    }
    var list = tree.concat();
    if (typeof idx === 'number') {
        list.splice.apply(list, tslib.__spreadArray([idx, deleteCount], items, false));
    }
    else if (Array.isArray(idx) && idx.length) {
        idx = idx.concat();
        var lastIdx = idx.pop();
        var host = idx.reduce(function (list, idx) {
            var child = tslib.__assign(tslib.__assign({}, list[idx]), { children: list[idx].children ? list[idx].children.concat() : [] });
            list[idx] = child;
            return child.children;
        }, list);
        host.splice.apply(host, tslib.__spreadArray([lastIdx, deleteCount], items, false));
    }
    return list;
}
/**
 * 计算树的深度
 * @param tree
 */
function getTreeDepth(tree) {
    return Math.max.apply(Math, tree.map(function (item) {
        if (Array.isArray(item.children)) {
            return 1 + getTreeDepth(item.children);
        }
        return 1;
    }));
}
/**
 * 从树中获取某个值的所有祖先
 * @param tree
 * @param value
 */
function getTreeAncestors(tree, value, includeSelf) {
    if (includeSelf === void 0) { includeSelf = false; }
    var ancestors = null;
    findTree(tree, function (item, index, level, paths) {
        if (item === value) {
            ancestors = paths;
            if (includeSelf) {
                ancestors.push(item);
            }
            return true;
        }
        return false;
    });
    return ancestors;
}
/**
 * 从树中获取某个值的上级
 * @param tree
 * @param value
 */
function getTreeParent(tree, value) {
    var ancestors = getTreeAncestors(tree, value);
    return (ancestors === null || ancestors === void 0 ? void 0 : ancestors.length) ? ancestors[ancestors.length - 1] : null;
}
function ucFirst(str) {
    return typeof str === 'string'
        ? str.substring(0, 1).toUpperCase() + str.substring(1)
        : str;
}
function lcFirst(str) {
    return str ? str.substring(0, 1).toLowerCase() + str.substring(1) : '';
}
function camel(str) {
    return str
        ? str
            .split(/[\s_\-]/)
            .map(function (item, index) { return (index === 0 ? lcFirst(item) : ucFirst(item)); })
            .join('')
        : '';
}
function getWidthRate(value, strictMode) {
    if (strictMode === void 0) { strictMode = false; }
    if (typeof value === 'string' && /\bcol\-\w+\-(\d+)\b/.test(value)) {
        return parseInt(RegExp.$1, 10);
    }
    return strictMode ? 0 : value || 0;
}
function getLevelFromClassName(value, defaultValue) {
    if (defaultValue === void 0) { defaultValue = 'default'; }
    if (/\b(?:btn|text)-(link|primary|secondary|info|success|warning|danger|light|dark)\b/.test(value)) {
        return RegExp.$1;
    }
    return defaultValue;
}
function pickEventsProps(props) {
    var ret = {};
    props &&
        Object.keys(props).forEach(function (key) { return /^on/.test(key) && (ret[key] = props[key]); });
    return ret;
}
var autobind = autobind$1.autobindMethod;
var bulkBindFunctions = function (context, funNames) {
    funNames.forEach(function (key) { return (context[key] = context[key].bind(context)); });
};
function sortArray(items, field, dir) {
    return items.sort(function (a, b) {
        var ret;
        var a1 = a[field];
        var b1 = b[field];
        if (typeof a1 === 'number' && typeof b1 === 'number') {
            ret = a1 < b1 ? -1 : a1 === b1 ? 0 : 1;
        }
        else {
            ret = String(a1).localeCompare(String(b1));
        }
        return ret * dir;
    });
}
// 只判断一层, 如果层级很深，form-data 也不好表达。
function hasFile(object) {
    return Object.keys(object).some(function (key) {
        var value = object[key];
        return (value instanceof File ||
            (Array.isArray(value) && value.length && value[0] instanceof File));
    });
}
function qsstringify(data, options, keepEmptyArray) {
    if (options === void 0) { options = {
        arrayFormat: 'indices',
        encodeValuesOnly: true
    }; }
    // qs会保留空字符串。fix: Combo模式的空数组，无法清空。改为存为空字符串；只转换一层
    keepEmptyArray &&
        Object.keys(data).forEach(function (key) {
            Array.isArray(data[key]) && !data[key].length && (data[key] = '');
        });
    return qs__default["default"].stringify(data, options);
}
function qsparse(data, options) {
    if (options === void 0) { options = {
        arrayFormat: 'indices',
        encodeValuesOnly: true,
        depth: 1000,
        arrayLimit: 1000 /** array元素数量超出限制，会被自动转化为object格式，默认值1000 */
    }; }
    return qs__default["default"].parse(data, options);
}
function object2formData(data, options, fd) {
    if (options === void 0) { options = {
        arrayFormat: 'indices',
        encodeValuesOnly: true
    }; }
    if (fd === void 0) { fd = new FormData(); }
    var fileObjects = [];
    var others = {};
    Object.keys(data).forEach(function (key) {
        var value = data[key];
        if (value instanceof File) {
            fileObjects.push([key, value]);
        }
        else if (Array.isArray(value) &&
            value.length &&
            value[0] instanceof File) {
            value.forEach(function (value) { return fileObjects.push(["".concat(key, "[]"), value]); });
        }
        else {
            others[key] = value;
        }
    });
    // 因为 key 的格式太多了，偷个懒，用 qs 来处理吧。
    qsstringify(others, options)
        .split('&')
        .forEach(function (item) {
        var parts = item.split('=');
        // form-data/multipart 是不需要 encode 值的。
        parts[0] && fd.append(parts[0], decodeURIComponent(parts[1]));
    });
    // Note: File类型字段放在后面，可以支持第三方云存储鉴权
    fileObjects.forEach(function (fileObject) {
        return fd.append(fileObject[0], fileObject[1], fileObject[1].name);
    });
    return fd;
}
function chainFunctions() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return fns.reduce(function (ret, fn) {
            return ret === false
                ? false
                : typeof fn == 'function'
                    ? fn.apply(void 0, args) : undefined;
        }, undefined);
    };
}
function chainEvents(props, schema) {
    var ret = {};
    Object.keys(props).forEach(function (key) {
        if (key.substr(0, 2) === 'on' &&
            typeof props[key] === 'function' &&
            typeof schema[key] === 'function' &&
            schema[key] !== props[key]) {
            // 表单项里面的 onChange 很特殊，这个不要处理。
            if (props.formStore && key === 'onChange') {
                ret[key] = props[key];
            }
            else {
                ret[key] = chainFunctions(schema[key], props[key]);
            }
        }
        else {
            ret[key] = props[key];
        }
    });
    return ret;
}
function mapObject(value, fn) {
    if (Array.isArray(value)) {
        return value.map(function (item) { return mapObject(item, fn); });
    }
    if (object.isObject(value)) {
        var tmpValue_1 = tslib.__assign({}, value);
        Object.keys(tmpValue_1).forEach(function (key) {
            tmpValue_1[key] = mapObject(tmpValue_1[key], fn);
        });
        return tmpValue_1;
    }
    return fn(value);
}
function loadScript(src) {
    return new Promise(function (ok, fail) {
        var script = document.createElement('script');
        script.onerror = function (reason) { return fail(reason); };
        if (~src.indexOf('{{callback}}')) {
            var callbackFn_1 = "loadscriptcallback_".concat(uuid());
            window[callbackFn_1] = function () {
                ok();
                delete window[callbackFn_1];
            };
            src = src.replace('{{callback}}', callbackFn_1);
        }
        else {
            script.onload = function () { return ok(); };
        }
        script.src = src;
        document.head.appendChild(script);
    });
}
var SkipOperation = /** @class */ (function (_super) {
    tslib.__extends(SkipOperation, _super);
    function SkipOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SkipOperation;
}(Error));
/**
 * 检查对象是否有循环引用，来自 https://stackoverflow.com/a/34909127
 * @param obj
 */
function isCyclic(obj) {
    var seenObjects = [];
    function detect(obj) {
        if (obj && typeof obj === 'object') {
            if (seenObjects.indexOf(obj) !== -1) {
                return true;
            }
            seenObjects.push(obj);
            for (var key in obj) {
                if (obj.hasOwnProperty(key) && detect(obj[key])) {
                    return true;
                }
            }
        }
        return false;
    }
    return detect(obj);
}
function internalFindObjectsWithKey(obj, key) {
    var objects = [];
    for (var k in obj) {
        if (!obj.hasOwnProperty(k))
            continue;
        if (k === key) {
            objects.push(obj);
        }
        else if (typeof obj[k] === 'object') {
            objects = objects.concat(internalFindObjectsWithKey(obj[k], key));
        }
    }
    return objects;
}
/**
 * 深度查找具有某个 key 名字段的对象，实际实现是 internalFindObjectsWithKey，这里包一层是为了做循环引用检测
 * @param obj
 * @param key
 */
function findObjectsWithKey(obj, key) {
    // 避免循环引用导致死循环
    if (isCyclic(obj)) {
        return [];
    }
    return internalFindObjectsWithKey(obj, key);
}
var scrollbarWidth;
/**
 * 获取浏览器滚动条宽度 https://stackoverflow.com/a/13382873
 */
function getScrollbarWidth() {
    if (typeof scrollbarWidth !== 'undefined') {
        return scrollbarWidth;
    }
    // Creating invisible container
    var outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    // @ts-ignore
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);
    // Creating inner element and placing it in the container
    var inner = document.createElement('div');
    outer.appendChild(inner);
    // Calculating difference between container's full width and the child width
    scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    // Removing temporary elements from the DOM
    // @ts-ignore
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
}
// 后续改用 FormulaExec['formula']
function resolveValueByName(data, name) {
    return isPureVariable.isPureVariable(name)
        ? resolveVariableAndFilter.resolveVariableAndFilter(name, data)
        : resolveVariable.resolveVariable(name, data);
}
// 统一的获取 value 值方法
function getPropValue(props, getter) {
    var _a, _b;
    var name = props.name, value = props.value, data = props.data, defaultValue = props.defaultValue;
    return ((_b = (_a = value !== null && value !== void 0 ? value : getter === null || getter === void 0 ? void 0 : getter(props)) !== null && _a !== void 0 ? _a : resolveValueByName(data, name)) !== null && _b !== void 0 ? _b : defaultValue);
}
// 检测 value 是否有变化，有变化就执行 onChange
function detectPropValueChanged(props, prevProps, onChange, getter) {
    var nextValue;
    if (typeof props.value !== 'undefined') {
        props.value !== prevProps.value && onChange(props.value);
    }
    else if ((nextValue = getter === null || getter === void 0 ? void 0 : getter(props)) !== undefined) {
        nextValue !== getter(prevProps) && onChange(nextValue);
    }
    else if (typeof props.name === 'string' &&
        (nextValue = resolveValueByName(props.data, props.name)) !== undefined) {
        nextValue !== resolveValueByName(prevProps.data, prevProps.name) &&
            onChange(nextValue);
    }
    else if (props.defaultValue !== prevProps.defaultValue) {
        onChange(props.defaultValue);
    }
}
// 去掉字符串中的 html 标签，不完全准确但效率比较高
function removeHTMLTag(str) {
    return typeof str === 'string' ? str.replace(/<\/?[^>]+(>|$)/g, '') : str;
}
/**
 * 将路径格式的value转换成普通格式的value值
 *
 * @example
 *
 * 'a/b/c' => 'c';
 * {label: 'A/B/C', value: 'a/b/c'} => {label: 'C', value: 'c'};
 * 'a/b/c,a/d' => 'c,d';
 * ['a/b/c', 'a/d'] => ['c', 'd'];
 * [{label: 'A/B/C', value: 'a/b/c'},{label: 'A/D', value: 'a/d'}] => [{label: 'C', value: 'c'},{label: 'D', value: 'd'}]
 */
function normalizeNodePath(value, enableNodePath, labelField, valueField, pathSeparator, delimiter) {
    var _a;
    if (labelField === void 0) { labelField = 'label'; }
    if (valueField === void 0) { valueField = 'value'; }
    if (pathSeparator === void 0) { pathSeparator = '/'; }
    if (delimiter === void 0) { delimiter = ','; }
    var nodeValueArray = [];
    var nodePathArray = [];
    var getLastNodeFromPath = function (path) {
        return last__default["default"](path ? path.toString().split(pathSeparator) : []);
    };
    if (typeof value === 'undefined' || !enableNodePath) {
        return { nodeValueArray: nodeValueArray, nodePathArray: nodePathArray };
    }
    // 尾节点为当前options中value值
    if (Array.isArray(value)) {
        value.forEach(function (nodePath) {
            var _a;
            if (nodePath && nodePath.hasOwnProperty(valueField)) {
                nodeValueArray.push(tslib.__assign(tslib.__assign({}, nodePath), (_a = {}, _a[labelField] = getLastNodeFromPath(nodePath[labelField]), _a[valueField] = getLastNodeFromPath(nodePath[valueField]), _a)));
                nodePathArray.push(nodePath[valueField]);
            }
            else {
                nodeValueArray.push(getLastNodeFromPath(nodePath));
                nodePathArray.push(nodePath);
            }
        });
    }
    else if (typeof value === 'string') {
        value
            .toString()
            .split(delimiter)
            .forEach(function (path) {
            nodeValueArray.push(getLastNodeFromPath(path));
            nodePathArray.push(path);
        });
    }
    else {
        nodeValueArray.push(tslib.__assign(tslib.__assign({}, value), (_a = {}, _a[labelField] = getLastNodeFromPath(value[labelField]), _a[valueField || 'value'] = getLastNodeFromPath(value[valueField]), _a)));
        nodePathArray.push(value[valueField]);
    }
    return { nodeValueArray: nodeValueArray, nodePathArray: nodePathArray };
}
// 主要用于排除点击输入框和链接等情况
function isClickOnInput(e) {
    var target = e.target;
    var formItem;
    if (!e.currentTarget.contains(target) ||
        ~['INPUT', 'TEXTAREA'].indexOf(target.tagName) ||
        ((formItem = target.closest("button, a, [data-role=\"form-item\"]")) &&
            e.currentTarget.contains(formItem))) {
        return true;
    }
    return false;
}
// 计算字符串 hash
function hashCode(s) {
    return s.split('').reduce(function (a, b) {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
    }, 0);
}
/**
 * 遍历 schema
 * @param json
 * @param mapper
 */
function JSONTraverse(json, mapper) {
    Object.keys(json).forEach(function (key) {
        var value = json[key];
        if (isPlainObject__default["default"](value) || Array.isArray(value)) {
            JSONTraverse(value, mapper);
        }
        else {
            mapper(value, key, json);
        }
    });
}
function convertArrayValueToMoment(value, types, mom) {
    if (value.length === 0)
        return mom;
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        // @ts-ignore
        mom.set(type, value[i]);
    }
    return mom;
}
function getRange(min, max, step) {
    if (step === void 0) { step = 1; }
    var arr = [];
    for (var i = min; i <= max; i += step) {
        arr.push(i);
    }
    return arr;
}
function repeatCount(count, iterator) {
    var result = [];
    var index = 0;
    while (count--) {
        result.push(iterator(index++));
    }
    return result;
}
function isNumeric(value) {
    if (typeof value === 'number') {
        return true;
    }
    return /^[-+]?(?:\d*[.])?\d+$/.test(value);
}

exports.cloneObject = object.cloneObject;
exports.createObject = object.createObject;
exports.deleteVariable = object.deleteVariable;
exports.extendObject = object.extendObject;
exports.isObject = object.isObject;
exports.setVariable = object.setVariable;
exports.string2regExp = string2regExp.string2regExp;
exports.getVariable = getVariable.getVariable;
exports.keyToPath = keyToPath.keyToPath;
exports.JSONTraverse = JSONTraverse;
exports.SkipOperation = SkipOperation;
exports.__uri = __uri;
exports.anyChanged = anyChanged;
exports.autobind = autobind;
exports.bulkBindFunctions = bulkBindFunctions;
exports.camel = camel;
exports.chainEvents = chainEvents;
exports.chainFunctions = chainFunctions;
exports.convertArrayValueToMoment = convertArrayValueToMoment;
exports.detectPropValueChanged = detectPropValueChanged;
exports.difference = difference;
exports.eachTree = eachTree;
exports.everyTree = everyTree;
exports.filterTree = filterTree;
exports.findIndex = findIndex;
exports.findObjectsWithKey = findObjectsWithKey;
exports.findTree = findTree;
exports.findTreeIndex = findTreeIndex;
exports.flattenTree = flattenTree;
exports.flattenTreeWithLeafNodes = flattenTreeWithLeafNodes;
exports.getLevelFromClassName = getLevelFromClassName;
exports.getPropValue = getPropValue;
exports.getRange = getRange;
exports.getScrollParent = getScrollParent;
exports.getScrollbarWidth = getScrollbarWidth;
exports.getTree = getTree;
exports.getTreeAncestors = getTreeAncestors;
exports.getTreeDepth = getTreeDepth;
exports.getTreeParent = getTreeParent;
exports.getWidthRate = getWidthRate;
exports.guid = guid;
exports.hasAbility = hasAbility;
exports.hasFile = hasFile;
exports.hasOwnPropertyInPath = hasOwnPropertyInPath;
exports.hasVisibleExpression = hasVisibleExpression;
exports.hashCode = hashCode;
exports.immutableExtends = immutableExtends;
exports.injectPropsToObject = injectPropsToObject;
exports.isArrayChildrenModified = isArrayChildrenModified;
exports.isBreakpoint = isBreakpoint;
exports.isClickOnInput = isClickOnInput;
exports.isDisabled = isDisabled;
exports.isEmpty = isEmpty;
exports.isMobile = isMobile;
exports.isNumeric = isNumeric;
exports.isObjectShallowModified = isObjectShallowModified;
exports.isSuperDataModified = isSuperDataModified;
exports.isUnfolded = isUnfolded;
exports.isVisible = isVisible;
exports.lcFirst = lcFirst;
exports.loadScript = loadScript;
exports.makeColumnClassBuild = makeColumnClassBuild;
exports.makeHorizontalDeeper = makeHorizontalDeeper;
exports.mapObject = mapObject;
exports.mapTree = mapTree;
exports.noop = noop;
exports.normalizeNodePath = normalizeNodePath;
exports.object2formData = object2formData;
exports.omitControls = omitControls;
exports.padArr = padArr;
exports.pickEventsProps = pickEventsProps;
exports.preventDefault = preventDefault;
exports.promisify = promisify;
exports.qsparse = qsparse;
exports.qsstringify = qsstringify;
exports.range = range;
exports.removeHTMLTag = removeHTMLTag;
exports.repeatCount = repeatCount;
exports.rmUndefined = rmUndefined;
exports.someTree = someTree;
exports.sortArray = sortArray;
exports.spliceTree = spliceTree;
exports.syncDataFromSuper = syncDataFromSuper;
exports.ucFirst = ucFirst;
exports.until = until;
exports.uuid = uuid;
exports.uuidv4 = uuidv4;
exports.visibilityFilter = visibilityFilter;
