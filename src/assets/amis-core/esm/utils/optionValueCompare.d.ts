import { OptionValue, Option } from '../types';
export declare function matchOptionValue(a: OptionValue, b: Option, valueField?: string): boolean;
export declare function optionValueCompare(a: OptionValue, valueField?: string): (b: Option) => boolean;
