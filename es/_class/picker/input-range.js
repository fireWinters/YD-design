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
import React, { useRef, useImperativeHandle, useContext, forwardRef, } from 'react';
import IconClose from '../../../icon/react-icon/IconClose';
import IconHover from '../../_class/icon-hover';
import cs from '../../_util/classNames';
import { Enter, Tab } from '../../_util/keycode';
import omit from '../../_util/omit';
import { ConfigContext } from '../../ConfigProvider';
import { isArray } from '../../_util/is';
function DateInput(_a, ref) {
    var _b;
    var allowClear = _a.allowClear, error = _a.error, style = _a.style, className = _a.className, disabled = _a.disabled, _c = _a.placeholder, placeholder = _c === void 0 ? [] : _c, _d = _a.value, value = _d === void 0 ? [] : _d, popupVisible = _a.popupVisible, format = _a.format, propSize = _a.size, onClear = _a.onClear, editable = _a.editable, inputValue = _a.inputValue, onPressEnter = _a.onPressEnter, onPressTab = _a.onPressTab, onChange = _a.onChange, separator = _a.separator, suffixIcon = _a.suffixIcon, changeFocusedInputIndex = _a.changeFocusedInputIndex, focusedInputIndex = _a.focusedInputIndex, isPlaceholder = _a.isPlaceholder, rest = __rest(_a, ["allowClear", "error", "style", "className", "disabled", "placeholder", "value", "popupVisible", "format", "size", "onClear", "editable", "inputValue", "onPressEnter", "onPressTab", "onChange", "separator", "suffixIcon", "changeFocusedInputIndex", "focusedInputIndex", "isPlaceholder"]);
    var _e = useContext(ConfigContext), getPrefixCls = _e.getPrefixCls, ctxSize = _e.size, locale = _e.locale;
    var input0 = useRef(null);
    var input1 = useRef(null);
    var disabled1 = isArray(disabled) ? disabled[0] : disabled;
    var disabled2 = isArray(disabled) ? disabled[1] : disabled;
    useImperativeHandle(ref, function () { return ({
        focus: function (index) {
            var focusedIndex = typeof index === 'number' ? index : focusedInputIndex;
            var focusElement = focusedIndex === 0 ? input0 : input1;
            if ((focusedInputIndex === 0 && !disabled1) || (focusedInputIndex === 1 && !disabled2)) {
                focusElement.current && focusElement.current.focus && focusElement.current.focus();
            }
        },
        blur: function () {
            if (focusedInputIndex === 0) {
                input0.current && input0.current.blur && input0.current.blur();
            }
            if (focusedInputIndex === 1) {
                input1.current && input1.current.blur && input1.current.blur();
            }
        },
    }); });
    function changeFocusedInput(index) {
        if (focusedInputIndex !== index) {
            changeFocusedInputIndex(index);
        }
    }
    function onKeyDown(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === Enter.code) {
            onPressEnter && onPressEnter();
        }
        if (keyCode === Tab.code) {
            onPressTab && onPressTab(e);
        }
    }
    function onChangeInput(e) {
        e.stopPropagation();
        onChange && onChange(e);
    }
    var prefixCls = getPrefixCls('picker');
    var size = propSize || ctxSize;
    var inputClassNames = cs(prefixCls, prefixCls + "-range", prefixCls + "-size-" + size, (_b = {},
        _b[prefixCls + "-focused"] = !!popupVisible,
        _b[prefixCls + "-disabled"] = disabled1 && disabled2,
        _b[prefixCls + "-error"] = error,
        _b), className);
    var getInputValue = function (index) {
        var valueText = value[index] ? value[index].locale(locale.dayjsLocale).format(format) : '';
        if (inputValue) {
            return index === focusedInputIndex ? inputValue : valueText;
        }
        return valueText;
    };
    var readOnlyProps = editable ? {} : { readOnly: true };
    function getFocusInputClassName(index) {
        var _a;
        return cs(prefixCls + "-input", (_a = {},
            _a[prefixCls + "-input-active"] = focusedInputIndex === index,
            _a[prefixCls + "-input-placeholder"] = isPlaceholder && focusedInputIndex === index,
            _a));
    }
    return (React.createElement("div", __assign({ style: style, className: inputClassNames }, omit(rest, ['onChange', 'onPressEnter'])),
        React.createElement("div", { className: getFocusInputClassName(0) },
            React.createElement("input", __assign({ ref: input0, disabled: disabled1, placeholder: placeholder[0], value: getInputValue(0), onChange: onChangeInput, onKeyDown: onKeyDown, onClick: function () { return changeFocusedInput(0); } }, readOnlyProps))),
        React.createElement("span", { className: prefixCls + "-separator" }, separator || '-'),
        React.createElement("div", { className: getFocusInputClassName(1) },
            React.createElement("input", __assign({ ref: input1, disabled: disabled2, placeholder: placeholder[1], value: getInputValue(1), onChange: onChangeInput, onKeyDown: onKeyDown, onClick: function () { return changeFocusedInput(1); } }, readOnlyProps))),
        React.createElement("div", { className: prefixCls + "-suffix" },
            allowClear && value.length === 2 && (React.createElement(IconHover, { prefix: prefixCls, onClick: onClear, className: prefixCls + "-clear-icon" },
                React.createElement(IconClose, null))),
            React.createElement("span", { className: prefixCls + "-suffix-icon" }, suffixIcon))));
}
export default forwardRef(DateInput);
