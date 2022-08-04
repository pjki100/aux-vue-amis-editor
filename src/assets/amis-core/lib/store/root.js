/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var mobxStateTree = require('mobx-state-tree');
var helper = require('../utils/helper.js');
var service = require('./service.js');
var object = require('../utils/object.js');

var RootStore = service.ServiceStore.named('RootStore')
    .props({
    runtimeError: mobxStateTree.types.frozen(),
    runtimeErrorStack: mobxStateTree.types.frozen(),
    query: mobxStateTree.types.frozen(),
    visibleState: mobxStateTree.types.optional(mobxStateTree.types.frozen(), {}),
    disableState: mobxStateTree.types.optional(mobxStateTree.types.frozen(), {})
})
    .views(function (self) { return ({
    get downStream() {
        return self.query
            ? object.createObject(tslib.__assign(tslib.__assign(tslib.__assign({}, (self.data && self.data.__super ? self.data.__super : null)), self.query), { __query: self.query }), self.data)
            : self.data;
    }
}); })
    .actions(function (self) { return ({
    setRuntimeError: function (error, errorStack) {
        self.runtimeError = error;
        self.runtimeErrorStack = errorStack;
    },
    updateLocation: function (location) {
        var query = (location && location.query) ||
            (location &&
                location.search &&
                helper.qsparse(location.search.substring(1))) ||
            (window.location.search &&
                helper.qsparse(window.location.search.substring(1)));
        self.query = query;
    },
    setVisible: function (id, value) {
        var _a;
        var state = tslib.__assign(tslib.__assign({}, self.visibleState), (_a = {}, _a[id] = value, _a));
        self.visibleState = state;
    },
    setDisable: function (id, value) {
        var _a;
        var state = tslib.__assign(tslib.__assign({}, self.disableState), (_a = {}, _a[id] = value, _a));
        self.disableState = state;
    }
}); });

exports.RootStore = RootStore;
