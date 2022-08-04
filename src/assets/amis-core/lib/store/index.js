/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mobxStateTree = require('mobx-state-tree');
var iRenderer = require('./iRenderer.js');
var service = require('./service.js');
var combo = require('./combo.js');
var form = require('./form.js');
var crud = require('./crud.js');
var table = require('./table.js');
var tableV2 = require('./table-v2.js');
var list = require('./list.js');
var modal = require('./modal.js');
var find = require('lodash/find');
var node = require('./node.js');
var formItem = require('./formItem.js');
var manager = require('./manager.js');
var pagination = require('./pagination.js');
var app = require('./app.js');
var root = require('./root.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var find__default = /*#__PURE__*/_interopDefaultLegacy(find);

mobxStateTree.setLivelinessChecking(process.env.NODE_ENV === 'production' ? 'ignore' : 'error');
var allowedStoreList = [
    service.ServiceStore,
    form.FormStore,
    combo.ComboStore,
    crud.CRUDStore,
    table.TableStore,
    tableV2.TableStoreV2,
    list.ListStore,
    modal.ModalStore,
    formItem.FormItemStore,
    pagination.PaginationStore,
    app.AppStore
];
var RendererStore = mobxStateTree.types
    .model('RendererStore', {
    storeType: 'RendererStore'
})
    .views(function (self) { return ({
    get fetcher() {
        return mobxStateTree.getEnv(self).fetcher;
    },
    get notify() {
        return mobxStateTree.getEnv(self).notify;
    },
    get isCancel() {
        return mobxStateTree.getEnv(self).isCancel;
    },
    get __() {
        return mobxStateTree.getEnv(self).translate;
    },
    getStoreById: function (id) {
        return manager.getStoreById(id);
    },
    get stores() {
        return manager.getStores();
    }
}); })
    .actions(function (self) { return ({
    addStore: function (store) {
        if (store.storeType === root.RootStore.name) {
            return manager.addStore(root.RootStore.create(store, mobxStateTree.getEnv(self)));
        }
        var factory = find__default["default"](allowedStoreList, function (item) { return item.name === store.storeType; });
        return manager.addStore(factory.create(store, mobxStateTree.getEnv(self)));
    },
    removeStore: function (store) {
        // store.dispose();
        manager.removeStore(store);
    }
}); });
var RegisterStore = function (store) {
    allowedStoreList.push(store);
};

exports.iRendererStore = iRenderer.iRendererStore;
exports.ServiceStore = service.ServiceStore;
exports.ComboStore = combo.ComboStore;
exports.FormStore = form.FormStore;
exports.CRUDStore = crud.CRUDStore;
exports.TableStore = table.TableStore;
exports.TableStoreV2 = tableV2.TableStoreV2;
exports.ListStore = list.ListStore;
exports.ModalStore = modal.ModalStore;
exports.StoreNode = node.StoreNode;
exports.FormItemStore = formItem.FormItemStore;
exports.PaginationStore = pagination.PaginationStore;
exports.AppStore = app.AppStore;
exports.RegisterStore = RegisterStore;
exports.RendererStore = RendererStore;
