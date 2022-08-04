import { Instance } from 'mobx-state-tree';
import { iRendererStore, IIRendererStore } from './iRenderer';
import { IServiceStore, ServiceStore } from './service';
import { ComboStore, IComboStore } from './combo';
import { FormStore, IFormStore } from './form';
import { CRUDStore, ICRUDStore } from './crud';
import { IColumn, IRow, ITableStore, TableStore } from './table';
import { IColumnV2, IRowV2, ITableStoreV2, TableStoreV2 } from './table-v2';
import { IListStore, ListStore } from './list';
import { IModalStore, ModalStore } from './modal';
import { TranslateFn } from '../locale';
import { IStoreNode, StoreNode } from './node';
import { FormItemStore, IFormItemStore } from './formItem';
import { IPaginationStore, PaginationStore } from './pagination';
import { AppStore, IAppStore } from './app';
export declare const RendererStore: import("mobx-state-tree").IModelType<{
    storeType: import("mobx-state-tree").IType<string | undefined, string, string>;
}, {
    readonly fetcher: any;
    readonly notify: any;
    readonly isCancel: (value: any) => boolean;
    readonly __: TranslateFn<any>;
    getStoreById(id: string): {
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
    readonly stores: {
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
} & {
    addStore(store: {
        [propName: string]: any;
        storeType: string;
        id: string;
        path: string;
        parentId?: string | undefined;
    }): IStoreNode;
    removeStore(store: IStoreNode): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export declare type IRendererStore = Instance<typeof RendererStore>;
export { iRendererStore, IIRendererStore };
export declare const RegisterStore: (store: any) => void;
export { ServiceStore, IServiceStore, FormStore, IFormStore, ComboStore, IComboStore, CRUDStore, ICRUDStore, TableStore, IColumn, IRow, ITableStore, TableStoreV2, ITableStoreV2, IColumnV2, IRowV2, ListStore, IListStore, ModalStore, IModalStore, FormItemStore, IFormItemStore, PaginationStore, IPaginationStore, AppStore, IAppStore, StoreNode, IStoreNode };
