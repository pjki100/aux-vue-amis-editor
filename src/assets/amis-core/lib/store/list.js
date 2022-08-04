/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mobxStateTree = require('mobx-state-tree');
var iRenderer = require('./iRenderer.js');
var isEqual = require('lodash/isEqual');
var find = require('lodash/find');
var helper = require('../utils/helper.js');
var tpl = require('../utils/tpl.js');
var object = require('../utils/object.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isEqual__default = /*#__PURE__*/_interopDefaultLegacy(isEqual);
var find__default = /*#__PURE__*/_interopDefaultLegacy(find);

var Item = mobxStateTree.types
    .model('Item', {
    id: mobxStateTree.types.identifier,
    pristine: mobxStateTree.types.frozen(),
    data: mobxStateTree.types.frozen(),
    index: mobxStateTree.types.number,
    newIndex: mobxStateTree.types.number
})
    .views(function (self) { return ({
    get checked() {
        return mobxStateTree.getParent(self, 2).isSelected(self);
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
        return object.createObject(object.extendObject(mobxStateTree.getParent(self, 2).data, {
            index: self.index
        }), self.data);
    },
    get checkable() {
        var table = mobxStateTree.getParent(self, 2);
        return table && table.itemCheckableOn
            ? tpl.evalExpression(table.itemCheckableOn, self.locals)
            : true;
    },
    get draggable() {
        var table = mobxStateTree.getParent(self, 2);
        return table && table.itemDraggableOn
            ? tpl.evalExpression(table.itemDraggableOn, self.locals)
            : true;
    }
}); })
    .actions(function (self) { return ({
    toggle: function () {
        mobxStateTree.getParent(self, 2).toggle(self);
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
var ListStore = iRenderer.iRendererStore
    .named('ListStore')
    .props({
    items: mobxStateTree.types.array(Item),
    selectedItems: mobxStateTree.types.array(mobxStateTree.types.reference(Item)),
    primaryField: 'id',
    orderBy: '',
    orderDir: mobxStateTree.types.optional(mobxStateTree.types.union(mobxStateTree.types.literal('asc'), mobxStateTree.types.literal('desc')), 'asc'),
    draggable: false,
    dragging: false,
    multiple: true,
    selectable: false,
    itemCheckableOn: '',
    itemDraggableOn: '',
    hideCheckToggler: false
})
    .views(function (self) {
    function isSelected(item) {
        return !!~self.selectedItems.indexOf(item);
    }
    function getModifiedItems() {
        return self.items.filter(function (item) { return item.modified; });
    }
    function getModified() {
        return getModifiedItems().length;
    }
    function getMovedItems() {
        return self.items.filter(function (item) { return item.moved; });
    }
    function getMovied() {
        return getMovedItems().length;
    }
    return {
        get allChecked() {
            return !!(self.selectedItems.length ===
                self.checkableItems.length &&
                self.checkableItems.length);
        },
        get checkableItems() {
            return self.items.filter(function (item) { return item.checkable; });
        },
        get unSelectedItems() {
            return self.items.filter(function (item) { return !item.checked; });
        },
        isSelected: isSelected,
        get modified() {
            return getModified();
        },
        get modifiedItems() {
            return getModifiedItems();
        },
        get moved() {
            return getMovied();
        },
        get movedItems() {
            return getMovedItems();
        }
    };
})
    .actions(function (self) {
    function update(config) {
        config.selectable === void 0 || (self.selectable = config.selectable);
        config.draggable === void 0 || (self.draggable = config.draggable);
        config.multiple === void 0 || (self.multiple = config.multiple);
        config.hideCheckToggler === void 0 ||
            (self.hideCheckToggler = config.hideCheckToggler);
        if (typeof config.orderBy !== 'undefined') {
            setOrderByInfo(config.orderBy, config.orderDir === 'desc' ? 'desc' : 'asc');
        }
        config.itemCheckableOn === void 0 ||
            (self.itemCheckableOn = config.itemCheckableOn);
        config.itemDraggableOn === void 0 ||
            (self.itemDraggableOn = config.itemDraggableOn);
    }
    function initItems(items) {
        var arr = items.map(function (item, key) {
            item = object.isObject(item)
                ? item
                : {
                    item: item
                };
            return {
                // id: String((item as any)[self.primaryField] || key),
                id: helper.guid(),
                index: key,
                newIndex: key,
                pristine: item,
                data: item,
                modified: false
            };
        });
        self.selectedItems.clear();
        self.items.replace(arr);
        self.dragging = false;
    }
    function updateSelected(selected, valueField) {
        self.selectedItems.clear();
        self.items.forEach(function (item) {
            if (~selected.indexOf(item.pristine)) {
                self.selectedItems.push(item);
            }
            else if (find__default["default"](selected, function (a) {
                return a[valueField || 'value'] == item.pristine[valueField || 'value'];
            })) {
                self.selectedItems.push(item);
            }
        });
    }
    function toggleAll() {
        if (self.allChecked) {
            self.selectedItems.clear();
        }
        else {
            self.selectedItems.replace(self.checkableItems);
        }
    }
    function clearAll() {
        self.selectedItems.clear();
    }
    function selectAll() {
        self.selectedItems.replace(self.checkableItems);
    }
    function toggle(item) {
        if (!item.checkable) {
            return;
        }
        var idx = self.selectedItems.indexOf(item);
        if (self.multiple) {
            ~idx
                ? self.selectedItems.splice(idx, 1)
                : self.selectedItems.push(item);
        }
        else {
            ~idx
                ? self.selectedItems.splice(idx, 1)
                : self.selectedItems.replace([item]);
        }
    }
    function clear() {
        self.selectedItems.clear();
    }
    function setOrderByInfo(key, direction) {
        self.orderBy = key;
        self.orderDir = direction;
    }
    function reset() {
        self.items.forEach(function (item) { return item.reset(); });
        self.dragging = false;
    }
    function toggleDragging() {
        self.dragging = !self.dragging;
    }
    function stopDragging() {
        self.dragging = false;
    }
    function exchange(fromIndex, toIndex) {
        var item = self.items[fromIndex];
        item.newIndex = toIndex;
        var newItems = self.items.slice();
        newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, item);
        self.items.replace(newItems);
    }
    return {
        update: update,
        initItems: initItems,
        updateSelected: updateSelected,
        toggleAll: toggleAll,
        clearAll: clearAll,
        selectAll: selectAll,
        toggle: toggle,
        clear: clear,
        setOrderByInfo: setOrderByInfo,
        reset: reset,
        toggleDragging: toggleDragging,
        stopDragging: stopDragging,
        exchange: exchange
    };
});

exports.Item = Item;
exports.ListStore = ListStore;
