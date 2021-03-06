export declare function getScrollBarHeight(ele: HTMLElement | null): number;
export declare function getScrollBarWidth(ele: HTMLElement | null): number;
export declare function isChildrenNotEmpty(record: any, field: string): any;
export declare function getSelectedKeys(record: any, checked: any, checkedRowKeys: any[], _indeterminateKeys: any[], getRowKey: any, childrenColumnName: any, checkConnected: any): {
    selectedRowKeys: any[];
    indeterminateKeys: any[];
};
export declare function getSelectedKeysByData(flattenData: any, checkedKeys: any[], getRowKey: any, childrenColumnName: string, checkConnected: boolean): {
    selectedRowKeys: any[];
    indeterminateKeys: any[];
};
