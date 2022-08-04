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

var AppStore = service.ServiceStore.named('AppStore')
    .props({
    pages: mobxStateTree.types.frozen(),
    activePage: mobxStateTree.types.frozen(),
    folded: false,
    offScreen: false
})
    .views(function (self) { return ({
    get navigations() {
        if (Array.isArray(self.pages)) {
            return helper.mapTree(self.pages, function (item) {
                var visible = item.visible;
                if (visible !== false &&
                    item.path &&
                    !~item.path.indexOf('http') &&
                    ~item.path.indexOf(':')) {
                    visible = false;
                }
                return {
                    label: item.label,
                    icon: item.icon,
                    path: item.path,
                    children: item.children,
                    className: item.className,
                    visible: visible
                };
            });
        }
        return [
            {
                label: self.__('App.navigation'),
                children: []
            }
        ];
    },
    get bcn() {
        var _a;
        return ((_a = self.activePage) === null || _a === void 0 ? void 0 : _a.bcn) || [];
    },
    get pageData() {
        var _a;
        return object.createObject(self.data, {
            params: ((_a = self.activePage) === null || _a === void 0 ? void 0 : _a.params) || {}
        });
    }
}); })
    .actions(function (self) { return ({
    toggleFolded: function () {
        self.folded = !self.folded;
    },
    toggleOffScreen: function () {
        self.offScreen = !self.offScreen;
    },
    setPages: function (pages) {
        if (pages && !Array.isArray(pages)) {
            pages = [pages];
        }
        else if (!Array.isArray(pages)) {
            return;
        }
        pages = helper.mapTree(pages, function (item, index, level, paths) {
            var path = item.link || item.url;
            if (item.schema || item.schemaApi) {
                path =
                    item.url ||
                        "/".concat(paths
                            .map(function (item) { return item.index; })
                            .concat(index)
                            .map(function (index) { return "page-".concat(index + 1); })
                            .join('/'));
                if (path && path[0] !== '/') {
                    var parentPath = '/';
                    var index_1 = paths.length;
                    while (index_1 > 0) {
                        var item_1 = paths[index_1 - 1];
                        if (item_1 === null || item_1 === void 0 ? void 0 : item_1.path) {
                            parentPath = item_1.path + '/';
                            break;
                        }
                        index_1--;
                    }
                    path = parentPath + path;
                }
            }
            return tslib.__assign(tslib.__assign({}, item), { index: index, id: item.id || helper.guid(), label: item.label, icon: item.icon, path: path });
        });
        self.pages = pages;
    },
    rewrite: function (to, env) {
        var page = helper.findTree(self.pages, function (item) {
            if (item.path === to) {
                return true;
            }
            return false;
        });
        if (page) {
            this.setActivePage(page, env);
        }
    },
    setActivePage: function (page, env, params) {
        var _a;
        // 同一个页面直接返回。
        if (((_a = self.activePage) === null || _a === void 0 ? void 0 : _a.id) === page.id) {
            return;
        }
        var bcn = [];
        helper.findTree(self.pages, function (item, index, level, paths) {
            if (item.id === page.id) {
                bcn = paths.filter(function (item) { return item.path && item.label; });
                if (env.showFullBreadcrumbPath) {
                    bcn = paths.filter(function (item) { return item.label; });
                }
                bcn.push(tslib.__assign(tslib.__assign({}, item), { path: '' }));
                self.__;
                if (env.showBreadcrumbHomePath && bcn[0].path !== '/') {
                    bcn.unshift({
                        label: self.__('App.home'),
                        path: '/'
                    });
                }
                return true;
            }
            return false;
        });
        self.activePage = tslib.__assign(tslib.__assign({}, page), { params: params || {}, bcn: bcn });
        if (page.label) {
            document.title = page.label;
        }
        if (page.schema) {
            self.schema = page.schema;
            self.schemaKey = '' + Date.now();
        }
        else if (page.schemaApi) {
            self.schema = null;
            self.fetchSchema(page.schemaApi, self.activePage, { method: 'get' });
        }
        else if (page.redirect) {
            env.jumpTo(page.redirect);
            return;
        }
        else if (page.rewrite) {
            this.rewrite(page.rewrite, env);
        }
        else {
            self.schema = null;
            self.schemaKey = '';
        }
    },
    updateActivePage: function (env) {
        if (!Array.isArray(self.pages)) {
            return;
        }
        var matched;
        var page = helper.findTree(self.pages, function (item) {
            if (item.path) {
                matched = env.isCurrentUrl(item.path, item);
                if (matched) {
                    return true;
                }
            }
            return false;
        });
        if (page) {
            this.setActivePage(page, env, typeof matched === 'object' ? matched.params : undefined);
        }
        else {
            var page_1 = helper.findTree(self.pages, function (item) { return item.isDefaultPage; });
            if (page_1) {
                this.setActivePage(page_1, env);
            }
            else {
                self.activePage = null;
            }
        }
    }
}); });

exports.AppStore = AppStore;
