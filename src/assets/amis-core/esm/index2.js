/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __assign } from 'tslib';
import { stores, defaultOptions } from './factory.js';
export { Renderer, addSchemaFilter, clearStoresCache, extendDefaultEnv, filterSchema, getRendererByName, getRenderers, registerRenderer, resolveRenderer, unRegisterRenderer, updateEnv } from './factory.js';
import './renderers/builtin.js';
import { wrapFetcher } from './utils/api.js';
export { buildApi, clearApiCache, getApiCache, isApiOutdated, isApiOutdatedWithData, isEffectiveApi, isSameApi, isValidApi, jsFetcher, jsonpFetcher, normalizeApi, normalizeApiResponseData, responseAdaptor, setApiCache, str2AsyncFunction, str2function, wrapAdaptor, wrapFetcher } from './utils/api.js';
export { ColorScale } from './utils/ColorScale.js';
import React from 'react';
import 'lodash/chunk';
export { Evaluator, evaluate, extendsFilters, filters, getFilters, lexer, parse, registerFilter } from 'amis-formula';
import 'lodash/isPlainObject';
export { DataSchema } from './utils/DataSchema.js';
export { DataScope } from './utils/DataScope.js';
import 'moment';
import { enableDebug } from './utils/debug.js';
export { DebugWrapper, debug, enableDebug, warning } from './utils/debug.js';
import 'react-dom';
export { ServerError } from './utils/errors.js';
export { evalExpression, evalJS, filter, registerTplEnginer, setCustomEvalExpression, setCustomEvalJs } from './utils/tpl.js';
import { promisify } from './utils/helper.js';
import * as helper from './utils/helper.js';
export { helper as utils };
export { JSONTraverse, SkipOperation, __uri, anyChanged, autobind, bulkBindFunctions, camel, chainEvents, chainFunctions, convertArrayValueToMoment, detectPropValueChanged, difference, eachTree, everyTree, filterTree, findIndex, findObjectsWithKey, findTree, findTreeIndex, flattenTree, flattenTreeWithLeafNodes, getLevelFromClassName, getPropValue, getRange, getScrollParent, getScrollbarWidth, getTree, getTreeAncestors, getTreeDepth, getTreeParent, getWidthRate, guid, hasAbility, hasFile, hasOwnPropertyInPath, hasVisibleExpression, hashCode, immutableExtends, injectPropsToObject, isArrayChildrenModified, isBreakpoint, isClickOnInput, isDisabled, isEmpty, isMobile, isNumeric, isObjectShallowModified, isSuperDataModified, isUnfolded, isVisible, lcFirst, loadScript, makeColumnClassBuild, makeHorizontalDeeper, mapObject, mapTree, noop, normalizeNodePath, object2formData, omitControls, padArr, pickEventsProps, preventDefault, promisify, qsparse, qsstringify, range, removeHTMLTag, repeatCount, rmUndefined, someTree, sortArray, spliceTree, syncDataFromSuper, ucFirst, until, uuid, uuidv4, visibilityFilter } from './utils/helper.js';
import 'classnames';
import './utils/filter.js';
import 'lodash/isObject';
import 'lodash/isString';
import 'lodash/isBoolean';
export { getImageDimensions, toDataURL } from './utils/image.js';
export { LoopStatus, getActionByType, registerAction, runAction, runActions } from './actions/Action.js';
import { replaceText } from './utils/replaceText.js';
export { replaceText } from './utils/replaceText.js';
export { getComputedStyle, resizeSensor } from './utils/resize-sensor.js';
import './node_modules/dom-helpers/esm/addEventListener.js';
import './node_modules/warning/warning.js';
export { SimpleMap } from './utils/SimpleMap.js';
import 'lodash/mapValues';
import 'lodash/camelCase';
import 'uncontrollable';
import 'hoist-non-react-statics';
export { addRule, str2rules, validate, validateMessages, validateObject, validations } from './utils/validations.js';
export { default as animation } from './utils/Animation.js';
import { RendererStore } from './store/index.js';
export { RegisterStore, RendererStore } from './store/index.js';
import { getEnv } from 'mobx-state-tree';
import { getDefaultLocale, makeTranslator } from './locale.js';
export { extendLocale, getDefaultLocale, localeable, makeTranslator, register as registerLocale, setDefaultLocale } from './locale.js';
export { HocScoped as Scoped, ScopedContext } from './Scoped.js';
import { getClassPrefix, getTheme } from './theme.js';
export { classnames, getClassPrefix, getTheme, makeClassnames, setDefaultTheme, theme, themeable } from './theme.js';
import './actions/LoopAction.js';
import './actions/BreakAction.js';
import './actions/ContinueAction.js';
import './actions/SwitchAction.js';
import './actions/ParallelAction.js';
import './actions/CustomAction.js';
import './actions/BroadcastAction.js';
import './actions/CmptAction.js';
import './actions/AjaxAction.js';
import './actions/CopyAction.js';
import './actions/DialogAction.js';
import './actions/DrawerAction.js';
import './actions/EmailAction.js';
import './actions/LinkAction.js';
import './actions/ToastAction.js';
import './actions/PageAction.js';
export { FormItem, FormItemWrap, registerFormItem } from './renderers/Item.js';
import 'mobx';
import 'lodash/findIndex';
import ScopedRootRenderer from './Root.js';
export { addRootWrapper } from './Root.js';
import { envOverwrite } from './envOverwrite.js';
import { EnvContext } from './env.js';
export { EnvContext } from './env.js';
export { default as LazyComponent } from './components/LazyComponent.js';
export { default as Overlay } from './components/Overlay.js';
export { default as PopOver } from './components/PopOver.js';
export { FormRenderer } from './renderers/Form.js';

