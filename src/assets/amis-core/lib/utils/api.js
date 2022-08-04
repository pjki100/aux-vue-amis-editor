/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var omit = require('lodash/omit');
var amisFormula = require('amis-formula');
var escapeHtml = require('./escapeHtml.js');
require('moment');
var object = require('./object.js');
var tokenize = require('./tokenize.js');
var dataMapping = require('./dataMapping.js');
require('./filter.js');
var tpl = require('./tpl.js');
var helper = require('./helper.js');
var isPlainObject = require('lodash/isPlainObject');
var debug = require('./debug.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var omit__default = /*#__PURE__*/_interopDefaultLegacy(omit);
var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject);

var rSchema = /(?:^|raw\:)(get|post|put|delete|patch|options|head|jsonp|js):/i;
var apiCaches = [];
var isIE = !!document.documentMode;
function normalizeApi(api, defaultMethod) {
    if (defaultMethod === void 0) { defaultMethod = 'get'; }
    if (typeof api === 'string') {
        var method = rSchema.test(api) ? RegExp.$1 : '';
        method && (api = api.replace(method + ':', ''));
        api = {
            method: (method || defaultMethod),
            url: api
        };
    }
    else {
        api = tslib.__assign({}, api);
    }
    api.url = typeof api.url === 'string' ? api.url.trim() : api.url;
    return api;
}
function buildApi(api, data, options) {
    if (options === void 0) { options = {}; }
    api = normalizeApi(api, options.method);
    var autoAppend = options.autoAppend, ignoreData = options.ignoreData, rest = tslib.__rest(options, ["autoAppend", "ignoreData"]);
    api.config = tslib.__assign({}, rest);
    api.method = (api.method || options.method || 'get').toLowerCase();
    if (api.headers) {
        api.headers = dataMapping.dataMapping(api.headers, data, undefined, false);
    }
    if (api.requestAdaptor && typeof api.requestAdaptor === 'string') {
        api.requestAdaptor = str2function(api.requestAdaptor, 'api');
    }
    if (api.adaptor && typeof api.adaptor === 'string') {
        api.adaptor = str2function(api.adaptor, 'payload', 'response', 'api');
    }
    if (!data) {
        return api;
    }
    else if (data instanceof FormData ||
        data instanceof Blob ||
        data instanceof ArrayBuffer) {
        api.data = data;
        return api;
    }
    var raw = (api.url = api.url || '');
    var ast = undefined;
    try {
        ast = amisFormula.parse(api.url);
    }
    catch (e) {
        console.warn("api \u914D\u7F6E\u8BED\u6CD5\u51FA\u9519\uFF1A".concat(e));
        return api;
    }
    var url = ast.body
        .map(function (item, index) {
        return item.type === 'raw' ? item.value : "__expression__".concat(index, "__");
    })
        .join('');
    var idx = url.indexOf('?');
    var replaceExpression = function (fragment, defaultFilter, defVal) {
        if (defaultFilter === void 0) { defaultFilter = 'url_encode'; }
        if (defVal === void 0) { defVal = undefined; }
        return fragment.replace(/__expression__(\d+)__/g, function (_, index) {
            var _a;
            return ((_a = amisFormula.evaluate(ast.body[index], data, {
                defaultFilter: defaultFilter
            })) !== null && _a !== void 0 ? _a : defVal);
        });
    };
    if (~idx) {
        var hashIdx = url.indexOf('#');
        var params = helper.qsparse(url.substring(idx + 1, ~hashIdx && hashIdx > idx ? hashIdx : undefined));
        // 将里面的表达式运算完
        helper.JSONTraverse(params, function (value, key, host) {
            var _a;
            if (typeof value === 'string' && /^__expression__(\d+)__$/.test(value)) {
                host[key] = (_a = amisFormula.evaluate(ast.body[RegExp.$1].body, data)) !== null && _a !== void 0 ? _a : '';
            }
            else if (typeof value === 'string') {
                // 参数值里面的片段不能 url_encode 了，所以是不处理
                host[key] = replaceExpression(host[key], 'raw', '');
            }
        });
        var left = replaceExpression(url.substring(0, idx), 'raw', '');
        api.url =
            left +
                (~left.indexOf('?') ? '&' : '?') +
                helper.qsstringify((api.query = dataMapping.dataMapping(params, data, undefined, api.convertKeyToPath))) +
                (~hashIdx && hashIdx > idx
                    ? replaceExpression(url.substring(hashIdx))
                    : '');
    }
    else {
        api.url = replaceExpression(url, 'raw', '');
    }
    if (ignoreData) {
        return api;
    }
    if (api.data) {
        api.body = api.data = dataMapping.dataMapping(api.data, data, undefined, api.convertKeyToPath);
    }
    else if (api.method === 'post' ||
        api.method === 'put' ||
        api.method === 'patch') {
        api.body = api.data = object.cloneObject(data);
    }
    // get 类请求，把 data 附带到 url 上。
    if (api.method === 'get' || api.method === 'jsonp' || api.method === 'js') {
        if (!api.data &&
            ((!~raw.indexOf('$') && autoAppend) || api.forceAppendDataToQuery)) {
            api.query = api.data = data;
        }
        else if (api.attachDataToQuery === false &&
            api.data &&
            ((!~raw.indexOf('$') && autoAppend) || api.forceAppendDataToQuery)) {
            var idx_1 = api.url.indexOf('?');
            if (~idx_1) {
                var params = (api.query = tslib.__assign(tslib.__assign({}, helper.qsparse(api.url.substring(idx_1 + 1))), data));
                api.url = api.url.substring(0, idx_1) + '?' + helper.qsstringify(params);
            }
            else {
                api.query = data;
                api.url += '?' + helper.qsstringify(data);
            }
        }
        if (api.data && api.attachDataToQuery !== false) {
            var idx_2 = api.url.indexOf('?');
            if (~idx_2) {
                var params = (api.query = tslib.__assign(tslib.__assign({}, helper.qsparse(api.url.substring(idx_2 + 1))), api.data));
                api.url = api.url.substring(0, idx_2) + '?' + helper.qsstringify(params);
            }
            else {
                api.query = api.data;
                api.url += '?' + helper.qsstringify(api.data);
            }
            delete api.data;
        }
    }
    if (api.graphql) {
        if (api.method === 'get') {
            api.query = api.data = tslib.__assign(tslib.__assign({}, api.query), { query: api.graphql });
        }
        else if (api.method === 'post' ||
            api.method === 'put' ||
            api.method === 'patch') {
            api.body = api.data = {
                query: api.graphql,
                operationName: api.operationName,
                variables: object.cloneObject(api.data)
            };
        }
    }
    return api;
}
function str2function(contents) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    try {
        var fn = new (Function.bind.apply(Function, tslib.__spreadArray(tslib.__spreadArray([void 0], args, false), [contents], false)))();
        return fn;
    }
    catch (e) {
        console.warn(e);
        return null;
    }
}
var AsyncFunction = Object.getPrototypeOf(function () {
    return tslib.__awaiter(this, void 0, void 0, function () { return tslib.__generator(this, function (_a) {
        return [2 /*return*/];
    }); });
}).constructor;
function str2AsyncFunction(contents) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    try {
        var fn = new (AsyncFunction.bind.apply(AsyncFunction, tslib.__spreadArray(tslib.__spreadArray([void 0], args, false), [contents], false)))();
        return fn;
    }
    catch (e) {
        console.warn(e);
        return null;
    }
}
function responseAdaptor(ret, api) {
    var data = ret.data;
    var hasStatusField = true;
    if (!data) {
        throw new Error('Response is empty');
    }
    // 返回内容是 string，说明 content-type 不是 json，这时可能是返回了纯文本或 html
    if (typeof data === 'string') {
        var contentType = ret.headers['content-type'] || '';
        // 如果是文本类型就尝试解析一下
        if (ret.headers &&
            contentType.startsWith('text/') &&
            !contentType.includes('markdown')) {
            try {
                data = JSON.parse(data);
                if (typeof data === 'undefined') {
                    throw new Error('Response should be JSON');
                }
            }
            catch (e) {
                var responseBrief = typeof data === 'string'
                    ? escapeHtml.escapeHtml(data.substring(0, 100))
                    : '';
                throw new Error("Response should be JSON\n ".concat(responseBrief));
            }
        }
        else {
            if (api.responseType === 'blob') {
                throw new Error('Should have "Content-Disposition" in Header');
            }
            else if (!contentType.includes('markdown')) {
                throw new Error("Content type is wrong \"".concat(contentType, "\""));
            }
        }
    }
    // 兼容几种常见写法
    if (data.hasOwnProperty('errorCode')) {
        // 阿里 Java 规范
        data.status = data.errorCode;
        data.msg = data.errorMessage || data.errorMsg;
    }
    else if (data.hasOwnProperty('errno')) {
        data.status = data.errno;
        data.msg = data.errmsg || data.errstr || data.msg;
    }
    else if (data.hasOwnProperty('no')) {
        data.status = data.no;
        data.msg = data.error || data.msg;
    }
    else if (data.hasOwnProperty('error')) {
        // Google JSON guide
        // https://google.github.io/styleguide/jsoncstyleguide.xml#error
        if (typeof data.error === 'object' && data.error.hasOwnProperty('code')) {
            data.status = data.error.code;
            data.msg = data.error.message;
        }
        else {
            data.status = data.error;
            data.msg = data.errmsg || data.msg;
        }
    }
    if (!data.hasOwnProperty('status')) {
        hasStatusField = false;
    }
    var payload = {
        ok: hasStatusField === false || data.status == 0,
        status: hasStatusField === false ? 0 : data.status,
        msg: data.msg || data.message,
        msgTimeout: data.msgTimeout,
        data: !data.data && !hasStatusField ? data : data.data // 兼容直接返回数据的情况
    };
    // 兼容返回 schema 的情况，用于 app 模式
    if (data && data.type) {
        payload.data = data;
    }
    if (payload.status == 422) {
        payload.errors = data.errors;
    }
    debug.debug('api', 'response', payload);
    if (payload.ok && api.responseData) {
        debug.debug('api', 'before dataMapping', payload.data);
        var responseData = dataMapping.dataMapping(api.responseData, object.createObject({ api: api }, (Array.isArray(payload.data)
            ? {
                items: payload.data
            }
            : payload.data) || {}), undefined, api.convertKeyToPath);
        debug.debug('api', 'after dataMapping', responseData);
        payload.data = responseData;
    }
    return payload;
}
function wrapFetcher(fn, tracker) {
    return function (api, data, options) {
        var _a, _b, _c;
        api = buildApi(api, data, options);
        if (api.requestAdaptor) {
            debug.debug('api', 'before requestAdaptor', api);
            api = api.requestAdaptor(api) || api;
            debug.debug('api', 'after requestAdaptor', api);
        }
        if (api.data && (helper.hasFile(api.data) || api.dataType === 'form-data')) {
            api.data =
                api.data instanceof FormData
                    ? api.data
                    : helper.object2formData(api.data, api.qsOptions);
        }
        else if (api.data &&
            typeof api.data !== 'string' &&
            api.dataType === 'form') {
            api.data = helper.qsstringify(api.data, api.qsOptions);
            api.headers = api.headers || (api.headers = {});
            api.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        else if (api.data &&
            typeof api.data !== 'string' &&
            api.dataType === 'json') {
            api.data = JSON.stringify(api.data);
            api.headers = api.headers || (api.headers = {});
            api.headers['Content-Type'] = 'application/json';
        }
        if (!isValidApi(api.url)) {
            debug.warning('api', 'invalid api url', api);
            return Promise.resolve();
        }
        debug.debug('api', 'request api', api);
        tracker === null || tracker === void 0 ? void 0 : tracker({ eventType: 'api', eventData: omit__default["default"](api, ['config', 'data', 'body']) }, api.data);
        if (((_a = api.method) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) === 'jsonp') {
            return wrapAdaptor(jsonpFetcher(api), api);
        }
        if (((_b = api.method) === null || _b === void 0 ? void 0 : _b.toLocaleLowerCase()) === 'js') {
            return wrapAdaptor(jsFetcher(fn, api), api);
        }
        if (typeof api.cache === 'number' && api.cache > 0) {
            var apiCache = getApiCache(api);
            return wrapAdaptor(apiCache
                ? apiCache.cachedPromise
                : setApiCache(api, fn(api)), api);
        }
        // IE 下 get 请求会被缓存，所以自动加个时间戳
        if (isIE && api && ((_c = api.method) === null || _c === void 0 ? void 0 : _c.toLocaleLowerCase()) === 'get') {
            var timeStamp = "_t=".concat(Date.now());
            if (api.url.indexOf('?') === -1) {
                api.url = api.url + "?".concat(timeStamp);
            }
            else {
                api.url = api.url + "&".concat(timeStamp);
            }
        }
        return wrapAdaptor(fn(api), api);
    };
}
function wrapAdaptor(promise, api) {
    var _this = this;
    var adaptor = api.adaptor;
    return adaptor
        ? promise
            .then(function (response) { return tslib.__awaiter(_this, void 0, void 0, function () {
            var result;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        debug.debug('api', 'before adaptor data', response.data);
                        result = adaptor(response.data, response, api);
                        if (!(result === null || result === void 0 ? void 0 : result.then)) return [3 /*break*/, 2];
                        return [4 /*yield*/, result];
                    case 1:
                        result = _a.sent();
                        _a.label = 2;
                    case 2:
                        debug.debug('api', 'after adaptor data', result);
                        return [2 /*return*/, tslib.__assign(tslib.__assign({}, response), { data: result })];
                }
            });
        }); })
            .then(function (ret) { return responseAdaptor(ret, api); })
        : promise.then(function (ret) { return responseAdaptor(ret, api); });
}
/**
 * 请求远程 js 文件然后 new Function 执行，用于 schemaApi 支持 JavaScript
 * @param api
 * @returns
 */
