import React, { CSSProperties, ReactNode } from 'react';
import { Dayjs } from 'dayjs';
export interface DateInputRangeProps {
    style?: CSSProperties;
    className?: string | string[];
    error?: boolean;
    disabled?: boolean | boolean[];
    placeholder?: string[];
    value?: Dayjs[];
    popupVisible?: boolean;
    format?: string;
    size?: 'mini' | 'small' | 'default' | 'large';
    allowClear?: boolean;
    onClear?: (e: any) => void;
    onPressEnter?: () => void;
    onPressTab?: (e: any) => void;
    editable?: boolean;
    suffixIcon?: ReactNode;
    onChange?: (e: any) => void;
    inputValue?: string;
    separator?: ReactNode;
    changeFocusedInputIndex?: (index: number) => void;
    focusedInputIndex?: number;
    isPlaceholder?: boolean;
}
declare type DateInputHandle = {
    focus: () => void;
    blur: () => void;
};
declare const _default: React.ForwardRefExoticComponent<DateInputRangeProps & React.RefAttributes<DateInputHandle>>;
export default _default;
