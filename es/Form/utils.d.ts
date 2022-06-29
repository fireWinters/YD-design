import { PropertyPath } from 'lodash';
import { ReactNode } from 'react';
import { IndexedObject } from './interface';
import { RulesProps } from '..';
export declare function cloneDeep(value: any): any;
export declare const formatValidateMsg: (validateMessages: any, info: {
    label: ReactNode;
}) => any;
export declare function set<T extends IndexedObject>(target: T, field: PropertyPath, value: any): T;
export declare function iterativelyGetKeys(obj: any, prefix?: string): any;
export declare function isSyntheticEvent(e: any): boolean;
export declare function schemaValidate(field: any, value: any, _rules: RulesProps[], validateMessages: any): Promise<unknown>;
export declare const ID_SUFFIX = "_input";
