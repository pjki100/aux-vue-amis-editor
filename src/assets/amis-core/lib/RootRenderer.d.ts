import React from 'react';
import type { RootProps } from './Root';
import { IScopedContext } from './Scoped';
import { IRootStore } from './store/root';
import { ActionObject } from './types';
export interface RootRendererProps extends RootProps {
    location?: any;
    render: (region: string, schema: any, props: any) => React.ReactNode;
}
export declare class RootRenderer extends React.Component<RootRendererProps> {
    store: IRootStore;
    static contextType: React.Context<IScopedContext>;
    constructor(props: RootRendererProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: RootRendererProps): void;
    componentDidCatch(error: any, errorInfo: any): void;
    componentWillUnmount(): void;
    handlePageVisibilityChange(): void;
    handleAction(e: React.UIEvent<any> | void, action: ActionObject, ctx: object, throwErrors?: boolean, delegate?: IScopedContext): void;
    handleDialogConfirm(values: object[], action: ActionObject, ...args: Array<any>): void;
    handleDialogClose(confirmed?: boolean): void;
    handleDrawerConfirm(values: object[], action: ActionObject, ...args: Array<any>): void;
    handleDrawerClose(): void;
    openFeedback(dialog: any, ctx: any): Promise<unknown>;
    reloadTarget(scoped: IScopedContext, target: string, data?: any): void;
    render(): React.ReactNode;
}
