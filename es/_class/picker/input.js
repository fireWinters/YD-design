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
import React, { useRef, useImperativeHandle, forwardRef, useContext, } from 'react';
import omit from '../../_util/omit';
import { Enter } from '../../_util/keycode';
import { ConfigContext } from '../../ConfigProvider';
import IconClose from '../../../icon/react-icon/IconClose';
import IconHover from '../../_class/icon-hover';
import cs from '../../_util/classNames';
import { isArray } from '../../_util/is';
function DateInput(_a, ref) {
    var _b, _c;
    var style = _a.style, className = _a.className, propPrefixCls = _a.prefixCls, allowClear = _a.allowClear, error = _a.error, disabled = _a.disabled, placeholder = _a.placeholder, format = _a.format, propSize = _a.size, onClear = _a.onClear, editable = _a.editable, value = _a.value, inputValue = _a.inputValue, onPressEnter = _a.onPressEnter, suffixIcon = _a.suffixIcon, onChange = _a.onChange, popupVisible = _a.popupVisible, isPlaceholder = _a.isPlaceholder, rest = __rest(_a, ["style", "className", "prefixCls", "allowClear", "error", "disabled", "placeholder", "format", "size", "onClear", "editable", "value", "inputValue", "onPressEnter", "suffixIcon", "onChange", "popupVisible", "isPlaceholder"]);
    var _d = useContext(ConfigContext), getPrefixCls = _d.getPrefixCls, ctxSize = _d.size, locale = _d.locale;
    var input = useRef(null);
    var size = propSize || ctxSize;
    useImperativeHandle(ref, function () { return ({
        focus: function () {
            input.current && input.current.focus && input.current.focus();
        },
        blur: function () {
            input.current && input.current.blur && input.current.blur();
        },
    }); });
    function onKeyDown(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === Enter.code) {
            onPressEnter && onPressEnter();
        }
    }
    var showValue = '';
    if (inputValue !== undefined) {
        showValue = inputValue;
    }
    else if (value && !isArray(value)) {
        showValue =
            typeof format === 'function'
                ? format(value)
                : value.locale(locale.dayjsLocale).format(format);
    }
    var readOnlyProps = editable ? {} : { readOnly: true };
    var prefixCls = propPrefixCls || getPrefixCls('picker');
    var classNames = cs(prefixCls, prefixCls + "-size-" + size, (_b = {},
        _b[prefixCls + "-focused"] = !!popupVisible,
        _b[prefixCls + "-disabled"] = disabled,
        _b[prefixCls + "-error"] = error,
        _b), className);
    return (React.createElement("div", __assign({ style: style, className: classNames }, omit(rest, ['onChange', 'onPressEnter'])),
        React.createElement("div", { className: cs(prefixCls + "-input", (_c = {}, _c[prefixCls + "-input-placeholder"] = isPlaceholder, _c)) },
            React.createElement("input", __assign({ ref: input, disabled: disabled, placeholder: placeholder, className: prefixCls + "-start-time", value: showValue, onKeyDown: onKeyDown, onChange: onChange }, readOnlyProps))),
        React.createElement("div", { className: prefixCls + "-suffix" },
            allowClear && showValue && (React.createElement(IconHover, { prefix: prefixCls, onClick: onClear, className: prefixCls + "-clear-icon" },
                React.createElement(IconClose, null))),
            React.createElement("span", { className: prefixCls + "-suffix-icon" }, suffixIcon))));
}
export default forwardRef(DateInput);
