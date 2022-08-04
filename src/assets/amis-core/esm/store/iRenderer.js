/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __assign } from 'tslib';
import { types } from 'mobx-state-tree';
import '../utils/helper.js';
import 'amis-formula';
import 'moment';
import { createObject, extendObject, cloneObject, setVariable, deleteVariable } from '../utils/object.js';
import { getVariable } from '../utils/getVariable.js';
import { dataMapping } from '../utils/dataMapping.js';
import '../utils/filter.js';
import { SimpleMap } from '../utils/SimpleMap.js';
import { StoreNode } from './node.js';

var iRendererStore = StoreNode.named('iRendererStore')
    .props({
    hasRemoteData: types.optional(types.boolean, false),
    data: types.optional(types.frozen(), {}),
    initedAt: 0,
    updatedAt: 0,
    pristine: types.optional(types.frozen(), {}),
    action: types.optional(types.frozen(), undefined),
    dialogOpen: false,
    dialogData: types.optional(types.frozen(), undefined),
    drawerOpen: false,
    drawerData: types.optional(types.frozen(), undefined)
})
    .views(function (self) { return ({
    getValueByName: function (name, canAccessSuper) {
        if (canAccessSuper === void 0) { canAccessSuper = true; }
        return getVariable(self.data, name, canAccessSuper);
    },
    getPristineValueByName: function (name) {
        return getVariable(self.pristine, name, false);
    }
}); })
    .actions(function (self) {
    var dialogCallbacks = new SimpleMap();
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
                var proto = createObject(self.data.__super || null, tag);
                newData = createObject(proto, __assign(__assign({}, (replace ? {} : self.data)), data));
            }
            else {
                newData = extendObject(self.data, data, !replace);
            }
            Object.defineProperty(newData, '__prev', {
                value: __assign({}, prev),
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
            var origin = getVariable(self.data, name, false);
            if (value === origin && !force) {
                return;
            }
            var prev = self.data;
            var data = cloneObject(self.data);
            if (prev.__prev) {
                // 基于之前的 __prev 改
                var prevData = cloneObject(prev.__prev);
                setVariable(prevData, name, origin);
                Object.defineProperty(data, '__prev', {
                    value: prevData,
                    enumerable: false,
                    configurable: false,
                    writable: false
                });
            }
            else {
                Object.defineProperty(data, '__prev', {
                    value: __assign({}, prev),
                    enumerable: false,
                    configurable: false,
                    writable: false
                });
            }
            if (value === undefined) {
                deleteVariable(data, name);
            }
            else {
                setVariable(data, name, value);
            }
            otherModifier === null || otherModifier === void 0 ? void 0 : otherModifier(data);
            if (changePristine) {
                var pristine = cloneObject(self.pristine);
                setVariable(pristine, name, value);
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
                proto = createObject(proto, additonal);
            }
            var data = createObject(proto, __assign({}, ctx));
            if (self.action.dialog && self.action.dialog.data) {
                self.dialogData = dataMapping(self.action.dialog.data, data);
                var clonedAction = __assign(__assign({}, self.action), { dialog: __assign({}, self.action.dialog) });
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
                proto = createObject(proto, additonal);
            }
            var data = createObject(proto, __assign({}, ctx));
            if (self.action.drawer.data) {
                self.drawerData = dataMapping(self.action.drawer.data, data);
                var clonedAction = __assign(__assign({}, self.action), { dialog: __assign({}, self.action.dialog) });
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

export { iRendererStore };
