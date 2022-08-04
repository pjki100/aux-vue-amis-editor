/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { types, getParent } from 'mobx-state-tree';
import { iRendererStore } from './iRenderer.js';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import { immutableExtends, guid } from '../utils/helper.js';
import { evalExpression } from '../utils/tpl.js';
import { createObject, extendObject, isObject } from '../utils/object.js';

var Item = types
    .model('Item', {
    id: types.identifier,
    pristine: types.frozen(),
    data: types.frozen(),
    index: types.number,
    newIndex: types.number
})
    .views(function (self) { return ({
    get checked() {
        return getParent(self, 2).isSelected(self);
    },
    get modified() {
        if (!self.data) {
            return false;
        }
        return Object.keys(self.data).some(function (key) { return !isEqual(self.data[key], self.pristine[key]); });
    },
    get moved() {
        return self.index !== self.newIndex;
    },
    get locals() {
        return createObject(extendObject(getParent(self, 2).data, {
            index: self.index
        }), self.data);
    },
    get checkable() {
        var table = getParent(self, 2);
        return table && table.itemCheckableOn
            ? evalExpression(table.itemCheckableOn, self.locals)
            : true;
    },
    get draggable() {
        var table = getParent(self, 2);
        return table && table.itemDraggableOn
            ? evalExpression(table.itemDraggableOn, self.locals)
            : true;
    }
}); })
    .actions(function (self) { return ({
    toggle: function () {
        getParent(self, 2).toggle(self);
    },
    change: function (values, savePristine) {
        self.data = immutableExtends(self.data, values);
        savePristine && (self.pristine = self.data);
    },
    reset: function () {
        self.newIndex = self.index;
        self.data = self.pristine;
    }
}); });
var ListStore = iRendererStore
    .named('ListStore')
    .props({
    items: types.array(Item),
    selectedItems: types.array(types.reference(Item)),
    primaryField: 'id',
    orderBy: '',
    orderDir: types.optional(types.union(types.literal('asc'), types.literal('desc')), 'asc'),
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
            item = isObject(item)
                ? item
                : {
                    item: item
                };
            return {
                // id: String((item as any)[self.primaryField] || key),
                id: guid(),
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
            else if (find(selected, function (a) {
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

export { Item, ListStore };
