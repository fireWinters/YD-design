import { ReactNode } from 'react';
import Node from '../base/node';
import { OptionProps } from '../interface';
export interface CascaderOptionProps<T> {
    prefixCls?: string;
    multiple?: boolean;
    selected?: boolean;
    isLeaf?: boolean;
    option: Node<T>;
    renderOption?: () => ReactNode;
    onClickOption?: () => void;
    onDoubleClickOption?: () => void;
    onMouseEnter?: () => void;
    onMultipleChecked?: (checked: boolean) => void;
}
declare const Option: <T extends OptionProps>(props: CascaderOptionProps<T>) => JSX.Element;
export default Option;
