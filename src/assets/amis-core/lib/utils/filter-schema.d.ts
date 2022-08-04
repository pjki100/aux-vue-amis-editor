import { PlainObject } from '../types';
/**
 * 处理 Props 数据，所有带 On 结束的做一次
 *
 * xxxOn
 * xxxExpr
 *
 *
 * @param schema
 * @param data
 */
export declare function getExprProperties(schema: PlainObject, data?: object, blackList?: Array<string>, props?: any): PlainObject;
export default getExprProperties;
