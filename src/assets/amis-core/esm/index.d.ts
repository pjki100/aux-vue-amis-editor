/// <reference types="react" />
/** @license amis v@version
 *
 * Copyright Baidu
 *
 * This source code is licensed under the Apache license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Renderer, getRendererByName, getRenderers, registerRenderer, unRegisterRenderer, resolveRenderer, filterSchema, clearStoresCache, updateEnv, RenderOptions, addSchemaFilter, RendererProps, extendDefaultEnv, RendererConfig } from './factory';
import './renderers/builtin';
export * from './utils/index';
export * from './types';
export * from './store';
import * as utils from './utils/helper';
import { RegisterStore } from './store';
import { setDefaultLocale, getDefaultLocale, makeTranslator, register as registerLocale, extendLocale, localeable, LocaleProps, TranslateFn } from './locale';
import Scoped, { IScopedContext, ScopedContext } from './Scoped';
import { classnames, getClassPrefix, setDefaultTheme, theme, getTheme, ThemeProps, themeable, ClassNamesFn, makeClassnames } from './theme';
declare const classPrefix: string | undefined;
export * from './actions';
import FormItem, { FormBaseControl, FormControlProps, FormItemWrap, FormItemProps, registerFormItem } from './renderers/Item';
import { FormOptionsControl, OptionsControl, OptionsControlProps, registerOptionsControl } from './renderers/Options';
import { Schema } from './types';
import { addRootWrapper, RootRenderProps } from './Root';
import { EnvContext, RendererEnv } from './env';
import { evaluate, Evaluator, extendsFilters, FilterContext, filters, getFilters, lexer, parse, registerFilter } from 'amis-formula';
import LazyComponent from './components/LazyComponent';
import Overlay from './components/Overlay';
import PopOver from './components/PopOver';
import { FormHorizontal, FormRenderer } from './renderers/Form';
export { clearStoresCache, updateEnv, Renderer, RendererProps, RenderOptions, RendererEnv, EnvContext, RegisterStore, FormItem, FormItemWrap, FormItemProps, OptionsControl, FormRenderer, FormHorizontal, utils, getRendererByName, registerRenderer, unRegisterRenderer, getRenderers, registerFormItem, registerOptionsControl, resolveRenderer, filterSchema, Scoped, ScopedContext, IScopedContext, setDefaultTheme, theme, themeable, ThemeProps, getTheme, classPrefix, getClassPrefix, classnames, makeClassnames, getDefaultLocale, setDefaultLocale, registerLocale, makeTranslator, extendLocale, localeable, LocaleProps, TranslateFn, ClassNamesFn, parse, lexer, Evaluator, FilterContext, filters, getFilters, registerFilter, extendsFilters, evaluate, LazyComponent, Overlay, PopOver, addSchemaFilter, OptionsControlProps, FormOptionsControl, FormControlProps, FormBaseControl, extendDefaultEnv, addRootWrapper, RendererConfig };
export declare function render(schema: Schema, props?: RootRenderProps, options?: RenderOptions, pathPrefix?: string): JSX.Element;
