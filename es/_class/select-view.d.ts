import React, { ReactNode, CSSProperties } from 'react';
import { InputTagProps } from '../InputTag';
import { InputComponentProps } from '../Input/interface';
export interface SelectViewCommonProps extends Pick<InputTagProps<unknown>, 'animation' | 'renderTag' | 'dragToSort'> {
    style?: CSSProperties;
    className?: string | string[];
    children?: ReactNode;
    inputValue?: string;
    /**
     * @zh 选择框默认文字。
     * @en Placeholder of element
     */
    placeholder?: string;
    /**
     * @zh 是否需要边框
     * @en Whether to render border
     * @defaultValue true
     */
    bordered?: boolean;
    /**
     * @zh
     * 使单选模式可搜索，传入 `{ retainInputValue: true }` 在搜索框聚焦时保留现有内容
     * 传入 `{ retainInputValueWhileSelect: true }` 在多选选择时保留输入框内容。
     * @en
     * Whether single mode Select is searchable. `{ retainInputValue: true }` to retain the existing content when the search box is focused,
     * `{ retainInputValueWhileSelect: true }` to retain the existing content when multiple selection is selected.
     */
    showSearch?: boolean | {
        retainInputValue?: boolean;
        retainInputValueWhileSelect?: boolean;
    };
    /**
     * @zh 分别不同尺寸的选择器。对应 `24px`, `28px`, `32px`, `36px`
     * @en Height of element, `24px` `28px` `32px` `36px`
     */
    size?: 'mini' | 'small' | 'default' | 'large';
    /**
     * @zh 是否为禁用状态。
     * @en Whether is disabled
     */
    disabled?: boolean;
    /**
     * @zh 是否为错误状态。
     * @en Error Style
     */
    error?: boolean;
    /**
     * @zh 是否为加载状态。
     * @en Whether is in loading
     */
    loading?: boolean;
    /**
     * @zh 允许清除值。
     * @en Whether allow to clear selected options
     */
    allowClear?: boolean;
    /**
     * @zh 是否允许通过输入创建新的选项。
     * @en Whether to allow new options to be created by input.
     * @version 2.13.0
     */
    allowCreate?: boolean;
    /**
     * @zh 最多显示多少个 `tag`，仅在多选或标签模式有效。
     * @en The maximum number of `tags` is displayed, only valid in `multiple` and `label` mode.
     */
    maxTagCount?: number;
    /**
     * @zh 前缀。
     * @en Customize select suffix
     * @version 2.11.0
     */
    prefix?: ReactNode;
    /**
     * @zh 自定义选择框后缀图标。
     * @en Customize select suffix icon
     */
    suffixIcon?: ReactNode;
    /**
     * @zh 自定义箭头图标，设置为 `null` 不显示箭头图标。
     * @en Customize select arrow icon.
     */
    arrowIcon?: ReactNode | null;
    /**
     * @zh 多选时配置选中项的删除图标。当传入`null`，不显示删除图标。
     * @en Customize the delete icon of tags selected in `multiple` and `label` mode.
     */
    removeIcon?: ReactNode | null;
    /**
     * @zh `allowClear` 时配置清除按钮的图标。
     * @en Configure the icon of the clear button when `allowClear`.
     * @version 2.26.0
     */
    clearIcon?: ReactNode;
    /**
     * @zh 鼠标点击下拉框时的回调
     * @en Callback when the mouse clicks on the drop-down box
     */
    onClick?: (e: any) => void;
}
export interface SelectViewProps extends SelectViewCommonProps {
    value?: any;
    popupVisible?: boolean;
    isEmptyValue: boolean;
    isMultiple?: boolean;
    prefixCls: string;
    ariaControls?: string;
    renderText: (value: any) => {
        text: any;
        disabled: any;
    };
    onSort?: (value: any) => void;
    onRemoveCheckedItem?: (item: any, index: number, e: any) => void;
    onChangeInputValue?: InputComponentProps['onChange'];
    onKeyDown?: (e: any) => void;
    onPaste?: (e: any) => void;
    onClear?: (e: any) => void;
    onFocus?: (e: any) => void;
    onBlur?: (e: any) => void;
}
export declare type SelectViewHandle = {
    dom: HTMLDivElement;
    focus: () => void;
    blur: () => void;
    getWidth: () => number;
};
export declare const SelectView: (props: SelectViewProps, ref: any) => JSX.Element;
declare const SelectViewComponent: React.ForwardRefExoticComponent<SelectViewProps & React.RefAttributes<SelectViewHandle>>;
export default SelectViewComponent;
