var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React, { useImperativeHandle, useEffect, forwardRef, useContext, useRef, } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import merge from 'lodash/merge';
import cs from '../_util/classNames';
import useForm from './useForm';
import ConfigProvider, { ConfigContext } from '../ConfigProvider';
import { FormContext as RawFormContext, FormProviderContext, } from './context';
import { isObject } from '../_util/is';
import omit from '../_util/omit';
import useMergeProps from '../_util/hooks/useMergeProps';
import { ID_SUFFIX } from './utils';
function getFormElementId(prefix, field) {
    var id = field.replace(/[\[\.]/g, '_').replace(/\]/g, '');
    return prefix ? prefix + "-" + id : "" + id;
}
var defaultProps = {
    layout: 'horizontal',
    labelCol: { span: 5, offset: 0 },
    labelAlign: 'right',
    wrapperCol: { span: 19, offset: 0 },
    requiredSymbol: true,
    wrapper: 'form',
    validateTrigger: 'onChange',
};
var Form = function (baseProps, ref) {
    var _a, _b;
    var ctx = useContext(ConfigContext);
    var formProviderCtx = useContext(FormProviderContext);
    var wrapperRef = useRef(null);
    var _c = __read(useForm(baseProps.form), 1), formInstance = _c[0];
    var isMount = useRef();
    var props = useMergeProps(baseProps, defaultProps, (_a = ctx.componentConfig) === null || _a === void 0 ? void 0 : _a.Form);
    var layout = props.layout, labelCol = props.labelCol, wrapperCol = props.wrapperCol, Wrapper = props.wrapper, id = props.id, requiredSymbol = props.requiredSymbol, labelAlign = props.labelAlign, disabled = props.disabled, colon = props.colon, className = props.className, validateTrigger = props.validateTrigger, formPrefixCls = props.prefixCls, validateMessages = props.validateMessages, rest = __rest(props, ["layout", "labelCol", "wrapperCol", "wrapper", "id", "requiredSymbol", "labelAlign", "disabled", "colon", "className", "validateTrigger", "prefixCls", "validateMessages"]);
    var prefixCls = formPrefixCls || ctx.getPrefixCls('form');
    var size = 'size' in props ? props.size : ctx.size;
    var innerMethods = formInstance.getInnerMethods(true);
    if (!isMount.current) {
        innerMethods.innerSetInitialValues(props.initialValues);
    }
    useEffect(function () {
        isMount.current = true;
    }, []);
    useEffect(function () {
        var unregister;
        if (formProviderCtx.register) {
            unregister = formProviderCtx.register(props.id, formInstance);
        }
        return unregister;
    }, [props.id, formInstance]);
    useImperativeHandle(ref, function () {
        return formInstance;
    });
    // ?????????????????????????????????
    formInstance.scrollToField = function (field, options) {
        var node = wrapperRef.current;
        var id = props.id;
        if (!node) {
            return;
        }
        var fieldNode = node.querySelector("#" + getFormElementId(id, field));
        if (!fieldNode) {
            // ???????????????nostyle??? fieldNode??????????????????????????????????????????
            fieldNode = node.querySelector("#" + getFormElementId(id, field) + ID_SUFFIX);
        }
        fieldNode &&
            scrollIntoView(fieldNode, __assign({ behavior: 'smooth', block: 'nearest', scrollMode: 'if-needed' }, options));
    };
    innerMethods.innerSetCallbacks({
        onValuesChange: function (value, values) {
            props.onValuesChange && props.onValuesChange(value, values);
            formProviderCtx.onFormValuesChange && formProviderCtx.onFormValuesChange(props.id, value);
        },
        onChange: props.onChange,
        onValidateFail: function (errors) {
            if (props.scrollToFirstError) {
                var options = isObject(props.scrollToFirstError) ? props.scrollToFirstError : {};
                formInstance.scrollToField(Object.keys(errors)[0], options);
            }
        },
        onSubmitFailed: props.onSubmitFailed,
        onSubmit: function (values) {
            props.onSubmit && props.onSubmit(values);
            formProviderCtx.onFormSubmit && formProviderCtx.onFormSubmit(props.id, values);
        },
    });
    var contextProps = {
        requiredSymbol: requiredSymbol,
        labelAlign: labelAlign,
        disabled: disabled,
        colon: colon,
        labelCol: labelCol,
        wrapperCol: wrapperCol,
        layout: layout,
        store: formInstance,
        prefixCls: prefixCls,
        validateTrigger: validateTrigger,
        validateMessages: merge({}, (_b = ctx.locale.Form) === null || _b === void 0 ? void 0 : _b.validateMessages, validateMessages),
        getFormElementId: function (field) { return getFormElementId(id, field); },
    };
    var FormContext = RawFormContext;
    return (React.createElement(ConfigProvider, __assign({}, ctx, { size: size }),
        React.createElement(FormContext.Provider, { value: contextProps },
            React.createElement(Wrapper, __assign({ ref: wrapperRef }, omit(rest, [
                'form',
                'size',
                'initialValues',
                'onValuesChange',
                'onChange',
                'wrapperProps',
                'scrollToFirstError',
                'onSubmit',
                'onSubmitFailed',
            ]), props.wrapperProps, { className: cs(prefixCls, prefixCls + "-" + layout, prefixCls + "-size-" + size, className), style: props.style, onSubmit: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    formInstance.submit();
                }, id: id }), props.children))));
};
var FormComponent = forwardRef(Form);
FormComponent.displayName = 'Form';
export default FormComponent;
