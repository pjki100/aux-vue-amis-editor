/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index$1 = require('./index2.js');
var Item = require('./renderers/Item.js');
var api = require('./utils/api.js');
var attachmentAdpator = require('./utils/attachmentAdpator.js');
var autobind = require('./utils/autobind.js');
var ColorScale = require('./utils/ColorScale.js');
var columnsSplit = require('./utils/columnsSplit.js');
var dataMapping = require('./utils/dataMapping.js');
var DataSchema = require('./utils/DataSchema.js');
var DataScope = require('./utils/DataScope.js');
var date = require('./utils/date.js');
var debug = require('./utils/debug.js');
var dom = require('./utils/dom.js');
var errors = require('./utils/errors.js');
var escapeHtml = require('./utils/escapeHtml.js');
var filterSchema = require('./utils/filter-schema.js');
var formatDuration = require('./utils/formatDuration.js');
var formula = require('./utils/formula.js');
var getVariable = require('./utils/getVariable.js');
var grammar = require('./utils/grammar.js');
var handleAction = require('./utils/handleAction.js');
var object = require('./utils/object.js');
var string2regExp = require('./utils/string2regExp.js');
var keyToPath = require('./utils/keyToPath.js');
var helper = require('./utils/helper.js');
var highlight = require('./utils/highlight.js');
var icon = require('./utils/icon.js');
var image = require('./utils/image.js');
var isPureVariable = require('./utils/isPureVariable.js');
var jsonSchema2AmisSchema = require('./utils/json-schema-2-amis-schema.js');
var makeSorter = require('./utils/makeSorter.js');
var normalizeLink = require('./utils/normalizeLink.js');
var normalizeOptions = require('./utils/normalizeOptions.js');
var offset = require('./utils/offset.js');
var offsetParent = require('./utils/offsetParent.js');
var optionValueCompare = require('./utils/optionValueCompare.js');
var position = require('./utils/position.js');
var prettyBytes = require('./utils/prettyBytes.js');
var rendererEvent = require('./utils/renderer-event.js');
var replaceText = require('./utils/replaceText.js');
var resizeSensor = require('./utils/resize-sensor.js');
var resolveVariable = require('./utils/resolveVariable.js');
var resolveVariableAndFilter = require('./utils/resolveVariableAndFilter.js');
var RootClose = require('./utils/RootClose.js');
var scrollPosition = require('./utils/scrollPosition.js');
var SimpleMap = require('./utils/SimpleMap.js');
var style = require('./utils/style.js');
var tokenize = require('./utils/tokenize.js');
var amisFormula = require('amis-formula');
var stripNumber = require('./utils/stripNumber.js');
var tplBuiltin = require('./utils/tpl-builtin.js');
var tpl = require('./utils/tpl.js');
var uncontrollable = require('./utils/uncontrollable.js');
var validations = require('./utils/validations.js');
var Animation = require('./utils/Animation.js');
var index = require('./store/index.js');
var iRenderer = require('./store/iRenderer.js');
var service = require('./store/service.js');
var form = require('./store/form.js');
var combo = require('./store/combo.js');
var crud = require('./store/crud.js');
var table = require('./store/table.js');
var tableV2 = require('./store/table-v2.js');
var list = require('./store/list.js');
var modal = require('./store/modal.js');
var formItem = require('./store/formItem.js');
var pagination = require('./store/pagination.js');
var app = require('./store/app.js');
var node = require('./store/node.js');
var Decorators = require('./actions/Decorators.js');
var Action = require('./actions/Action.js');
var factory = require('./factory.js');
var env = require('./env.js');
var Options = require('./renderers/Options.js');
var Form = require('./renderers/Form.js');
var Scoped = require('./Scoped.js');
var theme = require('./theme.js');
var locale = require('./locale.js');
var LazyComponent = require('./components/LazyComponent.js');
var Overlay = require('./components/Overlay.js');
var PopOver = require('./components/PopOver.js');
var Root = require('./Root.js');



