import { createContext } from 'react';
import { NOOP } from '../_util/constant';
export var FormContext = createContext({
    layout: 'horizontal',
    labelCol: { span: 5, offset: 0 },
    labelAlign: 'right',
    wrapperCol: { span: 19, offset: 0 },
    requiredSymbol: true,
    getFormElementId: function () { return 'arco-'; },
    store: {
        getFieldsValue: NOOP,
        getFieldValue: NOOP,
        getFieldError: NOOP,
        getFieldsError: NOOP,
        getTouchedFields: NOOP,
        getFields: NOOP,
        setFieldValue: NOOP,
        setFieldsValue: NOOP,
        setFields: NOOP,
        resetFields: NOOP,
        submit: NOOP,
        validate: NOOP,
        scrollToField: NOOP,
        getInnerMethods: function () { return ({
            registerField: NOOP,
        }); },
    },
});
export var FormItemContext = createContext({});
export var FormProviderContext = createContext({});
