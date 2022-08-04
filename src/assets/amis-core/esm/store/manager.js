/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { isAlive } from 'mobx-state-tree';

var stores = {};
function addStore(store) {
    if (stores[store.id]) {
        return stores[store.id];
    }
    stores[store.id] = store;
    // drawer dialog 不加进去，否则有些容器就不会自我销毁 store 了。
    if (store.parentId && !/(?:dialog|drawer)$/.test(store.path)) {
        var parent_1 = stores[store.parentId];
        parent_1.addChildId(store.id);
    }
    cleanUp();
    return store;
}
var toDelete = [];
function removeStore(store) {
    var id = store.id;
    toDelete.push(id);
    store.dispose(cleanUp);
}
function cleanUp() {
    var index = toDelete.length - 1;
    while (index >= 0) {
        var id = toDelete[index];
        var store = stores[id];
        if (store && !isAlive(store)) {
            delete stores[id];
            toDelete.splice(index, 1);
        }
        else {
            index--;
        }
    }
}
function getStoreById(id) {
    return stores[id];
}
function getStores() {
    return stores;
}

export { addStore, getStoreById, getStores, removeStore };
