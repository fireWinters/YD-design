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
import React, { useContext, useState, useImperativeHandle, useRef, useEffect, } from 'react';
import { isUndefined, isObject } from '../_util/is';
import cs from '../_util/classNames';
import { ConfigContext } from '../ConfigProvider';
import IconDown from '../../icon/react-icon/IconDown';
import IconLoading from '../../icon/react-icon/IconLoading';
import IconClose from '../../icon/react-icon/IconClose';
import IconExpand from '../../icon/react-icon/IconExpand';
import IconSearch from '../../icon/react-icon/IconSearch';
import InputTag from '../InputTag';
import InputComponent from '../Input/input-element';
import include from '../_util/include';
import useForceUpdate from '../_util/hooks/useForceUpdate';
import IconHover from './icon-hover';
import { Backspace, Enter } from '../_util/keycode';
var SearchStatus = {
    BEFORE: 0,
    EDITING: 1,
    NONE: 2,
};
export var SelectView = function (props, ref) {
    var _a, _b;
    var style = props.style, className = props.className, size = props.size, bordered = props.bordered, allowClear = props.allowClear, allowCreate = props.allowCreate, error = props.error, loading = props.loading, disabled = props.disabled, animation = props.animation, prefixCls = props.prefixCls, suffixIcon = props.suffixIcon, arrowIcon = props.arrowIcon, removeIcon = props.removeIcon, clearIcon = props.clearIcon, placeholder = props.placeholder, renderText = props.renderText, value = props.value, inputValue = props.inputValue, popupVisible = props.popupVisible, maxTagCount = props.maxTagCount, isMultiple = props.isMultiple, isEmptyValue = props.isEmptyValue, prefix = props.prefix, ariaControls = props.ariaControls, renderTag = props.renderTag, dragToSort = props.dragToSort, onKeyDown = props.onKeyDown, onChangeInputValue = props.onChangeInputValue, onPaste = props.onPaste, onClear = props.onClear, onFocus = props.onFocus, onBlur = props.onBlur, onRemoveCheckedItem = props.onRemoveCheckedItem, onSort = props.onSort, rest = __rest(props, ["style", "className", "size", "bordered", "allowClear", "allowCreate", "error", "loading", "disabled", "animation", "prefixCls", "suffixIcon", "arrowIcon", "removeIcon", "clearIcon", "placeholder", "renderText", "value", "inputValue", "popupVisible", "maxTagCount", "isMultiple", "isEmptyValue", "prefix", "ariaControls", "renderTag", "dragToSort", "onKeyDown", "onChangeInputValue", "onPaste", "onClear", "onFocus", "onBlur", "onRemoveCheckedItem", "onSort"]);
    // refs
    var refInput = useRef(null);
    var refWrapper = useRef(null);
    // state
    var _c = useContext(ConfigContext), ctxSize = _c.size, getPrefixCls = _c.getPrefixCls;
    var _d = __read(useState(SearchStatus.NONE), 2), searchStatus = _d[0], setSearchStatus = _d[1];
    var _e = __read(useState(false), 2), focused = _e[0], setFocused = _e[1];
    var forceUpdate = useForceUpdate();
    // TODO???Will the search be completely controlled by showSearch? Next major version needs to be considered
    var showSearch = 'showSearch' in props ? props.showSearch : isMultiple;
    var canFocusInput = showSearch || allowCreate;
    var mergedSize = size || ctxSize;
    var mergedFocused = focused || popupVisible;
    var isRetainInputValueSearch = isObject(showSearch) && showSearch.retainInputValue;
    // the formatted text of value.
    var renderedValue = !isMultiple && value !== undefined ? renderText(value).text : '';
    // Avoid losing focus caused by clicking certain icons
    var keepFocus = function (event) {
        event && event.preventDefault();
    };
    var handleFocus = function (action) {
        var element = canFocusInput ? refInput.current : refWrapper.current;
        if (element) {
            action === 'focus' ? element.focus() : element.blur();
        }
    };
    var tryTriggerFocusChange = function (action, event) {
        // The focus event at this time should be triggered by the input element
        if (canFocusInput && event.target === refWrapper.current) {
            return;
        }
        if (action === 'focus') {
            setFocused(true);
            onFocus && onFocus(event);
        }
        else {
            setFocused(false);
            onBlur && onBlur(event);
        }
    };
    var tryTriggerKeyDown = function (event) {
        // The keyboard event at this time should be triggered by the input element, ignoring the bubbling up keyboard event
        if (canFocusInput && event.currentTarget === refWrapper.current) {
            return;
        }
        // Prevent the default behavior of the browser when pressing Enter, to avoid submit event in <form>
        var keyCode = event.keyCode || event.which;
        if (keyCode === Enter.code) {
            event.preventDefault();
        }
        onKeyDown && onKeyDown(event);
    };
    useEffect(function () {
        handleFocus(popupVisible ? 'focus' : 'blur');
        if (canFocusInput) {
            setSearchStatus(popupVisible ? SearchStatus.BEFORE : SearchStatus.NONE);
        }
    }, [popupVisible]);
    useImperativeHandle(ref, function () { return ({
        dom: refWrapper.current,
        focus: handleFocus.bind(null, 'focus'),
        blur: handleFocus.bind(null, 'blur'),
        getWidth: function () { return refWrapper.current && refWrapper.current.clientWidth; },
    }); });
    var mergedArrowIcon = 'arrowIcon' in props ? (arrowIcon === null ? null : (React.createElement("div", { className: prefixCls + "-arrow-icon" }, arrowIcon))) : canFocusInput ? (React.createElement("div", { className: prefixCls + "-expand-icon" },
        React.createElement(IconExpand, { style: { transform: 'rotate(-45deg)' } }))) : (React.createElement("div", { className: prefixCls + "-arrow-icon" },
        React.createElement(IconDown, null)));
    var mergedSuffixIcon = loading ? (React.createElement("span", { className: prefixCls + "-loading-icon" },
        React.createElement(IconLoading, null))) : suffixIcon ? (React.createElement("span", { className: prefixCls + "-suffix-icon" }, suffixIcon)) : props.showSearch && popupVisible ? (React.createElement("div", { className: prefixCls + "-search-icon" },
        React.createElement(IconSearch, null))) : (mergedArrowIcon);
    // event handling of input box
    var inputEventHandlers = {
        paste: onPaste,
        keyDown: tryTriggerKeyDown,
        focus: function (event) {
            event.stopPropagation();
            tryTriggerFocusChange('focus', event);
        },
        blur: function (event) {
            event.stopPropagation();
            tryTriggerFocusChange('blur', event);
        },
        change: function (newValue, event) {
            setSearchStatus(SearchStatus.EDITING);
            onChangeInputValue && onChangeInputValue(newValue, event);
        },
    };
    var renderSingle = function () {
        var _a, _b;
        var _inputValue;
        switch (searchStatus) {
            case SearchStatus.BEFORE:
                _inputValue = inputValue || (isRetainInputValueSearch ? renderedValue : '');
                break;
            case SearchStatus.EDITING:
                _inputValue = inputValue || '';
                break;
            default:
                _inputValue = renderedValue;
                break;
        }
        var inputProps = {
            style: { width: '100%' },
            // _inputValue after renderText(value) may be rich text, but the value of <input> cannot be object
            value: typeof _inputValue !== 'object' ? _inputValue : '',
            // Allow placeholder to display the selected value first when searching
            placeholder: canFocusInput && renderedValue && typeof renderedValue !== 'object'
                ? renderedValue
                : placeholder,
        };
        if (canFocusInput) {
            inputProps.onPaste = inputEventHandlers.paste;
            inputProps.onKeyDown = inputEventHandlers.keyDown;
            inputProps.onFocus = inputEventHandlers.focus;
            inputProps.onBlur = inputEventHandlers.blur;
            inputProps.onChange = inputEventHandlers.change;
        }
        else {
            // Avoid input getting focus by Tab
            // Do NOT pass [disabled] to <input>, otherwise the click event will not be triggered
            // https://stackoverflow.com/questions/7833854/jquery-detect-click-on-disabled-submit-button
            inputProps.tabIndex = -1;
            inputProps.style.pointerEvents = 'none';
        }
        // <input> is used to input and display placeholder, in other cases use <span> to display value to support displaying rich text
        var needShowInput = !!((mergedFocused && canFocusInput) || isEmptyValue);
        return (React.createElement(React.Fragment, null,
            React.createElement(InputComponent, __assign({ "aria-hidden": !needShowInput || undefined, ref: refInput, disabled: disabled, className: cs(prefixCls + "-view-input", (_a = {},
                    _a[prefixCls + "-hidden"] = !needShowInput,
                    _a)), autoComplete: "off" }, inputProps)),
            React.createElement("span", { "aria-hidden": needShowInput || undefined, className: cs(prefixCls + "-view-value", (_b = {}, _b[prefixCls + "-hidden"] = needShowInput, _b)) }, _inputValue)));
    };
    var renderMultiple = function () {
        var usedValue = isUndefined(value) ? [] : [].concat(value);
        var usedMaxTagCount = typeof maxTagCount === 'number' ? Math.max(maxTagCount, 0) : usedValue.length;
        var tagsToShow = [];
        var lastClosableTagIndex = -1;
        for (var i = usedValue.length - 1; i >= 0; i--) {
            var v = usedValue[i];
            var result = renderText(v);
            if (i < usedMaxTagCount) {
                tagsToShow.unshift({
                    value: v,
                    label: result.text,
                    closable: !result.disabled,
                });
            }
            if (!result.disabled && lastClosableTagIndex === -1) {
                lastClosableTagIndex = i;
            }
        }
        var invisibleTagCount = usedValue.length - usedMaxTagCount;
        if (invisibleTagCount > 0) {
            tagsToShow.push({
                label: "+" + invisibleTagCount + "...",
                closable: false,
                // InputTag needs to extract value as key
                value: '__arco_value_tag_placeholder',
            });
        }
        var eventHandlers = {
            onPaste: inputEventHandlers.paste,
            onKeyDown: inputEventHandlers.keyDown,
            onFocus: inputEventHandlers.focus,
            onBlur: inputEventHandlers.blur,
            onInputChange: inputEventHandlers.change,
            onRemove: function (value, index, event) {
                // Should always delete the last option value when press Backspace
                var keyCode = event.keyCode || event.which;
                if (keyCode === Backspace.code && lastClosableTagIndex > -1) {
                    value = usedValue[lastClosableTagIndex];
                    index = lastClosableTagIndex;
                }
                // If there is a limit on the maximum number of tags, the parameters passed into InputTag need to be recalculated
                maxTagCount && forceUpdate();
                onRemoveCheckedItem && onRemoveCheckedItem(value, index, event);
            },
        };
        return (React.createElement(InputTag
        // Avoid when clicking outside the browser window, InputTag out of focus
        , __assign({ 
            // Avoid when clicking outside the browser window, InputTag out of focus
            className: mergedFocused ? getPrefixCls('input-tag') + "-focus" : '', ref: refInput, disabled: disabled, dragToSort: dragToSort, disableInput: !showSearch, animation: animation, placeholder: placeholder, value: tagsToShow, inputValue: inputValue, size: mergedSize, tagClassName: prefixCls + "-tag", renderTag: renderTag, icon: { removeIcon: removeIcon }, onChange: function (value, reason) {
                if (onSort && reason === 'sort') {
                    onSort(value);
                }
            } }, eventHandlers)));
    };
    var classNames = cs(prefixCls, prefixCls + "-" + (isMultiple ? 'multiple' : 'single'), (_a = {},
        _a[prefixCls + "-show-search"] = showSearch,
        _a[prefixCls + "-open"] = popupVisible,
        _a[prefixCls + "-size-" + mergedSize] = mergedSize,
        _a[prefixCls + "-focused"] = mergedFocused,
        _a[prefixCls + "-error"] = error,
        _a[prefixCls + "-disabled"] = disabled,
        _a[prefixCls + "-no-border"] = !bordered,
        _a), className);
    var mergedClearIcon = !disabled && !isEmptyValue && allowClear ? (React.createElement(IconHover, { size: mergedSize, key: "clearIcon", className: prefixCls + "-clear-icon", onClick: onClear, onMouseDown: keepFocus }, clearIcon !== undefined && clearIcon !== null ? clearIcon : React.createElement(IconClose, null))) : null;
    return (React.createElement("div", __assign({ role: "combobox", "aria-haspopup": "listbox", "aria-autocomplete": "list", "aria-expanded": popupVisible, "aria-disabled": disabled, "aria-controls": ariaControls }, include(rest, ['onClick', 'onMouseEnter', 'onMouseLeave']), { ref: refWrapper, tabIndex: disabled ? -1 : 0, style: style, className: classNames, 
        // When there is an input box, the keyboard events are handled inside the input box to avoid triggering redundant events in the Chinese input method
        onKeyDown: tryTriggerKeyDown, onFocus: function (event) {
            if (!disabled && !dragToSort) {
                // Focus on the input, otherwise you need to press the Tab key twice to focus on the input box
                if (canFocusInput) {
                    refInput.current && refInput.current.focus();
                }
                else {
                    tryTriggerFocusChange('focus', event);
                }
            }
        }, onBlur: function (event) { return tryTriggerFocusChange('blur', event); } }),
        React.createElement("div", { title: typeof renderedValue === 'string' ? renderedValue : undefined, className: cs(prefixCls + "-view", (_b = {},
                _b[prefixCls + "-view-with-prefix"] = prefix,
                _b)), onClick: function (e) { return popupVisible && canFocusInput && e.stopPropagation(); } },
            prefix && (React.createElement("div", { "aria-hidden": "true", className: cs(prefixCls + "-prefix"), onMouseDown: function (event) { return focused && keepFocus(event); } }, prefix)),
            isMultiple ? renderMultiple() : renderSingle(),
            React.createElement("div", { "aria-hidden": "true", className: prefixCls + "-suffix", onMouseDown: function (event) { return focused && keepFocus(event); } },
                mergedClearIcon,
                mergedSuffixIcon))));
};
var SelectViewComponent = React.forwardRef(SelectView);
SelectViewComponent.displayName = 'SelectView';
export default SelectViewComponent;
