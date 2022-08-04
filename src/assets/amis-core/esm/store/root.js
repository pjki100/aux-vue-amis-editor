/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __assign } from 'tslib';
import { types } from 'mobx-state-tree';
import { qsparse } from '../utils/helper.js';
import { ServiceStore } from './service.js';
import { createObject } from '../utils/object.js';

var RootStore = ServiceStore.named('RootStore')
    .props({
    runtimeError: types.frozen(),
    runtimeErrorStack: types.frozen(),
    query: types.frozen(),
    visibleState: types.optional(types.frozen(), {}),
    disableState: types.optional(types.frozen(), {})
})
    .views(function (self) { return ({
    get downStream() {
        return self.query
            ? createObject(__assign(__assign(__assign({}, (self.data && self.data.__super ? self.data.__super : null)), self.query), { __query: self.query }), self.data)
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
                qsparse(location.search.substring(1))) ||
            (window.location.search &&
                qsparse(window.location.search.substring(1)));
        self.query = query;
    },
    setVisible: function (id, value) {
        var _a;
        var state = __assign(__assign({}, self.visibleState), (_a = {}, _a[id] = value, _a));
        self.visibleState = state;
    },
    setDisable: function (id, value) {
        var _a;
        var state = __assign(__assign({}, self.disableState), (_a = {}, _a[id] = value, _a));
        self.disableState = state;
    }
}); });

export { RootStore };
