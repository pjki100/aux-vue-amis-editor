/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../utils/helper.js');
require('amis-formula');
require('moment');
var object = require('../utils/object.js');
var resolveVariable = require('../utils/resolveVariable.js');
require('tslib');
require('lodash/isPlainObject');
require('../utils/filter.js');
var iRenderer = require('./iRenderer.js');

var PaginationStore = iRenderer.iRendererStore
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
        var items = resolveVariable.resolveVariable(self.inputName || 'items', self.data);
        if (!Array.isArray(items)) {
            return [];
        }
        return items;
    },
    get locals() {
        var _a;
        var skip = (self.page - 1) * self.perPage;
        return object.createObject(self.data, (_a = {
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

exports.PaginationStore = PaginationStore;
