import { Instance } from 'mobx-state-tree';
import { Api, fetchOptions, ActionObject } from '../types';
export declare const CRUDStore: import("mobx-state-tree").IModelType<{
    id: import("mobx-state-tree").ISimpleType<string>;
    path: import("mobx-state-tree").IType<string | undefined, string, string>;
    storeType: import("mobx-state-tree").ISimpleType<string>;
    disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
    childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
} & {
    hasRemoteData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<boolean>, [undefined]>;
    data: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    initedAt: import("mobx-state-tree").IType<number | undefined, number, number>;
    updatedAt: import("mobx-state-tree").IType<number | undefined, number, number>;
    pristine: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    action: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    dialogOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    dialogData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    drawerOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    drawerData: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
} & {
    msg: import("mobx-state-tree").IType<string | undefined, string, string>;
    error: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    fetching: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    saving: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    busying: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    checking: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    initializing: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    schema: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    schemaKey: import("mobx-state-tree").IType<string | undefined, string, string>;
} & {
    pristineQuery: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    query: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    prevPage: import("mobx-state-tree").IType<number | undefined, number, number>;
    page: import("mobx-state-tree").IType<number | undefined, number, number>;
    perPage: import("mobx-state-tree").IType<number | undefined, number, number>;
    total: import("mobx-state-tree").IType<number | undefined, number, number>;
    mode: import("mobx-state-tree").IType<string | undefined, string, string>;
    hasNext: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    selectedAction: import("mobx-state-tree").IType<any, any, any>;
    columns: import("mobx-state-tree").IType<any, any, any>;
    items: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IType<any, any, any>>, [undefined]>;
    selectedItems: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IType<any, any, any>>, [undefined]>;
    unSelectedItems: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").IType<any, any, any>>, [undefined]>;
    filterTogggable: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    filterVisible: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    hasInnerModalOpen: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
}, {
    readonly parentStore: any;
    readonly __: any;
    readonly hasChildren: boolean;
    readonly children: any[];
} & {
    onChildStoreDispose(child: any): void;
    syncProps(props: any, prevProps: any, list?: string[]): void;
    dispose: (callback?: (() => void) | undefined) => void;
    addChildId: (id: string) => void;
    removeChildId: (id: string) => void;
} & {
    getValueByName(name: string, canAccessSuper?: boolean): any;
    getPristineValueByName(name: string): any;
} & {
    initData(data?: object, skipSetPristine?: boolean): void;
    reset(): void;
    updateData(data?: object, tag?: object | undefined, replace?: boolean | undefined): void;
    changeValue(name: string, value: any, changePristine?: boolean | undefined, force?: boolean | undefined, otherModifier?: ((data: Object) => void) | undefined): void;
    setCurrentAction(action: object): void;
    openDialog(ctx: any, additonal?: object | undefined, callback?: ((ret: any) => void) | undefined): void;
    closeDialog(result?: any): void;
    openDrawer(ctx: any, additonal?: object | undefined, callback?: ((ret: any) => void) | undefined): void;
    closeDrawer(result?: any): void;
} & {
    readonly loading: boolean;
} & {
    markFetching: (fetching?: boolean) => void;
    markSaving: (saving?: boolean) => void;
    markBusying: (busying?: boolean) => void;
    fetchInitData: (api: Api, data?: object | undefined, options?: fetchOptions | undefined) => Promise<any>;
    fetchData: (api: Api, data?: object | undefined, options?: fetchOptions | undefined) => Promise<any>;
    reInitData: (data: object | undefined, replace?: boolean) => void;
    updateMessage: (msg?: string | undefined, error?: boolean) => void;
    clearMessage: () => void;
    setHasRemoteData: () => void;
    saveRemote: (api: Api, data?: object | undefined, options?: fetchOptions | undefined) => Promise<any>;
    fetchSchema: (api: Api, data?: object | undefined, options?: fetchOptions | undefined) => Promise<any>;
    checkRemote: (api: Api, data?: object | undefined, options?: fetchOptions | undefined) => Promise<any>;
} & {
    readonly lastPage: number;
    readonly filterData: object;
    readonly mergedData: any;
    readonly hasModalOpened: boolean;
    readonly selectedItemsAsArray: any[];
    fetchCtxOf(data: any, options: {
        pageField?: string;
        perPageField?: string;
    }): object;
} & {
    getData: (superData: any) => any;
    updateSelectData: (selected: Array<any>, unSelected: Array<any>) => void;
    setPristineQuery: () => void;
    updateQuery: (values: object, updater?: Function, pageField?: string, perPageField?: string, replace?: boolean) => void;
    fetchInitData: (api: Api, data?: object, options?: fetchOptions & {
        forceReload?: boolean;
        loadDataOnce?: boolean;
        loadDataOnceFetchOnFilter?: boolean;
        source?: string;
        loadDataMode?: boolean;
        syncResponse2Query?: boolean;
        columns?: Array<any>;
    }) => Promise<any>;
    changePage: (page: number, perPage?: number | string) => void;
    selectAction: (action: ActionObject) => void;
    saveRemote: (api: Api, data?: object, options?: fetchOptions) => Promise<any>;
    setFilterTogglable: (toggable: boolean, filterVisible?: boolean) => void;
    setFilterVisible: (visible: boolean) => void;
    setSelectedItems: (items: Array<any>) => void;
    setUnSelectedItems: (items: Array<any>) => void;
    setInnerModalOpened: (value: boolean) => void;
    initFromScope: (scope: any, source: string) => void;
    exportAsCSV: (options?: {
        loadDataOnce?: boolean;
        api?: Api;
        data?: any;
    }) => Promise<void>;
    updateColumns: (columns: Array<any>) => void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export declare type ICRUDStore = Instance<typeof CRUDStore>;
