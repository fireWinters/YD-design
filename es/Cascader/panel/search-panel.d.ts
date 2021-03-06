import { CSSProperties, ReactNode } from 'react';
import { OptionProps, CascaderProps } from '../interface';
import Store from '../base/store';
export declare const getLegalIndex: (currentIndex: any, maxIndex: any) => any;
export declare type SearchPanelProps<T> = {
    store?: Store<T>;
    style?: CSSProperties;
    prefixCls?: string;
    multiple?: boolean;
    value: string[][];
    inputValue?: string;
    onEsc?: () => void;
    onChange?: (value: string[][]) => void;
    renderEmpty?: () => ReactNode;
    virtualListProps?: CascaderProps<T>['virtualListProps'];
};
declare const SearchPanel: <T extends OptionProps>(props: SearchPanelProps<T>) => JSX.Element;
export default SearchPanel;
