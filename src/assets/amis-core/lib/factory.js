/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var index = require('./store/index.js');
var mobxStateTree = require('mobx-state-tree');
var api = require('./utils/api.js');
var normalizeLink = require('./utils/normalizeLink.js');
var helper = require('./utils/helper.js');
var mobxReact = require('mobx-react');
var Scoped = require('./Scoped.js');
var find = require('lodash/find');
var WithStore = require('./WithStore.js');
var Placeholder = require('./renderers/Placeholder.js');
var string2regExp = require('./utils/string2regExp.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var find__default = /*#__PURE__*/_interopDefaultLegacy(find);

var _a, _b;
var renderers = [];
var renderersMap = {};
var schemaFilters = [];
var anonymousIndex = 1;
function addSchemaFilter(fn) {
    schemaFilters.push(fn);
}
function filterSchema(schema, render, props) {
    return schemaFilters.reduce(function (schema, filter) { return filter(schema, render, props); }, schema);
}
function Renderer(config) {
    return function (component) {
        var renderer = registerRenderer(tslib.__assign(tslib.__assign({}, config), { component: component }));
        return renderer.component;
    };
}
function registerRenderer(config) {
    if (!config.test && !config.type) {
        throw new TypeError('please set config.test or config.type');
    }
    else if (!config.component) {
        throw new TypeError('config.component is required');
    }
    if (typeof config.type === 'string' && config.type) {
        config.type = config.type.toLowerCase();
        config.test =
            config.test || new RegExp("(^|/)".concat(string2regExp.string2regExp(config.type), "$"), 'i');
    }
    config.weight = config.weight || 0;
    config.Renderer = config.component;
    config.name = config.name || config.type || "anonymous-".concat(anonymousIndex++);
    if (renderersMap[config.name]) {
        throw new Error("The renderer with name \"".concat(config.name, "\" has already exists, please try another name!"));
    }
    else if (renderersMap.hasOwnProperty(config.name)) {
        // 后面补充的
        var idx_1 = helper.findIndex(renderers, function (item) { return item.name === config.name; });
        ~idx_1 && renderers.splice(idx_1, 0, config);
    }
    if (config.storeType && config.component) {
        config.component = WithStore.HocStoreFactory({
            storeType: config.storeType,
            extendsData: config.storeExtendsData,
            shouldSyncSuperStore: config.shouldSyncSuperStore
        })(mobxReact.observer(config.component));
    }
    if (config.isolateScope) {
        config.component = Scoped.HocScoped(config.component);
    }
    var idx = helper.findIndex(renderers, function (item) { return config.weight < item.weight; });
    ~idx ? renderers.splice(idx, 0, config) : renderers.push(config);
    renderersMap[config.name] = config.component !== Placeholder.Placeholder;
    return config;
}
function unRegisterRenderer(config) {
    var name = (typeof config === 'string' ? config : config.name);
    delete renderersMap[name];
    // 清空渲染器定位缓存
    cache = {};
}
function loadRenderer(schema, path) {
    return (React__default["default"].createElement("div", { className: "RuntimeError" },
        React__default["default"].createElement("p", null, "Error: \u627E\u4E0D\u5230\u5BF9\u5E94\u7684\u6E32\u67D3\u5668"),
        React__default["default"].createElement("p", null,
            "Path: ",
            path),
        React__default["default"].createElement("pre", null,
            React__default["default"].createElement("code", null, JSON.stringify(schema, null, 2)))));
}
var defaultOptions = {
    session: 'global',
    affixOffsetTop: 0,
    affixOffsetBottom: 0,
    richTextToken: '',
    useMobileUI: true,
    enableAMISDebug: (_b = (_a = window.enableAMISDebug) !== null && _a !== void 0 ? _a : location.search.indexOf('amisDebug=1') !== -1) !== null && _b !== void 0 ? _b : false,
    loadRenderer: loadRenderer,
    fetcher: function () {
        return Promise.reject('fetcher is required');
    },
    // 使用 WebSocket 来实时获取数据
    wsFetcher: function (ws, onMessage, onError) {
        if (ws) {
            var socket_1 = new WebSocket(ws.url);
            socket_1.onopen = function (event) {
                if (ws.body) {
                    socket_1.send(JSON.stringify(ws.body));
                }
            };
            socket_1.onmessage = function (event) {
                var _a;
                if (event.data) {
                    var data = void 0;
                    try {
                        data = JSON.parse(event.data);
                    }
                    catch (error) { }
                    if (typeof data !== 'object') {
                        var key = ws.responseKey || 'data';
                        data = (_a = {},
                            _a[key] = event.data,
                            _a);
                    }
                    onMessage(data);
                }
            };
            socket_1.onerror = onError;
            return {
                close: socket_1.close
            };
        }
        else {
            return {
                close: function () { }
            };
        }
    },
    isCancel: function () {
        console.error('Please implement isCancel. see https://baidu.gitee.io/amis/docs/start/getting-started#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97');
        return false;
    },
    updateLocation: function () {
        console.error('Please implement updateLocation. see https://baidu.gitee.io/amis/docs/start/getting-started#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97');
    },
    jumpTo: function (to, action) {
        if (to === 'goBack') {
            return window.history.back();
        }
        to = normalizeLink.normalizeLink(to);
        if (action && action.actionType === 'url') {
            action.blank === false ? (window.location.href = to) : window.open(to);
            return;
        }
        if (/^https?:\/\//.test(to)) {
            window.location.replace(to);
        }
        else {
            location.href = to;
        }
    },
    isCurrentUrl: function (to) {
        if (!to) {
            return false;
        }
        var link = normalizeLink.normalizeLink(to);
        var location = window.location;
        var pathname = link;
        var search = '';
        var idx = link.indexOf('?');
        if (~idx) {
            pathname = link.substring(0, idx);
            search = link.substring(idx);
        }
        if (search) {
            if (pathname !== location.pathname || !location.search) {
                return false;
            }
            var query_1 = helper.qsparse(search.substring(1));
            var currentQuery_1 = helper.qsparse(location.search.substring(1));
            return Object.keys(query_1).every(function (key) { return query_1[key] === currentQuery_1[key]; });
        }
        else if (pathname === location.pathname) {
            return true;
        }
        return false;
    },
    copy: function (contents) {
        console.error('copy contents', contents);
    },
    // 用于跟踪用户在界面中的各种操作
    tracker: function (eventTrack, props) { },
    rendererResolver: resolveRenderer,
    replaceTextIgnoreKeys: [
        'type',
        'name',
        'mode',
        'target',
        'reload',
        'persistData'
    ],
    /**
     * 过滤 html 标签，可用来添加 xss 保护逻辑
     */
    filterHtml: function (input) { return input; }
};
var stores = {};
// 默认 env 会被缓存，所以新传入的 env 不会替换旧的。
// 除非先删了旧的，新的才会生效。
function clearStoresCache(sessions) {
    if (sessions === void 0) { sessions = Object.keys(stores); }
    if (!Array.isArray(sessions)) {
        sessions = [sessions];
    }
    sessions.forEach(function (key) {
        var store = stores[key];
        // @ts-ignore
        delete stores[key];
        store && mobxStateTree.destroy(store);
    });
}
// 当然也可以直接这样更新。
// 主要是有时候第一次创建的时候并没有准备多少接口，
// 可以后续补充点，比如 amis 自己实现的，prompt 里面的表单。
function updateEnv(options, session) {
    if (session === void 0) { session = 'global'; }
    options = tslib.__assign({}, options);
    if (options.fetcher) {
        options.fetcher = api.wrapFetcher(options.fetcher, options.tracker);
    }
    if (options.confirm) {
        options.confirm = helper.promisify(options.confirm);
    }
    var store = stores[options.session || session];
    if (!store) {
        store = index.RendererStore.create({}, tslib.__assign(tslib.__assign({}, defaultOptions), options));
        stores[options.session || session] = store;
    }
    else {
        var env = mobxStateTree.getEnv(store);
        Object.assign(env, options);
    }
}
// 扩充默认的 env ，这样使用方不需要指定都会有。
function extendDefaultEnv(env) {
    Object.assign(defaultOptions, env);
}
var cache = {};
function resolveRenderer(path, schema) {
    var type = typeof (schema === null || schema === void 0 ? void 0 : schema.type) == 'string' ? schema.type.toLowerCase() : '';
    if (type && cache[type]) {
        return cache[type];
    }
    else if (cache[path]) {
        return cache[path];
    }
    else if (path && path.length > 1024) {
        throw new Error('Path太长是不是死循环了？');
    }
    var renderer = null;
    renderers.some(function (item) {
        var matched = false;
        // 直接匹配类型，后续注册渲染都应该用这个方式而不是之前的判断路径。
        if (item.type && type) {
            matched = item.type === type;
            // 如果是type来命中的，那么cache的key直接用 type 即可。
            if (matched) {
                cache[type] = item;
            }
        }
        else if (typeof item.test === 'function') {
            // 不应该搞得这么复杂的，让每个渲染器唯一 id，自己不晕别人用起来也不晕。
            matched = item.test(path, schema, resolveRenderer);
        }
        else if (item.test instanceof RegExp) {
            matched = item.test.test(path);
        }
        if (matched) {
            renderer = item;
        }
        return matched;
    });
    // 只能缓存纯正则表达式的后者方法中没有用到第二个参数的，
    // 因为自定义 test 函数的有可能依赖 schema 的结果
    if (renderer !== null &&
        renderer.component !== Placeholder.Placeholder &&
        (renderer.type ||
            renderer.test instanceof RegExp ||
            (typeof renderer.test === 'function' &&
                renderer.test.length < 2))) {
        cache[path] = renderer;
    }
    return renderer;
}
function getRenderers() {
    return renderers.concat();
}
function getRendererByName(name) {
    return find__default["default"](renderers, function (item) { return item.name === name; });
}

exports.Renderer = Renderer;
exports.addSchemaFilter = addSchemaFilter;
exports.clearStoresCache = clearStoresCache;
exports.defaultOptions = defaultOptions;
exports.extendDefaultEnv = extendDefaultEnv;
exports.filterSchema = filterSchema;
exports.getRendererByName = getRendererByName;
exports.getRenderers = getRenderers;
exports.loadRenderer = loadRenderer;
exports.registerRenderer = registerRenderer;
exports.resolveRenderer = resolveRenderer;
exports.stores = stores;
exports.unRegisterRenderer = unRegisterRenderer;
exports.updateEnv = updateEnv;
