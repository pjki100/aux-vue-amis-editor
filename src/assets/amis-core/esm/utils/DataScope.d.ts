import { JSONSchema } from '../types';
export declare class DataScope {
    parent?: DataScope;
    readonly children: Array<DataScope>;
    readonly id: string;
    ref?: string;
    name?: string;
    tag?: string;
    description?: string;
    readonly schemas: Array<JSONSchema>;
    constructor(schemas: JSONSchema | Array<JSONSchema>, id: string);
    addChild(id: string, schema?: JSONSchema | Array<JSONSchema>): DataScope;
    removeChild(idOrScope: string | DataScope): void;
    setSchemas(schemas: Array<JSONSchema>): this;
    addSchema(schema: JSONSchema): this;
    removeSchema(id: string): this;
    contains(scope: DataScope): boolean;
    getMergedSchema(): any;
    protected buildOptions(options: Array<any>, schema: JSONSchema, path?: string, key?: string, 
    /** 是否数组元素，数组元素的内容将获取每个成员的对应值 */
    isArrayItem?: boolean, 
    /** 不是所有的都可以选择，但不影响子元素 */
    disabled?: boolean): void;
    getDataPropsAsOptions(): any;
    getSchemaByPath(path: string): import("json-schema").JSONSchema7 | null;
}