exports.classPrefix = index$1.classPrefix;
exports.render = index$1.render;
exports.FormItem = Item.FormItem;
exports.FormItemWrap = Item.FormItemWrap;
exports.registerFormItem = Item.registerFormItem;
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
exports.attachmentAdpator = attachmentAdpator.attachmentAdpator;
exports.autobindMethod = autobind.autobindMethod;
exports.bind = autobind.bind;
exports.ColorScale = ColorScale.ColorScale;
exports.columnsSplit = columnsSplit.columnsSplit;
exports.dataMapping = dataMapping.dataMapping;
exports.resolveMapping = dataMapping.resolveMapping;
exports.resolveMappingObject = dataMapping.resolveMappingObject;
exports.DataSchema = DataSchema.DataSchema;
exports.DataScope = DataScope.DataScope;
exports.filterDate = date.filterDate;
exports.parseDuration = date.parseDuration;
exports.relativeValueRe = date.relativeValueRe;
exports.DebugWrapper = debug.DebugWrapper;
exports.debug = debug.debug;
exports.enableDebug = debug.enableDebug;
exports.warning = debug.warning;
exports.calculatePosition = dom.calculatePosition;
exports.getContainer = dom.getContainer;
exports.getStyleNumber = dom.getStyleNumber;
exports.ownerDocument = dom.ownerDocument;
exports.ServerError = errors.ServerError;
exports.escapeHtml = escapeHtml.escapeHtml;
exports.getExprProperties = filterSchema.getExprProperties;
exports.formatDuration = formatDuration.formatDuration;
exports.FormulaExec = formula.FormulaExec;
exports.formulaExec = formula.formulaExec;
exports.isExpression = formula.isExpression;
exports.isNeedFormula = formula.isNeedFormula;
exports.registerFormulaExec = formula.registerFormulaExec;
exports.replaceExpression = formula.replaceExpression;
exports.getVariable = getVariable.getVariable;
exports.collectVariables = grammar.collectVariables;
exports.handleAction = handleAction.handleAction;
exports.cloneObject = object.cloneObject;
exports.createObject = object.createObject;
exports.deleteVariable = object.deleteVariable;
exports.extendObject = object.extendObject;
exports.isObject = object.isObject;
exports.pickValues = object.pickValues;
exports.setVariable = object.setVariable;
exports.string2regExp = string2regExp.string2regExp;
exports.keyToPath = keyToPath.keyToPath;
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
exports.highlight = highlight.highlight;
exports.generateIcon = icon.generateIcon;
exports.getImageDimensions = image.getImageDimensions;
exports.toDataURL = image.toDataURL;
exports.isPureVariable = isPureVariable.isPureVariable;
exports.JSONSchme2AMisSchema = jsonSchema2AmisSchema.JSONSchme2AMisSchema;
exports.makeSorter = makeSorter.makeSorter;
exports.normalizeLink = normalizeLink.normalizeLink;
exports.normalizeOptions = normalizeOptions.normalizeOptions;
exports.offset = offset.offset;
exports.offsetParent = offsetParent.offsetParent;
exports.matchOptionValue = optionValueCompare.matchOptionValue;
exports.optionValueCompare = optionValueCompare.optionValueCompare;
exports.position = position.position;
exports.prettyBytes = prettyBytes.prettyBytes;
exports.bindEvent = rendererEvent.bindEvent;
exports.createRendererEvent = rendererEvent.createRendererEvent;
exports.dispatchEvent = rendererEvent.dispatchEvent;
exports.getRendererEventListeners = rendererEvent.getRendererEventListeners;
exports.replaceText = replaceText.replaceText;
exports.getComputedStyle = resizeSensor.getComputedStyle;
exports.resizeSensor = resizeSensor.resizeSensor;
exports.resolveVariable = resolveVariable.resolveVariable;
exports.resolveVariableAndFilter = resolveVariableAndFilter.resolveVariableAndFilter;
exports.RootClose = RootClose.RootClose;
exports.scrollPosition = scrollPosition.scrollPosition;
exports.SimpleMap = SimpleMap.SimpleMap;
exports.buildStyle = style.buildStyle;
exports.tokenize = tokenize.tokenize;
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
exports.stripNumber = stripNumber.stripNumber;
exports.register = tplBuiltin.register;
exports.evalExpression = tpl.evalExpression;
exports.evalJS = tpl.evalJS;
exports.filter = tpl.filter;
exports.registerTplEnginer = tpl.registerTplEnginer;
exports.setCustomEvalExpression = tpl.setCustomEvalExpression;
exports.setCustomEvalJs = tpl.setCustomEvalJs;
exports.uncontrollable = uncontrollable.uncontrollable;
exports.addRule = validations.addRule;
exports.str2rules = validations.str2rules;
exports.validate = validations.validate;
exports.validateMessages = validations.validateMessages;
exports.validateObject = validations.validateObject;
exports.validations = validations.validations;
exports.animation = Animation["default"];
exports.RegisterStore = index.RegisterStore;
exports.RendererStore = index.RendererStore;
exports.iRendererStore = iRenderer.iRendererStore;
exports.ServiceStore = service.ServiceStore;
exports.FormStore = form.FormStore;
exports.ComboStore = combo.ComboStore;
exports.CRUDStore = crud.CRUDStore;
exports.TableStore = table.TableStore;
exports.TableStoreV2 = tableV2.TableStoreV2;
exports.ListStore = list.ListStore;
exports.ModalStore = modal.ModalStore;
exports.FormItemStore = formItem.FormItemStore;
exports.PaginationStore = pagination.PaginationStore;
exports.AppStore = app.AppStore;
exports.StoreNode = node.StoreNode;
exports.bindRendererEvent = Decorators.bindRendererEvent;
exports.rendererEventDispatcher = Decorators.rendererEventDispatcher;
Object.defineProperty(exports, 'LoopStatus', {
	enumerable: true,
	get: function () { return Action.LoopStatus; }
});
exports.getActionByType = Action.getActionByType;
exports.registerAction = Action.registerAction;
exports.runAction = Action.runAction;
exports.runActions = Action.runActions;
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
exports.EnvContext = env.EnvContext;
exports.OptionsControl = Options.OptionsControl;
exports.registerOptionsControl = Options.registerOptionsControl;
exports.FormRenderer = Form.FormRenderer;
exports.Scoped = Scoped.HocScoped;
exports.ScopedContext = Scoped.ScopedContext;
exports.classnames = theme.classnames;
exports.getClassPrefix = theme.getClassPrefix;
exports.getTheme = theme.getTheme;
exports.makeClassnames = theme.makeClassnames;
exports.setDefaultTheme = theme.setDefaultTheme;
exports.theme = theme.theme;
exports.themeable = theme.themeable;
exports.extendLocale = locale.extendLocale;
exports.getDefaultLocale = locale.getDefaultLocale;
exports.localeable = locale.localeable;
exports.makeTranslator = locale.makeTranslator;
exports.registerLocale = locale.register;
exports.setDefaultLocale = locale.setDefaultLocale;
exports.LazyComponent = LazyComponent["default"];
exports.Overlay = Overlay["default"];
exports.PopOver = PopOver["default"];
exports.addRootWrapper = Root.addRootWrapper;
