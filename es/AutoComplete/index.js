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
import React, { useContext, useRef, isValidElement, useState, useImperativeHandle } from 'react';
import cs from '../_util/classNames';
import Input from '../Input';
import { ConfigContext } from '../ConfigProvider';
import useMergeValue from '../_util/hooks/useMergeValue';
import Select from '../Select/select';
import { isSelectOption, isSelectOptGroup } from '../Select/utils';
import { Enter, Esc } from '../_util/keycode';
import omit from '../_util/omit';
import IconLoading from '../../icon/react-icon/IconLoading';
import useMergeProps from '../_util/hooks/useMergeProps';
var IMPOSSIBLE_VALUE = "Autocomplete_" + Math.random();
var Option = Select.Option;
var defaultProps = {
    defaultActiveFirstOption: true,
    triggerElement: React.createElement(Input, null),
};
function AutoComplete(baseProps, ref) {
    var _a = useContext(ConfigContext), getPrefixCls = _a.getPrefixCls, componentConfig = _a.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.AutoComplete);
    var style = props.style, className = props.className, children = props.children, data = props.data, defaultValue = props.defaultValue, propValue = props.value, placeholder = props.placeholder, error = props.error, disabled = props.disabled, strict = props.strict, allowClear = props.allowClear, loading = props.loading, defaultActiveFirstOption = props.defaultActiveFirstOption, triggerElement = props.triggerElement, getPopupContainer = props.getPopupContainer, dropdownRender = props.dropdownRender, virtualListProps = props.virtualListProps, onFocus = props.onFocus, onBlur = props.onBlur, onChange = props.onChange, onSearch = props.onSearch, onSelect = props.onSelect, onPressEnter = props.onPressEnter, inputProps = props.inputProps;
    var _b = __read(useMergeValue('', {
        defaultValue: defaultValue,
        value: propValue,
    }), 2), value = _b[0], setValue = _b[1];
    var _c = __read(useState(false), 2), isFocused = _c[0], setIsFocused = _c[1];
    var refInput = useRef(null);
    var refSelect = useRef(null);
    var prefixCls = getPrefixCls('autocomplete');
    var filterOption = 'filterOption' in props
        ? props.filterOption
        : function (inputValue, option) {
            if (strict) {
                return option.props.value.indexOf(inputValue) > -1;
            }
            return option.props.value.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
        };
    var childNodes = React.Children.toArray(children);
    var selectChildren = null;
    if (childNodes.length && (isSelectOption(childNodes[0]) || isSelectOptGroup(childNodes[0]))) {
        selectChildren = children;
    }
    else if (data && data.length) {
        selectChildren = data.map(function (item, index) {
            if (isValidElement(item)) {
                return item;
            }
            if (typeof item === 'string') {
                return (React.createElement(Option, { key: index, value: item }, item));
            }
            if (typeof item === 'object') {
                var _a = item, value_1 = _a.value, name_1 = _a.name;
                return (React.createElement(Option, { key: index, value: value_1, extra: omit(item, ['value', 'name']) }, name_1));
            }
            return null;
        });
    }
    useImperativeHandle(ref, function () { return refInput.current; });
    var usedTriggerElement = typeof triggerElement === 'function' ? triggerElement({ value: value }) : triggerElement;
    var TriggerElement = React.cloneElement(usedTriggerElement, __assign(__assign({ ref: function (node) {
            refInput.current = node;
            var originRef = usedTriggerElement.ref;
            if (typeof originRef === 'function') {
                originRef(node);
            }
        }, className: cs("" + prefixCls, inputProps && inputProps.className, className), style: style, value: value, placeholder: placeholder, error: error, disabled: disabled, allowClear: allowClear }, inputProps), { 
        // Empty tag to ensure the consistency of the dom structure of input, such that input won't accidentally lose focus due to structure change on input.
        suffix: loading ? React.createElement(IconLoading, null) : (inputProps === null || inputProps === void 0 ? void 0 : inputProps.suffix) || React.createElement("i", null), onFocus: function (event) {
            setIsFocused(true);
            onFocus && onFocus(event);
            inputProps && inputProps.onFocus && inputProps.onFocus(event);
        }, onBlur: function (event) {
            setIsFocused(false);
            onBlur && onBlur(event);
            inputProps && inputProps.onBlur && inputProps.onBlur(event);
        }, onKeyDown: function (event) {
            var keyCode = event.keyCode || event.which;
            refSelect.current && refSelect.current.hotkeyHandler(event);
            if (keyCode === Enter.code && onPressEnter) {
                var activeOption = void 0;
                if (refSelect.current) {
                    activeOption = refSelect.current.getOptionInfoByValue(refSelect.current.activeOptionValue);
                }
                onPressEnter(event, activeOption);
            }
            if (keyCode === Esc.code) {
                refInput.current && refInput.current.blur && refInput.current.blur();
            }
            inputProps && inputProps.onKeyDown && inputProps.onKeyDown(event);
        }, onChange: function (value, event) {
            setValue(value);
            onSearch && onSearch(value);
            onChange && onChange(value);
            inputProps && inputProps.onChange && inputProps.onChange(value, event);
        } }));
    var triggerProps = __assign(__assign({ popupVisible: !!(isFocused && ((data === null || data === void 0 ? void 0 : data.length) || React.Children.count(children))) }, props.triggerProps), { 
        // Other trigger types are not supported yet
        trigger: 'focus', className: [prefixCls + "-popup"].concat(props.triggerProps && props.triggerProps.className) });
    var selectProps = {
        triggerElement: TriggerElement,
        // Guarantee that onChange can always be triggered
        value: IMPOSSIBLE_VALUE,
        inputValue: value,
        defaultActiveFirstOption: defaultActiveFirstOption,
        triggerProps: triggerProps,
        getPopupContainer: getPopupContainer,
        dropdownRender: dropdownRender,
        filterOption: filterOption,
        virtualListProps: virtualListProps,
        notFoundContent: null,
        onChange: function (value, option) {
            setValue(value);
            onChange && onChange(value, option);
            value && onSelect && onSelect(value, option);
            // Blur the input on option change
            refInput.current && refInput.current.blur && refInput.current.blur();
        },
    };
    return (React.createElement(Select, __assign({ ref: refSelect }, selectProps), selectChildren));
}
var ForwardRefAutoComplete = React.forwardRef(AutoComplete);
var AutoCompleteComponent = ForwardRefAutoComplete;
AutoCompleteComponent.displayName = 'AutoComplete';
AutoCompleteComponent.Option = Select.Option;
AutoCompleteComponent.OptGroup = Select.OptGroup;
export default AutoCompleteComponent;
