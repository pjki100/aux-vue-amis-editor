/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var fileSaver = require('file-saver');
var mobxStateTree = require('mobx-state-tree');
var service = require('./service.js');
var helper = require('../utils/helper.js');
var pick = require('lodash/pick');
require('amis-formula');
require('moment');
var object = require('../utils/object.js');
var getVariable = require('../utils/getVariable.js');
var resolveVariableAndFilter = require('../utils/resolveVariableAndFilter.js');
require('lodash/isPlainObject');
require('../utils/filter.js');
var api = require('../utils/api.js');
var matchSorter = require('match-sorter');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var pick__default = /*#__PURE__*/_interopDefaultLegacy(pick);

var ServerError = /** @class */ (function (_super) {
    tslib.__extends(ServerError, _super);
    function ServerError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'ServerError';
        return _this;
    }
    return ServerError;
}(Error));
var CRUDStore = service.ServiceStore.named('CRUDStore')
    .props({
    pristineQuery: mobxStateTree.types.optional(mobxStateTree.types.frozen(), {}),
    query: mobxStateTree.types.optional(mobxStateTree.types.frozen(), {}),
    prevPage: 1,
    page: 1,
    perPage: 10,
    total: 0,
    mode: 'normal',
    hasNext: false,
    selectedAction: mobxStateTree.types.frozen(),
    columns: mobxStateTree.types.frozen(),
    items: mobxStateTree.types.optional(mobxStateTree.types.array(mobxStateTree.types.frozen()), []),
    selectedItems: mobxStateTree.types.optional(mobxStateTree.types.array(mobxStateTree.types.frozen()), []),
    unSelectedItems: mobxStateTree.types.optional(mobxStateTree.types.array(mobxStateTree.types.frozen()), []),
    filterTogggable: false,
    filterVisible: true,
    hasInnerModalOpen: false
})
    .views(function (self) { return ({
    get lastPage() {
        return Math.max(Math.ceil(self.total / (self.perPage < 1 ? 10 : self.perPage)), 1);
    },
    get filterData() {
        return object.createObject(self.data, tslib.__assign({}, self.query));
    },
    get mergedData() {
        return object.extendObject(self.data, tslib.__assign(tslib.__assign(tslib.__assign({}, self.query), self.data), { selectedItems: self.selectedItems, unSelectedItems: self.unSelectedItems }));
    },
    get hasModalOpened() {
        return self.dialogOpen || self.drawerOpen || self.hasInnerModalOpen;
    },
    get selectedItemsAsArray() {
        return self.selectedItems.concat();
    },
    fetchCtxOf: function (data, options) {
        var _a;
        return object.createObject(data, tslib.__assign(tslib.__assign(tslib.__assign({}, self.query), (_a = {}, _a[options.pageField || 'page'] = self.page, _a[options.perPageField || 'perPage'] = self.perPage, _a)), data));
    }
}); })
    .actions(function (self) {
    var fetchCancel = null;
    function setPristineQuery() {
        self.pristineQuery = self.query;
    }
    function updateQuery(values, updater, pageField, perPageField, replace) {
        if (pageField === void 0) { pageField = 'page'; }
        if (perPageField === void 0) { perPageField = 'perPage'; }
        if (replace === void 0) { replace = false; }
        var originQuery = self.query;
        self.query = replace
            ? tslib.__assign({}, values) : tslib.__assign(tslib.__assign({}, self.query), values);
        if (self.query[pageField || 'page']) {
            self.page = parseInt(self.query[pageField || 'page'], 10);
        }
        if (self.query[perPageField || 'perPage']) {
            self.perPage = parseInt(self.query[perPageField || 'perPage'], 10);
        }
        updater &&
            helper.isObjectShallowModified(originQuery, self.query, false) &&
            setTimeout(updater.bind(null, "?".concat(helper.qsstringify(self.query))), 4);
    }
    var fetchInitData = mobxStateTree.flow(function getInitData(api$1, data, options) {
        var items_1, dir, data_1, ctx, json, result, total, count, page, hasNext, oItems, oRows, columns, rest, items, _i, _a, key, rowsData, data_2, filteredItems_1, dir, e_1, env;
        var _b;
        var _c, _d, _e, _f, _g;
        if (options === void 0) { options = {}; }
        return tslib.__generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 2, , 3]);
                    if (!options.forceReload && options.loadDataOnce && self.total) {
                        items_1 = options.source
                            ? resolveVariableAndFilter.resolveVariableAndFilter(options.source, object.createObject(self.mergedData, {
                                items: self.data.itemsRaw,
                                rows: self.data.itemsRaw
                            }), '| raw')
                            : self.items.concat();
                        if (Array.isArray(options.columns)) {
                            options.columns.forEach(function (column) {
                                var value;
                                // 兼容新老版本的name和key
                                var key = column.name || column.key;
                                if (column.searchable &&
                                    key &&
                                    (value = getVariable.getVariable(self.query, key))) {
                                    items_1 = matchSorter.matchSorter(items_1, value, {
                                        keys: [key]
                                    });
                                }
                            });
                        }
                        if (self.query.orderBy) {
                            dir = /desc/i.test(self.query.orderDir) ? -1 : 1;
                            items_1 = helper.sortArray(items_1, self.query.orderBy, dir);
                        }
                        data_1 = tslib.__assign(tslib.__assign({}, self.data), { total: items_1.length, items: items_1.slice((self.page - 1) * self.perPage, self.page * self.perPage) });
                        self.total = parseInt((_c = data_1.total) !== null && _c !== void 0 ? _c : data_1.count, 10) || 0;
                        self.reInitData(data_1);
                        return [2 /*return*/];
                    }
                    if (fetchCancel) {
                        fetchCancel();
                        fetchCancel = null;
                        self.fetching = false;
                    }
                    options.silent || self.markFetching(true);
                    ctx = object.createObject(self.data, tslib.__assign(tslib.__assign(tslib.__assign({}, self.query), data), (_b = {}, _b[options.pageField || 'page'] = self.page, _b[options.perPageField || 'perPage'] = self.perPage, _b)));
                    // 一次性加载不要发送 perPage 属性
                    if (options.loadDataOnce) {
                        delete ctx[options.perPageField || 'perPage'];
                    }
                    return [4 /*yield*/, mobxStateTree.getEnv(self).fetcher(api$1, ctx, tslib.__assign(tslib.__assign({}, options), { cancelExecutor: function (executor) { return (fetchCancel = executor); } }))];
                case 1:
                    json = _h.sent();
                    fetchCancel = null;
                    if (!json.ok) {
                        self.updateMessage((_e = (_d = json.msg) !== null && _d !== void 0 ? _d : options.errorMessage) !== null && _e !== void 0 ? _e : self.__('CRUD.fetchFailed'), true);
                        mobxStateTree.getEnv(self).notify('error', json.msg, json.msgTimeout !== undefined
                            ? {
                                closeButton: true,
                                timeout: json.msgTimeout
                            }
                            : undefined);
                    }
                    else {
                        if (!json.data) {
                            throw new Error(self.__('CRUD.invalidData'));
                        }
                        self.updatedAt = Date.now();
                        result = api.normalizeApiResponseData(json.data);
                        total = result.total, count = result.count, page = result.page, hasNext = result.hasNext, oItems = result.items, oRows = result.rows, columns = result.columns, rest = tslib.__rest(result, ["total", "count", "page", "hasNext", "items", "rows", "columns"]);
                        items = void 0;
                        if (options.source) {
                            items = resolveVariableAndFilter.resolveVariableAndFilter(options.source, object.createObject(self.filterData, result), '| raw');
                        }
                        else {
                            items = result.items || result.rows;
                        }
                        // 如果不按照 items 格式返回，就拿第一个数组当成 items
                        if (!Array.isArray(items)) {
                            for (_i = 0, _a = Object.keys(result); _i < _a.length; _i++) {
                                key = _a[_i];
                                if (result.hasOwnProperty(key) && Array.isArray(result[key])) {
                                    items = result[key];
                                    break;
                                }
                            }
                        }
                        if (!Array.isArray(items)) {
                            throw new Error(self.__('CRUD.invalidArray'));
                        }
                        else {
                            // 确保成员是对象。
                            items.map(function (item) {
                                return typeof item === 'string' ? { text: item } : item;
                            });
                        }
                        rowsData = [];
                        if (options.loadDataMode && Array.isArray(self.data.items)) {
                            rowsData = self.data.items.concat(items);
                        }
                        else {
                            // 第一次的时候就是直接加载请求的数据
                            rowsData = items;
                        }
                        data_2 = tslib.__assign(tslib.__assign(tslib.__assign({}, (api$1.replaceData ? {} : self.pristine)), { items: rowsData, count: count, total: total }), rest);
                        if (options.loadDataOnce) {
                            // 记录原始集合，后续可能基于原始数据做排序查找。
                            data_2.itemsRaw = oItems || oRows;
                            filteredItems_1 = rowsData.concat();
                            if (Array.isArray(options.columns)) {
                                options.columns.forEach(function (column) {
                                    var value;
                                    var key = column.name || column.key;
                                    if (column.searchable &&
                                        key &&
                                        (value = getVariable.getVariable(self.query, key))) {
                                        filteredItems_1 = matchSorter.matchSorter(filteredItems_1, value, {
                                            keys: [key]
                                        });
                                    }
                                });
                            }
                            if (self.query.orderBy) {
                                dir = /desc/i.test(self.query.orderDir) ? -1 : 1;
                                filteredItems_1 = helper.sortArray(filteredItems_1, self.query.orderBy, dir);
                            }
                            data_2.items = filteredItems_1.slice((self.page - 1) * self.perPage, self.page * self.perPage);
                            data_2.count = data_2.total = filteredItems_1.length;
                        }
                        if (Array.isArray(columns)) {
                            self.columns = columns.concat();
                        }
                        else {
                            self.columns = options.columns;
                        }
                        self.items.replace(rowsData);
                        self.reInitData(data_2, !!api$1.replaceData);
                        options.syncResponse2Query !== false &&
                            updateQuery(pick__default["default"](rest, Object.keys(self.query)), undefined, options.pageField || 'page', options.perPageField || 'perPage');
                        self.total = parseInt((_f = data_2.total) !== null && _f !== void 0 ? _f : data_2.count, 10) || 0;
                        typeof page !== 'undefined' && (self.page = parseInt(page, 10));
                        // 分页情况不清楚，只能知道有没有下一页。
                        if (typeof hasNext !== 'undefined') {
                            self.mode = 'simple';
                            self.total = 0;
                            self.hasNext = !!hasNext;
                        }
                        self.updateMessage((_g = json.msg) !== null && _g !== void 0 ? _g : options.successMessage);
                        // 配置了获取成功提示后提示，默认是空不会提示。
                        options &&
                            options.successMessage &&
                            mobxStateTree.getEnv(self).notify('success', self.msg);
                    }
                    self.markFetching(false);
                    return [2 /*return*/, json];
                case 2:
                    e_1 = _h.sent();
                    env = mobxStateTree.getEnv(self);
                    if (!mobxStateTree.isAlive(self) || self.disposed) {
                        return [2 /*return*/];
                    }
                    self.markFetching(false);
                    if (env.isCancel(e_1)) {
                        return [2 /*return*/];
                    }
                    console.error(e_1.stack);
                    env.notify('error', e_1.message);
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    });
    function changePage(page, perPage) {
        self.page = page;
        perPage && (self.perPage = parseInt(perPage, 10));
    }
    function selectAction(action) {
        self.selectedAction = action;
    }
    var saveRemote = mobxStateTree.flow(function saveRemote(api$1, data, options) {
        var json, e_2;
        var _a, _b, _c;
        if (options === void 0) { options = {}; }
        return tslib.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    options = tslib.__assign({ method: 'post' }, options);
                    self.markSaving(true);
                    return [4 /*yield*/, mobxStateTree.getEnv(self).fetcher(api$1, data, options)];
                case 1:
                    json = _d.sent();
                    self.markSaving(false);
                    if (!helper.isEmpty(json.data) || json.ok) {
                        self.updateData(api.normalizeApiResponseData(json.data), {
                            __saved: Date.now()
                        }, !!api$1 && api$1.replaceData);
                        self.updatedAt = Date.now();
                    }
                    if (!json.ok) {
                        self.updateMessage((_b = (_a = json.msg) !== null && _a !== void 0 ? _a : options.errorMessage) !== null && _b !== void 0 ? _b : self.__('saveFailed'), true);
                        mobxStateTree.getEnv(self).notify('error', self.msg, json.msgTimeout !== undefined
                            ? {
                                closeButton: true,
                                timeout: json.msgTimeout
                            }
                            : undefined);
                        throw new ServerError(self.msg);
                    }
                    else {
                        self.updateMessage((_c = json.msg) !== null && _c !== void 0 ? _c : options.successMessage);
                        self.msg &&
                            mobxStateTree.getEnv(self).notify('success', self.msg, json.msgTimeout !== undefined
                                ? {
                                    closeButton: true,
                                    timeout: json.msgTimeout
                                }
                                : undefined);
                    }
                    return [2 /*return*/, json.data];
                case 2:
                    e_2 = _d.sent();
                    self.markSaving(false);
                    if (!mobxStateTree.isAlive(self) || self.disposed) {
                        return [2 /*return*/];
                    }
                    e_2.type !== 'ServerError' && mobxStateTree.getEnv(self).notify('error', e_2.message);
                    throw e_2;
                case 3: return [2 /*return*/];
            }
        });
    });
    var setFilterTogglable = function (toggable, filterVisible) {
        self.filterTogggable = toggable;
        filterVisible !== void 0 && (self.filterVisible = filterVisible);
    };
    var setFilterVisible = function (visible) {
        self.filterVisible = visible;
    };
    var setSelectedItems = function (items) {
        self.selectedItems.replace(items);
    };
    var setUnSelectedItems = function (items) {
        self.unSelectedItems.replace(items);
    };
    var updateSelectData = function (selected, unSelected) {
        self.selectedItems.replace(selected);
        self.unSelectedItems.replace(unSelected);
        // 同步到data中，使filter等部分也能拿到
        self.reInitData({
            selectedItems: selected,
            unSelectedItems: unSelected
        });
    };
    var setInnerModalOpened = function (value) {
        self.hasInnerModalOpen = value;
    };
    var initFromScope = function (scope, source) {
        var rowsData = resolveVariableAndFilter.resolveVariableAndFilter(source, scope, '| raw');
        if (!Array.isArray(rowsData) && !self.items.length) {
            return;
        }
        rowsData = Array.isArray(rowsData) ? rowsData : [];
        var data = tslib.__assign(tslib.__assign({}, self.pristine), { items: rowsData, count: 0, total: rowsData.length });
        self.items.replace(rowsData);
        self.reInitData(data);
    };
    var exportAsCSV = function (options) {
        if (options === void 0) { options = {}; }
        return tslib.__awaiter(void 0, void 0, void 0, function () {
            var items, env, res;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = options.loadDataOnce ? self.data.itemsRaw : self.data.items;
                        if (!options.api) return [3 /*break*/, 2];
                        env = mobxStateTree.getEnv(self);
                        return [4 /*yield*/, env.fetcher(options.api, options.data)];
                    case 1:
                        res = _a.sent();
                        if (!res.data) {
                            return [2 /*return*/];
                        }
                        if (Array.isArray(res.data)) {
                            items = res.data;
                        }
                        else {
                            items = res.data.rows || res.data.items;
                        }
                        _a.label = 2;
                    case 2:
                        Promise.resolve().then(function() {return new Promise(function(fullfill) {require(['papaparse'], function(mod) {fullfill(tslib.__importStar(mod))})})}).then(function (papaparse) {
                            var csvText = papaparse.unparse(items);
                            if (csvText) {
                                var blob = new Blob(
                                // 加上 BOM 这样 Excel 打开的时候就不会乱码
                                [new Uint8Array([0xef, 0xbb, 0xbf]), csvText], {
                                    type: 'text/plain;charset=utf-8'
                                });
                                fileSaver.saveAs(blob, 'data.csv');
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    var getData = function (superData) {
        return object.createObject(superData, {
            total: self.total,
            page: self.page,
            items: self.items.concat(),
            selectedItems: self.selectedItems.concat(),
            unSelectedItems: self.unSelectedItems.concat()
        });
    };
    var updateColumns = function (columns) {
        self.columns = columns;
    };
    return {
        getData: getData,
        updateSelectData: updateSelectData,
        setPristineQuery: setPristineQuery,
        updateQuery: updateQuery,
        fetchInitData: fetchInitData,
        changePage: changePage,
        selectAction: selectAction,
        saveRemote: saveRemote,
        setFilterTogglable: setFilterTogglable,
        setFilterVisible: setFilterVisible,
        setSelectedItems: setSelectedItems,
        setUnSelectedItems: setUnSelectedItems,
        setInnerModalOpened: setInnerModalOpened,
        initFromScope: initFromScope,
        exportAsCSV: exportAsCSV,
        updateColumns: updateColumns
    };
});

exports.CRUDStore = CRUDStore;
