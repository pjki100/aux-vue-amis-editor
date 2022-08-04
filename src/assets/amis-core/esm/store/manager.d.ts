import { IStoreNode } from './node';
export declare function addStore(store: IStoreNode): {
    id: string;
    path: string;
    storeType: string;
    disposed: boolean;
    parentId: string;
    childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
} & import("mobx-state-tree/dist/internal").NonEmptyObject & {
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
} & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
    id: import("mobx-state-tree").ISimpleType<string>;
    path: import("mobx-state-tree").IType<string | undefined, string, string>;
    storeType: import("mobx-state-tree").ISimpleType<string>;
    disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
    childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
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
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
export declare function removeStore(store: IStoreNode): void;
export declare function getStoreById(id: string): {
    id: string;
    path: string;
    storeType: string;
    disposed: boolean;
    parentId: string;
    childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
} & import("mobx-state-tree/dist/internal").NonEmptyObject & {
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
} & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
    id: import("mobx-state-tree").ISimpleType<string>;
    path: import("mobx-state-tree").IType<string | undefined, string, string>;
    storeType: import("mobx-state-tree").ISimpleType<string>;
    disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
    childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
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
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
export declare function getStores(): {
    [propName: string]: {
        id: string;
        path: string;
        storeType: string;
        disposed: boolean;
        parentId: string;
        childrenIds: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>>;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
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
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        id: import("mobx-state-tree").ISimpleType<string>;
        path: import("mobx-state-tree").IType<string | undefined, string, string>;
        storeType: import("mobx-state-tree").ISimpleType<string>;
        disposed: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        parentId: import("mobx-state-tree").IType<string | undefined, string, string>;
        childrenIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
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
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
};
