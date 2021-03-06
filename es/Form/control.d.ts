import React, { Component } from 'react';
import { FormControlProps, FieldError, FormItemContextProps, KeyType } from './interface';
import { NotifyType, StoreChangeInfo } from './store';
export default class Control<FormData = any, FieldValue = FormData[keyof FormData], FieldKey extends KeyType = keyof FormData> extends Component<FormControlProps<FormData, FieldValue, FieldKey>> {
    static defaultProps: {
        trigger: string;
        triggerPropName: string;
    };
    static isFormControl: boolean;
    static contextType: React.Context<FormItemContextProps<any, any, string | number | symbol>>;
    context: FormItemContextProps<FormData, FieldValue, FieldKey>;
    private errors;
    private warnings;
    private isDestroyed;
    private touched;
    private removeRegisterField;
    constructor(props: FormControlProps<FormData, FieldValue, FieldKey>, context: FormItemContextProps<FormData, FieldValue, FieldKey>);
    componentDidMount(): void;
    componentWillUnmount(): void;
    getErrors: () => FieldError<FieldValue> | null;
    isTouched: () => boolean;
    hasFieldProps: () => boolean;
    private updateFormItem;
    onStoreChange: (type: NotifyType, info: StoreChangeInfo<FieldKey> & {
        current: any;
    }) => void;
    innerSetFieldValue: (field: FieldKey, value: FieldValue) => void;
    getTriggerHandler: (children: any) => (_value: any, ...args: any[]) => void;
    /**
     *
     * @param triggerType the value of validateTrigger.
     * @returns
     */
    validateField: (triggerType?: string) => Promise<{
        error: FieldError<FieldValue> | null;
        value: FieldValue;
        field: FieldKey;
    }>;
    /**
     * 收集rules里的validateTrigger字段
     */
    getValidateTrigger(): string[];
    renderControl(children: React.ReactNode, id: any): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    getChild: () => any;
    render(): any;
}
