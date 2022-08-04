/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import '../utils/helper.js';
import 'amis-formula';
import 'moment';
import { createObject } from '../utils/object.js';
import { resolveVariable } from '../utils/resolveVariable.js';
import 'tslib';
import 'lodash/isPlainObject';
import '../utils/filter.js';
import { iRendererStore } from './iRenderer.js';

var PaginationStore = iRendererStore
    .named('PaginationStore')
    .props({
    page: 1,
    perPage: 10,
    inputName: '',
    outputName: '',
    mode: 'normal'
})
    .views(function (self) { return ({
    get inputItems() {
        var items = resolveVariable(self.inputName || 'items', self.data);
        if (!Array.isArray(items)) {
            return [];
        }
        return items;
    },
    get locals() {
        var _a;
        var skip = (self.page - 1) * self.perPage;
        return createObject(self.data, (_a = {
                currentPage: self.page,
                lastPage: this.lastPage
            },
            _a[self.outputName || 'items'] = this.inputItems.slice(skip, skip + self.perPage),
            _a));
    },
    get lastPage() {
        return Math.ceil(this.inputItems.length / self.perPage);
    }
}); })
    .actions(function (self) { return ({
    switchTo: function (page, perPage) {
        self.page = page;
        if (typeof perPage === 'number') {
            self.perPage = perPage;
        }
    }
}); });

export { PaginationStore };