var classPrefix = getClassPrefix();
function render(schema, props, options, pathPrefix) {
    if (props === void 0) { props = {}; }
    if (options === void 0) { options = {}; }
    if (pathPrefix === void 0) { pathPrefix = ''; }
    var locale = props.locale || getDefaultLocale();
    // 兼容 locale 的不同写法
    locale = locale.replace('_', '-');
    locale = locale === 'en' ? 'en-US' : locale;
    locale = locale === 'zh' ? 'zh-CN' : locale;
    locale = locale === 'cn' ? 'zh-CN' : locale;
    var translate = props.translate || makeTranslator(locale);
    var store = stores[options.session || 'global'];
    // 根据环境覆盖 schema，这个要在最前面做，不然就无法覆盖 validations
    envOverwrite(schema, locale);
    if (!store) {
        options = __assign(__assign(__assign({}, defaultOptions), options), { fetcher: options.fetcher
                ? wrapFetcher(options.fetcher, options.tracker)
                : defaultOptions.fetcher, confirm: promisify(options.confirm || defaultOptions.confirm || window.confirm), locale: locale, translate: translate });
        if (options.enableAMISDebug) {
            // 因为里面还有 render
            setTimeout(function () {
                enableDebug();
            }, 10);
        }
        store = RendererStore.create({}, options);
        stores[options.session || 'global'] = store;
    }
    window.amisStore = store; // 为了方便 debug.
    var env = getEnv(store);
    var theme = props.theme || options.theme || 'cxd';
    if (theme === 'default') {
        theme = 'cxd';
    }
    env.theme = getTheme(theme);
    if (props.locale !== undefined) {
        env.translate = translate;
        env.locale = locale;
    }
    // 默认将开启移动端原生 UI
    if (typeof options.useMobileUI) {
        props.useMobileUI = true;
    }
    replaceText(schema, env.replaceText, env.replaceTextIgnoreKeys);
    return (React.createElement(EnvContext.Provider, { value: env },
        React.createElement(ScopedRootRenderer, __assign({}, props, { schema: schema, pathPrefix: pathPrefix, rootStore: store, env: env, theme: theme, locale: locale, translate: translate }))));
}

export { classPrefix, render };