function jsFetcher(fetcher, api) {
    return new Promise(function (resolve, reject) {
        // 大概也不会有人用 post
        api.method = 'get';
        fetcher(api).then(function (response) {
            if (typeof response.data === 'string') {
                var result = new Function('api', response.data)(api);
                resolve({
                    status: 200,
                    headers: {},
                    data: {
                        status: 0,
                        msg: '',
                        data: result
                    }
                });
            }
            else {
                reject('must return string: ' + response.data);
            }
        });
    });
}
function jsonpFetcher(api) {
    return new Promise(function (resolve, reject) {
        var _a;
        var script = document.createElement('script');
        var src = api.url;
        script.async = true;
        function remove() {
            if (script) {
                // @ts-ignore
                script.onload = script.onreadystatechange = script.onerror = null;
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
                script = null;
            }
        }
        var jsonp = ((_a = api.query) === null || _a === void 0 ? void 0 : _a.callback) || 'axiosJsonpCallback' + helper.uuid();
        var old = window[jsonp];
        window[jsonp] = function (responseData) {
            window[jsonp] = old;
            var response = {
                data: responseData,
                status: 200,
                headers: {}
            };
            resolve(response);
        };
        var additionalParams = {
            _: new Date().getTime(),
            _callback: jsonp
        };
        src += (src.indexOf('?') >= 0 ? '&' : '?') + helper.qsstringify(additionalParams);
        // @ts-ignore IE 为script.onreadystatechange
        script.onload = script.onreadystatechange = function () {
            // @ts-ignore
            if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                remove();
            }
        };
        script.onerror = function () {
            remove();
            var errResponse = {
                status: 0,
                headers: {}
            };
            reject(errResponse);
        };
        script.src = src;
        document.head.appendChild(script);
    });
}
// 避免在 isApiOutdated 中修改，减少影响
function isApiOutdatedWithData(prevApi, nextApi, prevData, nextData) {
    if (!nextApi) {
        return false;
    }
    else if (!prevApi) {
        return true;
    }
    return helper.isObjectShallowModified(buildApi(normalizeApi(prevApi), prevData), buildApi(normalizeApi(nextApi), nextData));
}
function isApiOutdated(prevApi, nextApi, prevData, nextData) {
    var _a;
    if (!nextApi) {
        return false;
    }
    else if (!prevApi) {
        return true;
    }
    nextApi = normalizeApi(nextApi);
    if (nextApi.autoRefresh === false) {
        return false;
    }
    var trackExpression = (_a = nextApi.trackExpression) !== null && _a !== void 0 ? _a : nextApi.url;
    if (typeof trackExpression !== 'string' || !~trackExpression.indexOf('$')) {
        return false;
    }
    prevApi = normalizeApi(prevApi);
    var isModified = false;
    if (nextApi.trackExpression || prevApi.trackExpression) {
        isModified =
            tokenize.tokenize(prevApi.trackExpression || '', prevData) !==
                tokenize.tokenize(nextApi.trackExpression || '', nextData);
    }
    else {
        prevApi = buildApi(prevApi, prevData, { ignoreData: true });
        nextApi = buildApi(nextApi, nextData, { ignoreData: true });
        isModified = prevApi.url !== nextApi.url;
    }
    return !!(isModified &&
        isValidApi(nextApi.url) &&
        (!nextApi.sendOn || tpl.evalExpression(nextApi.sendOn, nextData)));
}
function isValidApi(api) {
    return (api &&
        /^(?:(https?|wss?|taf):\/\/[^\/]+)?(\/?[^\s\/\?]*){1,}(\?.*)?$/.test(api));
}
function isEffectiveApi(api, data, initFetch, initFetchOn) {
    if (!api) {
        return false;
    }
    if (initFetch === false) {
        return false;
    }
    if (initFetchOn && data && !tpl.evalExpression(initFetchOn, data)) {
        return false;
    }
    if (typeof api === 'string' && api.length) {
        return true;
    }
    else if (object.isObject(api) && api.url) {
        if (api.sendOn &&
            data &&
            !tpl.evalExpression(api.sendOn, data)) {
            return false;
        }
        return true;
    }
    return false;
}
function isSameApi(apiA, apiB) {
    return (apiA.method === apiB.method &&
        apiA.url === apiB.url &&
        !helper.isObjectShallowModified(apiA.data, apiB.data, false));
}
function getApiCache(api) {
    // 清理过期cache
    var now = Date.now();
    var result;
    for (var idx = 0, len = apiCaches.length; idx < len; idx++) {
        var apiCache = apiCaches[idx];
        if (now - apiCache.requestTime > apiCache.cache) {
            apiCaches.splice(idx, 1);
            len--;
            idx--;
            continue;
        }
        if (isSameApi(api, apiCache)) {
            result = apiCache;
            break;
        }
    }
    return result;
}
function setApiCache(api, promise) {
    apiCaches.push(tslib.__assign(tslib.__assign({}, api), { cachedPromise: promise, requestTime: Date.now() }));
    return promise;
}
function clearApiCache() {
    apiCaches.splice(0, apiCaches.length);
}
function normalizeApiResponseData(data) {
    var _a;
    if (typeof data === 'undefined') {
        data = {};
    }
    else if (!isPlainObject__default["default"](data)) {
        data = (_a = {},
            _a[Array.isArray(data) ? 'items' : 'result'] = data,
            _a);
    }
    return data;
}
// window.apiCaches = apiCaches;

exports.buildApi = buildApi;
exports.clearApiCache = clearApiCache;
exports.getApiCache = getApiCache;
exports.isApiOutdated = isApiOutdated;
exports.isApiOutdatedWithData = isApiOutdatedWithData;
exports.isEffectiveApi = isEffectiveApi;
exports.isSameApi = isSameApi;
exports.isValidApi = isValidApi;
exports.jsFetcher = jsFetcher;
exports.jsonpFetcher = jsonpFetcher;
exports.normalizeApi = normalizeApi;
exports.normalizeApiResponseData = normalizeApiResponseData;
exports.responseAdaptor = responseAdaptor;
exports.setApiCache = setApiCache;
exports.str2AsyncFunction = str2AsyncFunction;
exports.str2function = str2function;
exports.wrapAdaptor = wrapAdaptor;
exports.wrapFetcher = wrapFetcher;
