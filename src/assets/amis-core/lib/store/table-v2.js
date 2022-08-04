/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var mobxStateTree = require('mobx-state-tree');
var find = require('lodash/find');
var isEqual = require('lodash/isEqual');
var helper = require('../utils/helper.js');
var api = require('../utils/api.js');
var service = require('./service.js');
var object = require('../utils/object.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var find__default = /*#__PURE__*/_interopDefaultLegacy(find);
var isEqual__default = /*#__PURE__*/_interopDefaultLegacy(isEqual);

var ServerError = /** @class */ (function (_super) {
    tslib.__extends(ServerError, _super);
    function ServerError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'ServerError';
        return _this;
    }
    return ServerError;
}(Error));
var Column = mobxStateTree.types
    .model('Column', {
    title: mobxStateTree.types.optional(mobxStateTree.types.frozen(), undefined),
    key: '',
    toggled: false,
    breakpoint: mobxStateTree.types.optional(mobxStateTree.types.frozen(), undefined),
    pristine: mobxStateTree.types.optional(mobxStateTree.types.frozen(), undefined),
    toggable: true,
    index: 0,
    type: '',
    children: mobxStateTree.types.optional(mobxStateTree.types.array(mobxStateTree.types.late(function () { return Column; })), [])
})
    .actions(function (self) { return ({
    toggleToggle: function () {
        self.toggled = !self.toggled;
        var table = mobxStateTree.getParent(self, 2);
        if (!table.activeToggaleColumns.length) {
            self.toggled = true;
        }
        table.persistSaveToggledColumns();
    },
    setToggled: function (value) {
        self.toggled = value;
    }
}); });
var Row = mobxStateTree.types
    .model('Row', {
    storeType: 'Row',
    id: mobxStateTree.types.identifier,
    parentId: '',
    key: mobxStateTree.types.string,
    pristine: mobxStateTree.types.frozen({}),
    data: mobxStateTree.types.frozen({}),
    index: mobxStateTree.types.number,
    newIndex: mobxStateTree.types.number,
    depth: mobxStateTree.types.number,
    children: mobxStateTree.types.optional(mobxStateTree.types.array(mobxStateTree.types.late(function () { return Row; })), []),
    path: '' // 行数据的位置
})
    .views(function (self) { return ({
    get checked() {
        return mobxStateTree.getParent(self, self.depth * 2).isSelected(self);
    },
    get modified() {
        if (!self.data) {
            return false;
        }
        return Object.keys(self.data).some(function (key) { return !isEqual__default["default"](self.data[key], self.pristine[key]); });
    },
    get moved() {
        return self.index !== self.newIndex;
    },
    get locals() {
        var children = null;
        if (self.children.length) {
            children = self.children.map(function (item) { return item.locals; });
        }
        var parent = mobxStateTree.getParent(self, 2);
        return object.createObject(object.extendObject(mobxStateTree.getParent(self, self.depth * 2).data, {
            index: self.index,
            // todo 以后再支持多层，目前先一层
            parent: parent.storeType === Row.name ? parent.data : undefined
        }), children
            ? tslib.__assign(tslib.__assign({}, self.data), { children: children }) : self.data);
    },
    getDataWithModifiedChilden: function () {
        var data = tslib.__assign({}, self.data);
        if (data.children && self.children) {
            data.children = self.children.map(function (item) {
                return item.getDataWithModifiedChilden();
            });
        }
        return data;
    }
}); })
    .actions(function (self) { return ({
    replaceWith: function (data) {
        Object.keys(data).forEach(function (key) {
            if (key !== 'id') {
                self[key] = data[key];
            }
        });
        if (Array.isArray(data.children)) {
            var arr = data.children;
            var pool = arr.concat();
            // 把多的删了先
            if (self.children.length > arr.length) {
                self.children.splice(arr.length, self.children.length - arr.length);
            }
            var index = 0;
            var len = self.children.length;
            while (pool.length) {
                // 因为父级id未更新，所以需要将子级的parentId正确指向父级id
                var item = tslib.__assign(tslib.__assign({}, pool.shift()), { parentId: self.id });
                if (index < len) {
                    self.children[index].replaceWith(item);
                }
                else {
                    var row = Row.create(item);
                    self.children.push(row);
                }
                index++;
            }
        }
    },
    change: function (values, savePristine) {
        self.data = helper.immutableExtends(self.data, values);
        savePristine && (self.pristine = self.data);
    },
    reset: function () {
        self.newIndex = self.index;
        self.data = self.pristine;
    }
}); });
var TableStoreV2 = service.ServiceStore.named('TableStoreV2')
    .props({
    columns: mobxStateTree.types.array(Column),
    rows: mobxStateTree.types.array(Row),
    selectedRowKeys: mobxStateTree.types.array(mobxStateTree.types.frozen()),
    selectedRows: mobxStateTree.types.array(mobxStateTree.types.reference(Row)),
    expandedRowKeys: mobxStateTree.types.array(mobxStateTree.types.frozen()),
    columnsTogglable: mobxStateTree.types.optional(mobxStateTree.types.union(mobxStateTree.types.boolean, mobxStateTree.types.literal('auto'), mobxStateTree.types.frozen()), 'auto'),
    orderBy: '',
    order: mobxStateTree.types.optional(mobxStateTree.types.union(mobxStateTree.types.literal('asc'), mobxStateTree.types.literal('desc')), 'asc'),
    query: mobxStateTree.types.optional(mobxStateTree.types.frozen(), {}),
    pageNo: 1,
    pageSize: 10,
    dragging: false
})
    .views(function (self) {
    function getToggable() {
        if (self.columnsTogglable === 'auto') {
            return self.columns.filter.length > 10;
        }
        return !!self.columnsTogglable;
    }
    function hasColumnHidden() {
        return self.columns.findIndex(function (column) { return !column.toggled; }) !== -1;
    }
    function getToggableColumns() {
        return self.columns.filter(function (item) { return helper.isVisible(item.pristine, self.data) && item.toggable !== false; });
    }
    function getActiveToggableColumns() {
        return getToggableColumns().filter(function (item) { return item.toggled; });
    }
    function getAllFilteredColumns(columns) {
        if (columns) {
            return columns
                .filter(function (item) {
                return item &&
                    helper.isVisible(item.pristine, helper.hasVisibleExpression(item.pristine) ? self.data : {}) &&
                    (item.toggled || !item.toggable);
            })
                .map(function (item) { return (tslib.__assign(tslib.__assign({}, item.pristine), { type: item.type, children: item.children
                    ? getAllFilteredColumns(item.children)
                    : undefined })); });
        }
        return [];
    }
    function getFilteredColumns() {
        return getAllFilteredColumns(self.columns);
    }
    function getUnSelectedRows() {
        return helper.flattenTree(self.rows).filter(function (item) { return !item.checked; });
    }
    function getData(superData) {
        return object.createObject(superData, {
            items: self.rows.map(function (item) { return item.data; }),
            selectedItems: self.selectedRows.map(function (item) { return item.data; }),
            unSelectedItems: getUnSelectedRows().map(function (item) { return item.data; })
        });
    }
    function getRowByIndex(rowIndex, levels) {
        if (levels && levels.length > 0) {
            var index = +(levels.shift() || 0);
            return getRowByIndex(index, levels);
        }
        return self.rows[rowIndex];
    }
    function isSelected(row) {
        return !!~self.selectedRows.indexOf(row);
    }
    function getMovedRows() {
        return helper.flattenTree(self.rows).filter(function (item) { return item.moved; });
    }
    function getMoved() {
        return getMovedRows().length;
    }
    return {
        get toggable() {
            return getToggable();
        },
        get columnsData() {
            return self.columns;
        },
        get toggableColumns() {
            return getToggableColumns();
        },
        get filteredColumns() {
            return getFilteredColumns();
        },
        get activeToggaleColumns() {
            return getActiveToggableColumns();
        },
        get dataSource() {
            return self.rows.map(function (item) { return item.data; });
        },
        get currentSelectedRowKeys() {
            return self.selectedRowKeys.map(function (item) { return item; });
        },
        get currentExpandedKeys() {
            return self.expandedRowKeys.map(function (item) { return item; });
        },
        get unSelectedRows() {
            return getUnSelectedRows();
        },
        // 是否隐藏了某列
        hasColumnHidden: function () {
            return hasColumnHidden();
        },
        getData: getData,
        getRowById: function (id) {
            return helper.findTree(self.rows, function (item) { return item.id === id; });
        },
        isSelected: isSelected,
        getRowByIndex: getRowByIndex,
        get moved() {
            return getMoved();
        },
        get movedRows() {
            return getMovedRows();
        }
    };
})
    .actions(function (self) {
    function updateColumns(columns) {
        if (columns && Array.isArray(columns)) {
            var cols = columns.filter(function (column) { return column; }).concat();
            cols = cols.map(function (item, index) { return (tslib.__assign(tslib.__assign({}, item), { index: index, type: item.type || 'plain', pristine: item, toggled: item.toggled !== false, breakpoint: item.breakpoint, children: item.children ? updateColumns(item.children) : [] })); });
            return cols;
        }
        return;
    }
    function update(config) {
        config.columnsTogglable !== void 0 &&
            (self.columnsTogglable = config.columnsTogglable);
        if (typeof config.orderBy === 'string') {
            setOrderByInfo(config.orderBy, config.order === 'desc' ? 'desc' : 'asc');
        }
        if (config.columns && Array.isArray(config.columns)) {
            self.columns.replace(updateColumns(config.columns));
        }
    }
    function exchange(fromIndex, toIndex, item) {
        item = item || self.rows[fromIndex];
        if (item.parentId) {
            var parent_1 = self.getRowById(item.parentId);
            var offset = parent_1.children.indexOf(item) - fromIndex;
            toIndex += offset;
            fromIndex += offset;
            var newRows_1 = parent_1.children.concat();
            newRows_1.splice(fromIndex, 1);
            newRows_1.splice(toIndex, 0, item);
            newRows_1.forEach(function (item, index) { return (item.newIndex = index); });
            parent_1.children.replace(newRows_1);
            return;
        }
        var newRows = self.rows.concat();
        newRows.splice(fromIndex, 1);
        newRows.splice(toIndex, 0, item);
        newRows.forEach(function (item, index) { return (item.newIndex = index); });
        self.rows.replace(newRows);
    }
    function toggleAllColumns() {
        if (self.activeToggaleColumns.length) {
            if (self.activeToggaleColumns.length === self.toggableColumns.length) {
                self.toggableColumns.map(function (column) { return column.setToggled(false); });
            }
            else {
                self.toggableColumns.map(function (column) { return column.setToggled(true); });
            }
        }
        else {
            // 如果没有一个激活的，那就改成全选
            self.toggableColumns.map(function (column) { return column.setToggled(true); });
        }
        persistSaveToggledColumns();
    }
    function persistSaveToggledColumns() {
        var key = location.pathname +
            self.path +
            self.toggableColumns.map(function (item) { return item.key || item.index; }).join('-');
        localStorage.setItem(key, JSON.stringify(self.activeToggaleColumns.map(function (item) { return item.index; })));
    }
    function setOrderByInfo(key, direction) {
        self.orderBy = key;
        self.order = direction;
    }
    function updateQuery(values, updater, pageNoField, pageSizeField, replace) {
        if (pageNoField === void 0) { pageNoField = 'pageNo'; }
        if (pageSizeField === void 0) { pageSizeField = 'pageSize'; }
        if (replace === void 0) { replace = false; }
        var originQuery = self.query;
        self.query = replace
            ? tslib.__assign({}, values) : tslib.__assign(tslib.__assign({}, self.query), values);
        if (self.query[pageNoField || 'pageNo']) {
            self.pageNo = parseInt(self.query[pageNoField || 'pageNo'], 10);
        }
        if (self.query[pageSizeField || 'pageSize']) {
            self.pageSize = parseInt(self.query[pageSizeField || 'pageSize'], 10);
        }
        updater &&
            helper.isObjectShallowModified(originQuery, self.query, false) &&
            setTimeout(updater.bind(null, "?".concat(helper.qsstringify(self.query))), 4);
    }
    function updateSelectedRows(rows, selectedKeys, keyField) {
        helper.eachTree(rows, function (item) {
            if (~selectedKeys.indexOf(item.pristine[keyField || 'key'])) {
                self.selectedRows.push(item.id);
                self.selectedRowKeys.push(item.pristine[keyField || 'key']);
            }
            else if (find__default["default"](selectedKeys, function (a) { return a && a == item.pristine[keyField || 'key']; })) {
                self.selectedRows.push(item.id);
                self.selectedRowKeys.push(item.pristine[keyField || 'key']);
            }
            else if (item.children) {
                updateSelectedRows(item.children, selectedKeys, keyField);
            }
        });
    }
    function updateSelected(selectedKeys, keyField) {
        self.selectedRows.clear();
        self.selectedRowKeys.clear();
        updateSelectedRows(self.rows, selectedKeys, keyField);
    }
    function updateSelectedAll(keyField) {
        var selectedKeys = [];
        helper.eachTree(self.rows, function (item) {
            return selectedKeys.push(item.pristine[keyField || 'key']);
        });
        updateSelectedRows(self.rows, selectedKeys, keyField);
    }
    function updateExpanded(expandedRowKeys, keyField) {
        self.expandedRowKeys.clear();
        helper.eachTree(self.rows, function (item) {
            if (~expandedRowKeys.indexOf(item.pristine[keyField || 'key'])) {
                self.expandedRowKeys.push(item.pristine[keyField || 'key']);
            }
            else if (find__default["default"](expandedRowKeys, function (a) { return a && a == item.pristine[keyField || 'key']; })) {
                self.expandedRowKeys.push(item.pristine[keyField || 'key']);
            }
        });
    }
    // 尽可能的复用 row
    function replaceRow(arr, reUseRow) {
        if (reUseRow === false) {
            self.rows.replace(arr.map(function (item) { return Row.create(item); }));
            return;
        }
        var pool = arr.concat();
        // 把多的删了先
        if (self.rows.length > arr.length) {
            self.rows.splice(arr.length, self.rows.length - arr.length);
        }
        var index = 0;
        var len = self.rows.length;
        while (pool.length) {
            var item = pool.shift();
            if (index < len) {
                self.rows[index].replaceWith(item);
            }
            else {
                var row = Row.create(item);
                self.rows.push(row);
            }
            index++;
        }
    }
    function initChildren(children, depth, pindex, parentId, path, keyField) {
        if (path === void 0) { path = ''; }
        var key = keyField || 'children';
        depth += 1;
        return children.map(function (item, index) {
            item = object.isObject(item)
                ? item
                : {
                    item: item
                };
            var id = helper.guid();
            return {
                id: id,
                parentId: parentId,
                key: String("".concat(pindex, "-").concat(depth, "-").concat(index)),
                path: "".concat(path).concat(index),
                depth: depth,
                index: index,
                newIndex: index,
                pristine: item,
                data: item,
                rowSpans: {},
                children: item && Array.isArray(item[key])
                    ? initChildren(item[key], depth, index, id, "".concat(path).concat(index, "."))
                    : []
            };
        });
    }
    function initRows(rows, getEntryId, reUseRow, keyField) {
        self.selectedRows.clear();
        var key = keyField || 'children';
        var arr = rows.map(function (item, index) {
            var id = getEntryId ? getEntryId(item, index) : helper.guid();
            return {
                id: id,
                key: String("".concat(index, "-1-").concat(index)),
                index: index,
                newIndex: index,
                pristine: item,
                path: "".concat(index),
                data: item,
                depth: 1,
                children: item && Array.isArray(item[key])
                    ? initChildren(item[key], 1, index, id, "".concat(index, "."), key)
                    : []
            };
        });
        replaceRow(arr, reUseRow);
    }
    var saveRemote = mobxStateTree.flow(function saveRemote(api$1, data, options) {
        var json, e_1;
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
                    e_1 = _d.sent();
                    self.markSaving(false);
                    if (!mobxStateTree.isAlive(self) || self.disposed) {
                        return [2 /*return*/];
                    }
                    e_1.type !== 'ServerError' && mobxStateTree.getEnv(self).notify('error', e_1.message);
                    throw e_1;
                case 3: return [2 /*return*/];
            }
        });
    });
    function reset() {
        self.rows.forEach(function (item) { return item.reset(); });
        var rows = self.rows.concat();
        helper.eachTree(rows, function (item) {
            if (item.children) {
                var rows_1 = item.children.concat().sort(function (a, b) { return a.index - b.index; });
                rows_1.forEach(function (item) { return item.reset(); });
                item.children.replace(rows_1);
            }
        });
        rows.forEach(function (item) { return item.reset(); });
        rows = rows.sort(function (a, b) { return a.index - b.index; });
        self.rows.replace(rows);
        self.dragging = false;
    }
    return {
        update: update,
        persistSaveToggledColumns: persistSaveToggledColumns,
        setOrderByInfo: setOrderByInfo,
        updateQuery: updateQuery,
        initRows: initRows,
        updateSelected: updateSelected,
        updateSelectedAll: updateSelectedAll,
        updateExpanded: updateExpanded,
        exchange: exchange,
        reset: reset,
        toggleAllColumns: toggleAllColumns,
        // events
        afterCreate: function () {
            setTimeout(function () {
                if (!mobxStateTree.isAlive(self)) {
                    return;
                }
                var key = location.pathname +
                    self.path +
                    self.toggableColumns.map(function (item) { return item.key || item.index; }).join('-');
                var data = localStorage.getItem(key);
                if (data) {
                    var selectedColumns_1 = JSON.parse(data);
                    self.toggableColumns.forEach(function (item) {
                        return item.setToggled(!!~selectedColumns_1.indexOf(item.index));
                    });
                }
            }, 200);
        },
        saveRemote: saveRemote
    };
});

exports.Column = Column;
exports.Row = Row;
exports.TableStoreV2 = TableStoreV2;
