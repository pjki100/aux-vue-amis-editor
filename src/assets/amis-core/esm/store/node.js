/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { types, isAlive, getEnv, destroy } from 'mobx-state-tree';
import { getStoreById } from './manager.js';

var StoreNode = types
    .model('StoreNode', {
    id: types.identifier,
    path: '',
    storeType: types.string,
    disposed: false,
    parentId: '',
    childrenIds: types.optional(types.array(types.string), [])
})
    .views(function (self) {
    return {
        get parentStore() {
            return isAlive(self) && self.parentId
                ? getStoreById(self.parentId)
                : null;
        },
        get __() {
            return getEnv(self).translate;
        },
        get hasChildren() {
            return !!self.childrenIds.length;
        },
        get children() {
            return self.childrenIds.map(function (item) { return getStoreById(item); });
        }
    };
})
    .actions(function (self) {
    function addChildId(id) {
        self.childrenIds.push(id);
    }
    function removeChildId(id) {
        var childrenIds = self.childrenIds.filter(function (item) { return item !== id; });
        self.childrenIds.replace(childrenIds);
        self.disposed && dispose();
    }
    function dispose(callback) {
        var _a;
        // 先标记自己是要销毁的。
        self.disposed = true;
        if (/(?:dialog|drawer)$/.test(self.path)) {
            destroy(self);
            callback === null || callback === void 0 ? void 0 : callback();
        }
        else if (!self.childrenIds.length) {
            var parent_1 = self.parentStore;
            (_a = parent_1 === null || parent_1 === void 0 ? void 0 : parent_1.onChildStoreDispose) === null || _a === void 0 ? void 0 : _a.call(parent_1, self);
            destroy(self);
            callback === null || callback === void 0 ? void 0 : callback();
            // destroy(self);
        }
    }
    return {
        onChildStoreDispose: function (child) {
            removeChildId(child.id);
        },
        syncProps: function (props, prevProps, list) {
            if (list === void 0) { list = Object.keys(props); }
            var target = self;
            list.forEach(function (key) {
                if (prevProps && props[key] === prevProps[key]) {
                    return;
                }
                var setter = "set".concat(key
                    .substring(0, 1)
                    .toUpperCase()).concat(key.substring(1));
                if (typeof target[setter] === 'function') {
                    target[setter](props[key]);
                }
                else if (target.hasOwnProperty(key)) {
                    target[key] = props[key];
                }
            });
        },
        dispose: dispose,
        addChildId: addChildId,
        removeChildId: removeChildId
    };
});

export { StoreNode };
