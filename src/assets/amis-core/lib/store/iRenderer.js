/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var mobxStateTree = require('mobx-state-tree');
require('../utils/helper.js');
require('amis-formula');
require('moment');
var object = require('../utils/object.js');
var getVariable = require('../utils/getVariable.js');
var dataMapping = require('../utils/dataMapping.js');
require('../utils/filter.js');
var SimpleMap = require('../utils/SimpleMap.js');
var node = require('./node.js');

var iRendererStore = node.StoreNode.named('iRendererStore')
    .props({
    hasRemoteData: mobxStateTree.types.optional(mobxStateTree.types.boolean, false),
    data: mobxStateTree.types.optional(mobxStateTree.types.frozen(), {}),
    initedAt: 0,
    updatedAt: 0,
    pristine: mobxStateTree.types.optional(mobxStateTree.types.frozen(), {}),
    action: mobxStateTree.types.optional(mobxStateTree.types.frozen(), undefined),
    dialogOpen: false,
    dialogData: mobxStateTree.types.optional(mobxStateTree.types.frozen(), undefined),
    drawerOpen: false,
    drawerData: mobxStateTree.types.optional(mobxStateTree.types.frozen(), undefined)
})
    .views(function (self) { return ({
    getValueByName: function (name, canAccessSuper) {
        if (canAccessSuper === void 0) { canAccessSuper = true; }
        return getVariable.getVariable(self.data, name, canAccessSuper);
    },
    getPristineValueByName: function (name) {
        return getVariable.getVariable(self.pristine, name, false);
    }
}); })
    .actions(function (self) {
    var dialogCallbacks = new SimpleMap.SimpleMap();
    return {
        initData: function (data, skipSetPristine) {
            if (data === void 0) { data = {}; }
            if (skipSetPristine === void 0) { skipSetPristine = false; }
            self.initedAt = Date.now();
            !skipSetPristine && (self.pristine = data);
            self.data = data;
        },
        reset: function () {
            self.data = self.pristine;
        },
        updateData: function (data, tag, replace) {
            if (data === void 0) { data = {}; }
            var prev = self.data;
            var newData;
            if (tag) {
                var proto = object.createObject(self.data.__super || null, tag);
                newData = object.createObject(proto, tslib.__assign(tslib.__assign({}, (replace ? {} : self.data)), data));
            }
            else {
                newData = object.extendObject(self.data, data, !replace);
            }
            Object.defineProperty(newData, '__prev', {
                value: tslib.__assign({}, prev),
                enumerable: false,
                configurable: false,
                writable: false
            });
            self.data = newData;
        },
        changeValue: function (name, value, changePristine, force, otherModifier) {
            if (!name) {
                return;
            }
            var origin = getVariable.getVariable(self.data, name, false);
            if (value === origin && !force) {
                return;
            }
            var prev = self.data;
            var data = object.cloneObject(self.data);
            if (prev.__prev) {
                // 基于之前的 __prev 改
                var prevData = object.cloneObject(prev.__prev);
                object.setVariable(prevData, name, origin);
                Object.defineProperty(data, '__prev', {
                    value: prevData,
                    enumerable: false,
                    configurable: false,
                    writable: false
                });
            }
            else {
                Object.defineProperty(data, '__prev', {
                    value: tslib.__assign({}, prev),
                    enumerable: false,
                    configurable: false,
                    writable: false
                });
            }
            if (value === undefined) {
                object.deleteVariable(data, name);
            }
            else {
                object.setVariable(data, name, value);
            }
            otherModifier === null || otherModifier === void 0 ? void 0 : otherModifier(data);
            if (changePristine) {
                var pristine = object.cloneObject(self.pristine);
                object.setVariable(pristine, name, value);
                otherModifier === null || otherModifier === void 0 ? void 0 : otherModifier(pristine);
                self.pristine = pristine;
            }
            if (!data.__pristine) {
                Object.defineProperty(data, '__pristine', {
                    value: self.pristine,
                    enumerable: false,
                    configurable: false,
                    writable: false
                });
            }
            self.data = data;
        },
        setCurrentAction: function (action) {
            self.action = action;
        },
        openDialog: function (ctx, additonal, callback) {
            var proto = ctx.__super ? ctx.__super : self.data;
            if (additonal) {
                proto = object.createObject(proto, additonal);
            }
            var data = object.createObject(proto, tslib.__assign({}, ctx));
            if (self.action.dialog && self.action.dialog.data) {
                self.dialogData = dataMapping.dataMapping(self.action.dialog.data, data);
                var clonedAction = tslib.__assign(tslib.__assign({}, self.action), { dialog: tslib.__assign({}, self.action.dialog) });
                delete clonedAction.dialog.data;
                self.action = clonedAction;
            }
            else {
                self.dialogData = data;
            }
            self.dialogOpen = true;
            callback && dialogCallbacks.set(self.dialogData, callback);
        },
        closeDialog: function (result) {
            var callback = dialogCallbacks.get(self.dialogData);
            self.dialogOpen = false;
            if (callback) {
                dialogCallbacks.delete(self.dialogData);
                setTimeout(function () { return callback(result); }, 200);
            }
        },
        openDrawer: function (ctx, additonal, callback) {
            var proto = ctx.__super ? ctx.__super : self.data;
            if (additonal) {
                proto = object.createObject(proto, additonal);
            }
            var data = object.createObject(proto, tslib.__assign({}, ctx));
            if (self.action.drawer.data) {
                self.drawerData = dataMapping.dataMapping(self.action.drawer.data, data);
                var clonedAction = tslib.__assign(tslib.__assign({}, self.action), { dialog: tslib.__assign({}, self.action.dialog) });
                delete clonedAction.dialog.data;
                self.action = clonedAction;
            }
            else {
                self.drawerData = data;
            }
            self.drawerOpen = true;
            if (callback) {
                dialogCallbacks.set(self.drawerData, callback);
            }
        },
        closeDrawer: function (result) {
            var callback = dialogCallbacks.get(self.drawerData);
            self.drawerOpen = false;
            if (callback) {
                dialogCallbacks.delete(self.drawerData);
                setTimeout(function () { return callback(result); }, 200);
            }
        }
    };
});
// export type SIRendererStore = typeof iRendererStore.SnapshotType;

exports.iRendererStore = iRendererStore;
