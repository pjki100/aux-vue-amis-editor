/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var factory = require('./factory.js');
require('./renderers/builtin.js');
var api = require('./utils/api.js');
var ColorScale = require('./utils/ColorScale.js');
var React = require('react');
require('lodash/chunk');
var amisFormula = require('amis-formula');
require('lodash/isPlainObject');
var DataSchema = require('./utils/DataSchema.js');
var DataScope = require('./utils/DataScope.js');
require('moment');
var debug = require('./utils/debug.js');
require('react-dom');
var errors = require('./utils/errors.js');
var tpl = require('./utils/tpl.js');
var helper = require('./utils/helper.js');
require('classnames');
require('./utils/filter.js');
require('lodash/isObject');
require('lodash/isString');
require('lodash/isBoolean');
var image = require('./utils/image.js');
var Action = require('./actions/Action.js');
var replaceText = require('./utils/replaceText.js');
var resizeSensor = require('./utils/resize-sensor.js');
require('./node_modules/dom-helpers/esm/addEventListener.js');
require('./node_modules/warning/warning.js');
var SimpleMap = require('./utils/SimpleMap.js');
require('lodash/mapValues');
require('lodash/camelCase');
require('uncontrollable');
require('hoist-non-react-statics');
var validations = require('./utils/validations.js');
var Animation = require('./utils/Animation.js');
var index = require('./store/index.js');
var mobxStateTree = require('mobx-state-tree');
var locale = require('./locale.js');
var Scoped = require('./Scoped.js');
var theme = require('./theme.js');
require('./actions/LoopAction.js');
require('./actions/BreakAction.js');
require('./actions/ContinueAction.js');
require('./actions/SwitchAction.js');
require('./actions/ParallelAction.js');
require('./actions/CustomAction.js');
require('./actions/BroadcastAction.js');
require('./actions/CmptAction.js');
require('./actions/AjaxAction.js');
require('./actions/CopyAction.js');
require('./actions/DialogAction.js');
require('./actions/DrawerAction.js');
require('./actions/EmailAction.js');
require('./actions/LinkAction.js');
require('./actions/ToastAction.js');
require('./actions/PageAction.js');
var Item = require('./renderers/Item.js');
require('mobx');
require('lodash/findIndex');
var Root = require('./Root.js');
var envOverwrite = require('./envOverwrite.js');
var env = require('./env.js');
var LazyComponent = require('./components/LazyComponent.js');
var Overlay = require('./components/Overlay.js');
var PopOver = require('./components/PopOver.js');
var Form = require('./renderers/Form.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var classPrefix = theme.getClassPrefix();
function render(schema, props, options, pathPrefix) {
    if (props === void 0) { props = {}; }
    if (options === void 0) { options = {}; }
    if (pathPrefix === void 0) { pathPrefix = ''; }
    var locale$1 = props.locale || locale.getDefaultLocale();
    // 兼容 locale 的不同写法
    locale$1 = locale$1.replace('_', '-');
    locale$1 = locale$1 === 'en' ? 'en-US' : locale$1;
    locale$1 = locale$1 === 'zh' ? 'zh-CN' : locale$1;
    locale$1 = locale$1 === 'cn' ? 'zh-CN' : locale$1;
    var translate = props.translate || locale.makeTranslator(locale$1);
    var store = factory.stores[options.session || 'global'];
    // 根据环境覆盖 schema，这个要在最前面做，不然就无法覆盖 validations
    envOverwrite.envOverwrite(schema, locale$1);
    if (!store) {
        options = tslib.__assign(tslib.__assign(tslib.__assign({}, factory.defaultOptions), options), { fetcher: options.fetcher
                ? api.wrapFetcher(options.fetcher, options.tracker)
                : factory.defaultOptions.fetcher, confirm: helper.promisify(options.confirm || factory.defaultOptions.confirm || window.confirm), locale: locale$1, translate: translate });
        if (options.enableAMISDebug) {
            // 因为里面还有 render
            setTimeout(function () {
                debug.enableDebug();
            }, 10);
        }
        store = index.RendererStore.create({}, options);
        factory.stores[options.session || 'global'] = store;
    }
    window.amisStore = store; // 为了方便 debug.
    var env$1 = mobxStateTree.getEnv(store);
    var theme$1 = props.theme || options.theme || 'cxd';
    if (theme$1 === 'default') {
        theme$1 = 'cxd';
    }
    env$1.theme = theme.getTheme(theme$1);
    if (props.locale !== undefined) {
        env$1.translate = translate;
        env$1.locale = locale$1;
    }
    // 默认将开启移动端原生 UI
    if (typeof options.useMobileUI) {
        props.useMobileUI = true;
    }
    replaceText.replaceText(schema, env$1.replaceText, env$1.replaceTextIgnoreKeys);
    return (React__default["default"].createElement(env.EnvContext.Provider, { value: env$1 },
        React__default["default"].createElement(Root["default"], tslib.__assign({}, props, { schema: schema, pathPrefix: pathPrefix, rootStore: store, env: env$1, theme: theme$1, locale: locale$1, translate: translate }))));
}

exports.Renderer = factory.Renderer;
exports.addSchemaFilter = factory.addSchemaFilter;
exports.clearStoresCache = factory.clearStoresCache;
exports.extendDefaultEnv = factory.extendDefaultEnv;
exports.filterSchema = factory.filterSchema;
exports.getRendererByName = factory.getRendererByName;
exports.getRenderers = factory.getRenderers;
exports.registerRenderer = factory.registerRenderer;
exports.resolveRenderer = factory.resolveRenderer;
exports.unRegisterRenderer = factory.unRegisterRenderer;
exports.updateEnv = factory.updateEnv;
exports.buildApi = api.buildApi;
exports.clearApiCache = api.clearApiCache;
exports.getApiCache = api.getApiCache;
exports.isApiOutdated = api.isApiOutdated;
exports.isApiOutdatedWithData = api.isApiOutdatedWithData;
exports.isEffectiveApi = api.isEffectiveApi;
exports.isSameApi = api.isSameApi;
exports.isValidApi = api.isValidApi;
exports.jsFetcher = api.jsFetcher;
exports.jsonpFetcher = api.jsonpFetcher;
exports.normalizeApi = api.normalizeApi;
exports.normalizeApiResponseData = api.normalizeApiResponseData;
exports.responseAdaptor = api.responseAdaptor;
exports.setApiCache = api.setApiCache;
exports.str2AsyncFunction = api.str2AsyncFunction;
exports.str2function = api.str2function;
exports.wrapAdaptor = api.wrapAdaptor;
exports.wrapFetcher = api.wrapFetcher;
exports.ColorScale = ColorScale.ColorScale;
Object.defineProperty(exports, 'Evaluator', {
    enumerable: true,
    get: function () { return amisFormula.Evaluator; }
});
Object.defineProperty(exports, 'evaluate', {
    enumerable: true,
    get: function () { return amisFormula.evaluate; }
});
Object.defineProperty(exports, 'extendsFilters', {
    enumerable: true,
    get: function () { return amisFormula.extendsFilters; }
});
Object.defineProperty(exports, 'filters', {
    enumerable: true,
    get: function () { return amisFormula.filters; }
});
Object.defineProperty(exports, 'getFilters', {
    enumerable: true,
    get: function () { return amisFormula.getFilters; }
});
Object.defineProperty(exports, 'lexer', {
    enumerable: true,
    get: function () { return amisFormula.lexer; }
});
Object.defineProperty(exports, 'parse', {
    enumerable: true,
    get: function () { return amisFormula.parse; }
});
Object.defineProperty(exports, 'registerFilter', {
    enumerable: true,
    get: function () { return amisFormula.registerFilter; }
});
exports.DataSchema = DataSchema.DataSchema;
exports.DataScope = DataScope.DataScope;
exports.DebugWrapper = debug.DebugWrapper;
exports.debug = debug.debug;
exports.enableDebug = debug.enableDebug;
exports.warning = debug.warning;
exports.ServerError = errors.ServerError;
exports.evalExpression = tpl.evalExpression;
exports.evalJS = tpl.evalJS;
exports.filter = tpl.filter;
exports.registerTplEnginer = tpl.registerTplEnginer;
exports.setCustomEvalExpression = tpl.setCustomEvalExpression;
exports.setCustomEvalJs = tpl.setCustomEvalJs;
exports.JSONTraverse = helper.JSONTraverse;
exports.SkipOperation = helper.SkipOperation;
exports.__uri = helper.__uri;
exports.anyChanged = helper.anyChanged;
exports.autobind = helper.autobind;
exports.bulkBindFunctions = helper.bulkBindFunctions;
exports.camel = helper.camel;
exports.chainEvents = helper.chainEvents;
exports.chainFunctions = helper.chainFunctions;
exports.convertArrayValueToMoment = helper.convertArrayValueToMoment;
exports.detectPropValueChanged = helper.detectPropValueChanged;
exports.difference = helper.difference;
exports.eachTree = helper.eachTree;
exports.everyTree = helper.everyTree;
exports.filterTree = helper.filterTree;
exports.findIndex = helper.findIndex;
exports.findObjectsWithKey = helper.findObjectsWithKey;
exports.findTree = helper.findTree;
exports.findTreeIndex = helper.findTreeIndex;
exports.flattenTree = helper.flattenTree;
exports.flattenTreeWithLeafNodes = helper.flattenTreeWithLeafNodes;
exports.getLevelFromClassName = helper.getLevelFromClassName;
exports.getPropValue = helper.getPropValue;
exports.getRange = helper.getRange;
exports.getScrollParent = helper.getScrollParent;
exports.getScrollbarWidth = helper.getScrollbarWidth;
exports.getTree = helper.getTree;
exports.getTreeAncestors = helper.getTreeAncestors;
exports.getTreeDepth = helper.getTreeDepth;
exports.getTreeParent = helper.getTreeParent;
exports.getWidthRate = helper.getWidthRate;
exports.guid = helper.guid;
exports.hasAbility = helper.hasAbility;
exports.hasFile = helper.hasFile;
exports.hasOwnPropertyInPath = helper.hasOwnPropertyInPath;
exports.hasVisibleExpression = helper.hasVisibleExpression;
exports.hashCode = helper.hashCode;
exports.immutableExtends = helper.immutableExtends;
exports.injectPropsToObject = helper.injectPropsToObject;
exports.isArrayChildrenModified = helper.isArrayChildrenModified;
exports.isBreakpoint = helper.isBreakpoint;
exports.isClickOnInput = helper.isClickOnInput;
exports.isDisabled = helper.isDisabled;
exports.isEmpty = helper.isEmpty;
exports.isMobile = helper.isMobile;
exports.isNumeric = helper.isNumeric;
exports.isObjectShallowModified = helper.isObjectShallowModified;
exports.isSuperDataModified = helper.isSuperDataModified;
exports.isUnfolded = helper.isUnfolded;
exports.isVisible = helper.isVisible;
exports.lcFirst = helper.lcFirst;
exports.loadScript = helper.loadScript;
exports.makeColumnClassBuild = helper.makeColumnClassBuild;
exports.makeHorizontalDeeper = helper.makeHorizontalDeeper;
exports.mapObject = helper.mapObject;
exports.mapTree = helper.mapTree;
exports.noop = helper.noop;
exports.normalizeNodePath = helper.normalizeNodePath;
exports.object2formData = helper.object2formData;
exports.omitControls = helper.omitControls;
exports.padArr = helper.padArr;
exports.pickEventsProps = helper.pickEventsProps;
exports.preventDefault = helper.preventDefault;
exports.promisify = helper.promisify;
exports.qsparse = helper.qsparse;
exports.qsstringify = helper.qsstringify;
exports.range = helper.range;
exports.removeHTMLTag = helper.removeHTMLTag;
exports.repeatCount = helper.repeatCount;
exports.rmUndefined = helper.rmUndefined;
exports.someTree = helper.someTree;
exports.sortArray = helper.sortArray;
exports.spliceTree = helper.spliceTree;
exports.syncDataFromSuper = helper.syncDataFromSuper;
exports.ucFirst = helper.ucFirst;
exports.until = helper.until;
exports.utils = helper;
exports.uuid = helper.uuid;
exports.uuidv4 = helper.uuidv4;
exports.visibilityFilter = helper.visibilityFilter;
exports.getImageDimensions = image.getImageDimensions;
exports.toDataURL = image.toDataURL;
Object.defineProperty(exports, 'LoopStatus', {
    enumerable: true,
    get: function () { return Action.LoopStatus; }
});
exports.getActionByType = Action.getActionByType;
exports.registerAction = Action.registerAction;
exports.runAction = Action.runAction;
exports.runActions = Action.runActions;
exports.replaceText = replaceText.replaceText;
exports.getComputedStyle = resizeSensor.getComputedStyle;
exports.resizeSensor = resizeSensor.resizeSensor;
exports.SimpleMap = SimpleMap.SimpleMap;
exports.addRule = validations.addRule;
exports.str2rules = validations.str2rules;
exports.validate = validations.validate;
exports.validateMessages = validations.validateMessages;
exports.validateObject = validations.validateObject;
exports.validations = validations.validations;
exports.animation = Animation["default"];
exports.RegisterStore = index.RegisterStore;
exports.RendererStore = index.RendererStore;
exports.extendLocale = locale.extendLocale;
exports.getDefaultLocale = locale.getDefaultLocale;
exports.localeable = locale.localeable;
exports.makeTranslator = locale.makeTranslator;
exports.registerLocale = locale.register;
exports.setDefaultLocale = locale.setDefaultLocale;
exports.Scoped = Scoped.HocScoped;
exports.ScopedContext = Scoped.ScopedContext;
exports.classnames = theme.classnames;
exports.getClassPrefix = theme.getClassPrefix;
exports.getTheme = theme.getTheme;
exports.makeClassnames = theme.makeClassnames;
exports.setDefaultTheme = theme.setDefaultTheme;
exports.theme = theme.theme;
exports.themeable = theme.themeable;
exports.FormItem = Item.FormItem;
exports.FormItemWrap = Item.FormItemWrap;
exports.registerFormItem = Item.registerFormItem;
exports.addRootWrapper = Root.addRootWrapper;
exports.EnvContext = env.EnvContext;
exports.LazyComponent = LazyComponent["default"];
exports.Overlay = Overlay["default"];
exports.PopOver = PopOver["default"];
exports.FormRenderer = Form.FormRenderer;
exports.classPrefix = classPrefix;
exports.render = render;
