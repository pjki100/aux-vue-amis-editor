import { Instance, SnapshotIn } from 'mobx-state-tree';
export declare const PaginationStore: import("mobx-state-tree").IModelType<{
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
    page: import("mobx-state-tree").IType<number | undefined, number, number>;
    perPage: import("mobx-state-tree").IType<number | undefined, number, number>;
    inputName: import("mobx-state-tree").IType<string | undefined, string, string>;
    outputName: import("mobx-state-tree").IType<string | undefined, string, string>;
    mode: import("mobx-state-tree").IType<string | undefined, string, string>;
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
    readonly inputItems: any[];
    readonly locals: object;
    readonly lastPage: number;
} & {
    switchTo(page: number, perPage?: number): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export declare type IPaginationStore = Instance<typeof PaginationStore>;
export declare type SPaginationStore = SnapshotIn<typeof PaginationStore>;
