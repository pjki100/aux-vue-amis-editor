import React from 'react';
import { IRendererStore, IIRendererStore } from './store/index';
import { fetcherResult, SchemaNode, Schema, PlainObject } from './types';
import { ThemeProps } from './theme';
import { LocaleProps } from './locale';
import { RendererEnv } from './env';
import { OnEventProps } from './utils/renderer-event';
export interface TestFunc {
    (path: string, schema?: Schema, resolveRenderer?: (path: string, schema?: Schema, props?: any) => null | RendererConfig): boolean;
}
export interface RendererBasicConfig {
    test?: RegExp | TestFunc;
    type?: string;
    name?: string;
    storeType?: string;
    shouldSyncSuperStore?: (store: any, props: any, prevProps: any) => boolean | undefined;
    storeExtendsData?: boolean | ((props: any) => boolean);
    weight?: number;
    isolateScope?: boolean;
    isFormItem?: boolean;
    autoVar?: boolean;
}
export interface RendererProps extends ThemeProps, LocaleProps, OnEventProps {
    render: (region: string, node: SchemaNode, props?: PlainObject) => JSX.Element;
    env: RendererEnv;
    $path: string;
    $schema: any;
    store?: IIRendererStore;
    syncSuperStore?: boolean;
    data: {
        [propName: string]: any;
    };
    defaultData?: object;
    className?: any;
    [propName: string]: any;
}
export declare type RendererComponent = React.ComponentType<RendererProps> & {
    propsList?: Array<any>;
};
export interface RendererConfig extends RendererBasicConfig {
    component: RendererComponent;
    Renderer?: RendererComponent;
}
export interface RenderSchemaFilter {
    (schema: Schema, renderer: RendererConfig, props?: any): Schema;
}
export interface wsObject {
    url: string;
    responseKey?: string;
    body?: any;
}
export interface RenderOptions extends Partial<Omit<RendererEnv, 'fetcher' | 'theme'>> {
    session?: string;
    theme?: string;
    fetcher?: (config: fetcherConfig) => Promise<fetcherResult>;
}
export interface fetcherConfig {
    url: string;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'jsonp' | 'js';
    data?: any;
    config?: any;
}
export declare function addSchemaFilter(fn: RenderSchemaFilter): void;
export declare function filterSchema(schema: Schema, render: RendererConfig, props?: any): Schema;
export declare function Renderer(config: RendererBasicConfig): <T extends RendererComponent>(component: T) => T;
export declare function registerRenderer(config: RendererConfig): RendererConfig;
export declare function unRegisterRenderer(config: RendererConfig | string): void;
export declare function loadRenderer(schema: Schema, path: string): JSX.Element;
export declare const defaultOptions: RenderOptions;
export declare const stores: {
    [propName: string]: IRendererStore;
};
export declare function clearStoresCache(sessions?: Array<string> | string): void;
export declare function updateEnv(options: Partial<RenderOptions>, session?: string): void;
export declare function extendDefaultEnv(env: Partial<RenderOptions>): void;
export declare function resolveRenderer(path: string, schema?: Schema): null | RendererConfig;
export declare function getRenderers(): RendererConfig[];
export declare function getRendererByName(name: string): RendererConfig | undefined;
export { RendererEnv };
