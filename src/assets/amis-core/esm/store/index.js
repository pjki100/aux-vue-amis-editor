/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { setLivelinessChecking, types, getEnv } from 'mobx-state-tree';
export { iRendererStore } from './iRenderer.js';
import { ServiceStore } from './service.js';
export { ServiceStore } from './service.js';
import { ComboStore } from './combo.js';
export { ComboStore } from './combo.js';
import { FormStore } from './form.js';
export { FormStore } from './form.js';
import { CRUDStore } from './crud.js';
export { CRUDStore } from './crud.js';
import { TableStore } from './table.js';
export { TableStore } from './table.js';
import { TableStoreV2 } from './table-v2.js';
export { TableStoreV2 } from './table-v2.js';
import { ListStore } from './list.js';
export { ListStore } from './list.js';
import { ModalStore } from './modal.js';
export { ModalStore } from './modal.js';
import find from 'lodash/find';
export { StoreNode } from './node.js';
import { FormItemStore } from './formItem.js';
export { FormItemStore } from './formItem.js';
import { getStoreById, getStores, addStore, removeStore } from './manager.js';
import { PaginationStore } from './pagination.js';
export { PaginationStore } from './pagination.js';
import { AppStore } from './app.js';
export { AppStore } from './app.js';
import { RootStore } from './root.js';

setLivelinessChecking(process.env.NODE_ENV === 'production' ? 'ignore' : 'error');
var allowedStoreList = [
    ServiceStore,
    FormStore,
    ComboStore,
    CRUDStore,
    TableStore,
    TableStoreV2,
    ListStore,
    ModalStore,
    FormItemStore,
    PaginationStore,
    AppStore
];
var RendererStore = types
    .model('RendererStore', {
    storeType: 'RendererStore'
})
    .views(function (self) { return ({
    get fetcher() {
        return getEnv(self).fetcher;
    },
    get notify() {
        return getEnv(self).notify;
    },
    get isCancel() {
        return getEnv(self).isCancel;
    },
    get __() {
        return getEnv(self).translate;
    },
    getStoreById: function (id) {
        return getStoreById(id);
    },
    get stores() {
        return getStores();
    }
}); })
    .actions(function (self) { return ({
    addStore: function (store) {
        if (store.storeType === RootStore.name) {
            return addStore(RootStore.create(store, getEnv(self)));
        }
        var factory = find(allowedStoreList, function (item) { return item.name === store.storeType; });
        return addStore(factory.create(store, getEnv(self)));
    },
    removeStore: function (store) {
        // store.dispose();
        removeStore(store);
    }
}); });
var RegisterStore = function (store) {
    allowedStoreList.push(store);
};

export { RegisterStore, RendererStore };
