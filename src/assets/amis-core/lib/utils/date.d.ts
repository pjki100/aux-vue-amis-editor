import moment from 'moment';
export declare const relativeValueRe: RegExp;
export declare const filterDate: (value: string, data?: object, format?: string, utc?: boolean) => moment.Moment;
export declare function parseDuration(str: string): moment.Duration | undefined;
