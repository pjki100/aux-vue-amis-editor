/// <reference types="lodash" />
import React from 'react';
import { RendererProps } from '../factory';
import { IFormStore } from '../store/form';
import { SchemaNode, ActionObject, ClassName, BaseApiObject } from '../types';
import { IScopedContext } from '../Scoped';
import type { LabelAlign } from './Item';
export interface FormHorizontal {
    left?: number;
    right?: number;
    leftFixed?: boolean | number | 'xs' | 'sm' | 'md' | 'lg';
    justify?: boolean;
    labelAlign?: 'left' | 'right';
    /** label自定义宽度，默认单位为px */
    labelWidth?: number | string;
}
export interface FormSchemaBase {
    /**
     * 表单标题
     */
    title?: string;
    /**
     * 按钮集合，会固定在底部显示。
     */
    actions?: Array<any>;
    /**
     * 表单项集合
     */
    body?: any;
    /**
     * @deprecated 请用类型 tabs
     */
    tabs?: any;
    /**
     * @deprecated 请用类型 fieldSet
     */
    fieldSet?: any;
    data?: any;
    /**
     * 是否开启调试，开启后会在顶部实时显示表单项数据。
     */
    debug?: boolean;
    /**
     * 用来初始化表单数据
     */
    initApi?: string | BaseApiObject;
    /**
     * Form 用来获取初始数据的 api,与initApi不同的是，会一直轮询请求该接口，直到返回 finished 属性为 true 才 结束。
     */
    initAsyncApi?: string | BaseApiObject;
    /**
     * 设置了initAsyncApi后，默认会从返回数据的data.finished来判断是否完成，也可以设置成其他的xxx，就会从data.xxx中获取
     */
    initFinishedField?: string;
    /**
     * 设置了initAsyncApi以后，默认拉取的时间间隔
     */
    initCheckInterval?: number;
    /**
     * 是否初始加载
     */
    initFetch?: boolean;
    /**
     * 建议改成 api 的 sendOn 属性。
     */
    initFetchOn?: string;
    /**
     * 设置后将轮询调用 initApi
     */
    interval?: number;
    /**
     * 是否静默拉取
     */
    silentPolling?: boolean;
    /**
     * 配置停止轮询的条件
     */
    stopAutoRefreshWhen?: string;
    /**
     * 是否开启本地缓存
     */
    persistData?: string;
    /**
     * 提交成功后清空本地缓存
     */
    clearPersistDataAfterSubmit?: boolean;
    /**
     * Form 用来保存数据的 api。
     *
     * 详情：https://baidu.gitee.io/amis/docs/components/form/index#%E8%A1%A8%E5%8D%95%E6%8F%90%E4%BA%A4
     */
    api?: string | BaseApiObject;
    /**
     * Form 也可以配置 feedback。
     */
    feedback?: any;
    /**
     * 设置此属性后，表单提交发送保存接口后，还会继续轮询请求该接口，直到返回 finished 属性为 true 才 结束。
     */
    asyncApi?: string | BaseApiObject;
    /**
     * 轮询请求的时间间隔，默认为 3秒。设置 asyncApi 才有效
     */
    checkInterval?: number;
    /**
     * 如果决定结束的字段名不是 `finished` 请设置此属性，比如 `is_success`
     */
    finishedField?: string;
    /**
     * 提交完后重置表单
     */
    resetAfterSubmit?: boolean;
    /**
     * 提交后清空表单
     */
    clearAfterSubmit?: boolean;
    /**
     * 配置表单项默认的展示方式。
     */
    mode?: 'normal' | 'inline' | 'horizontal';
    /**
     * 表单项显示为几列
     */
    columnCount?: number;
    /**
     * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
     */
    horizontal?: FormHorizontal;
    /**
     * 是否自动将第一个表单元素聚焦。
     */
    autoFocus?: boolean;
    /**
     * 消息文案配置，记住这个优先级是最低的，如果你的接口返回了 msg，接口返回的优先。
     */
    messages?: {
        /**
         * 表单验证失败时的提示
         */
        validateFailed?: string;
    };
    name?: string;
    /**
     * 配置容器 panel className
     */
    panelClassName?: ClassName;
    /**
     * 设置主键 id, 当设置后，检测表单是否完成时（asyncApi），只会携带此数据。
     * @default id
     */
    primaryField?: string;
    redirect?: string;
    reload?: string;
    /**
     * 修改的时候是否直接提交表单。
     */
    submitOnChange?: boolean;
    /**
     * 表单初始先提交一次，联动的时候有用
     */
    submitOnInit?: boolean;
    /**
     * 默认的提交按钮名称，如果设置成空，则可以把默认按钮去掉。
     */
    submitText?: string;
    /**
     * 默认表单提交自己会通过发送 api 保存数据，但是也可以设定另外一个 form 的 name 值，或者另外一个 `CRUD` 模型的 name 值。 如果 target 目标是一个 `Form` ，则目标 `Form` 会重新触发 `initApi` 和 `schemaApi`，api 可以拿到当前 form 数据。如果目标是一个 `CRUD` 模型，则目标模型会重新触发搜索，参数为当前 Form 数据。
     */
    target?: string;
    /**
     * 是否用 panel 包裹起来
     */
    wrapWithPanel?: boolean;
    /**
     * 是否固定底下的按钮在底部。
     */
    affixFooter?: boolean;
    /**
     * 页面离开提示，为了防止页面不小心跳转而导致表单没有保存。
     */
    promptPageLeave?: boolean;
    /**
     * 具体的提示信息，选填。
     */
    promptPageLeaveMessage?: string;
    /**
     * 组合校验规则，选填
     */
    rules?: Array<{
        rule: string;
        message: string;
        name?: string | Array<string>;
    }>;
    /**
     * 禁用回车提交
     */
    preventEnterSubmit?: boolean;
    /**
     * 表单label的对齐方式
     */
    labelAlign?: LabelAlign;
    /**
     * label自定义宽度，默认单位为px
     */
    labelWidth?: number | string;
}
export declare type FormGroup = FormSchemaBase & {
    title?: string;
    className?: string;
};
export declare type FormGroupNode = FormGroup | FormGroupArray;
export interface FormGroupArray extends Array<FormGroupNode> {
}
export interface FormProps extends RendererProps, Omit<FormSchemaBase, 'mode' | 'className'> {
    data: any;
    store: IFormStore;
    wrapperComponent: React.ElementType;
    canAccessSuperData: boolean;
    trimValues?: boolean;
    lazyLoad?: boolean;
    simpleMode?: boolean;
    onInit?: (values: object, props: any) => any;
    onReset?: (values: object, action?: any) => void;
    onSubmit?: (values: object, action: any) => any;
    onChange?: (values: object, diff: object, props: any) => any;
    onFailed?: (reason: string, errors: any) => any;
    onFinished: (values: object, action: any) => any;
    onValidate: (values: object, form: any) => any;
    messages: {
        fetchSuccess?: string;
        fetchFailed?: string;
        saveSuccess?: string;
        saveFailed?: string;
        validateFailed?: string;
    };
    rules: Array<{
        rule: string;
        message: string;
        name?: string | Array<string>;
    }>;
    lazyChange?: boolean;
    formLazyChange?: boolean;
}
export default class Form extends React.Component<FormProps, object> {
    static defaultProps: {
        title: string;
        submitText: string;
        initFetch: boolean;
        wrapWithPanel: boolean;
        mode: string;
        collapsable: boolean;
        controlWidth: string;
        horizontal: {
            left: number;
            right: number;
            offset: number;
        };
        columnCount: number;
        panelClassName: string;
        messages: {
            fetchFailed: string;
            saveSuccess: string;
            saveFailed: string;
        };
        wrapperComponent: string;
        finishedField: string;
        initFinishedField: string;
        labelAlign: string;
    };
    static propsList: Array<string>;
    hooks: {
        [propName: string]: Array<() => Promise<any>>;
    };
    asyncCancel: () => void;
    disposeOnValidate: () => void;
    disposeRulesValidate: () => void;
    shouldLoadInitApi: boolean;
    timer: ReturnType<typeof setTimeout>;
    mounted: boolean;
    lazyEmitChange: import("lodash").DebouncedFunc<any>;
    unBlockRouting?: () => void;
    constructor(props: FormProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: FormProps): void;
    componentWillUnmount(): void;
    blockRouting(): any;
    beforePageUnload(e: any): any;
    onInit(): Promise<void>;
    reload(subPath?: string, query?: any, ctx?: any, silent?: boolean): void;
    receive(values: object): void;
    silentReload(target?: string, query?: any): void;
    initInterval(value: any): any;
    isValidated(): boolean;
    validate(forceValidate?: boolean): Promise<boolean>;
    clearErrors(): void;
    getValues(): any;
    setValues(value: any): void;
    submit(fn?: (values: object) => Promise<any>): Promise<any>;
    flush(): void;
    reset(): void;
    addHook(fn: () => any, type?: 'validate' | 'init' | 'flush'): () => void;
    removeHook(fn: () => any, type?: string): void;
    handleChange(value: any, name: string, submit: boolean, changePristine?: boolean): void;
    formItemDispatchEvent(dispatchEvent: any): (type: string, data: any) => void;
    emitChange(submit: boolean): Promise<void>;
    handleBulkChange(values: Object, submit: boolean): void;
    handleFormSubmit(e: React.UIEvent<any>): false | Promise<any>;
    handleReset(action: any): (data: any) => void;
    handleAction(e: React.UIEvent<any> | void, action: ActionObject, data: object, throwErrors?: boolean, delegate?: IScopedContext): Promise<any>;
    handleQuery(query: any): void;
    handleDialogConfirm(values: object[], action: ActionObject, ctx: any, targets: Array<any>): void;
    handleDialogClose(confirmed?: boolean): void;
    handleDrawerConfirm(values: object[], action: ActionObject, ctx: any, targets: Array<any>): void;
    handleDrawerClose(): void;
    submitToTarget(target: string, values: object): void;
    reloadTarget(target: string, data?: any): void;
    closeTarget(target: string): void;
    openFeedback(dialog: any, ctx: any): Promise<unknown>;
    buildActions(): any[] | undefined;
    renderFormItems(schema: Partial<FormSchemaBase> & {
        controls?: Array<any>;
    }, region?: string, otherProps?: Partial<FormProps>): React.ReactNode;
    renderChildren(children: Array<any>, region: string, otherProps?: Partial<FormProps>): React.ReactNode;
    renderChild(control: SchemaNode, key?: any, otherProps?: Partial<FormProps>, region?: string): React.ReactNode;
    renderBody(): JSX.Element;
    render(): JSX.Element;
}
export declare class FormRenderer extends Form {
    static contextType: React.Context<IScopedContext>;
    constructor(props: FormProps, context: IScopedContext);
    componentDidMount(): void;
    componentWillUnmount(): void;
    doAction(action: ActionObject, data?: object, throwErrors?: boolean): Promise<any>;
    handleAction(e: React.UIEvent<any> | undefined, action: ActionObject, ctx: object, throwErrors?: boolean, delegate?: IScopedContext): Promise<any>;
    handleDialogConfirm(values: object[], action: ActionObject, ctx: any, targets: Array<any>): void;
    submitToTarget(target: string, values: object): void;
    reloadTarget(target: string, data: any): void;
    closeTarget(target: string): void;
    reload(target?: string, query?: any, ctx?: any, silent?: boolean): void;
    receive(values: object, name?: string): void;
    setData(values: object): void;
}
