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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useContext, useEffect, useImperativeHandle, useMemo, useRef, useState, } from 'react';
import cs from '../_util/classNames';
import { ArrowUp, ArrowDown, Enter, Esc, Tab } from '../_util/keycode';
import Trigger from '../Trigger';
import OptGroup from './opt-group';
import Option from './option';
import ResizeObserver from '../_util/resizeObserver';
import { isArray, isFunction, isObject } from '../_util/is';
import getHotkeyHandler from '../_util/getHotkeyHandler';
import warning from '../_util/warning';
import SelectView from '../_class/select-view';
import VirtualList from '../_class/VirtualList';
import { preventDefaultEvent, isEmptyValue, getValidValue, isSelectOption, isSelectOptGroup, flatChildren, } from './utils';
import { ConfigContext } from '../ConfigProvider';
import useMergeValue from '../_util/hooks/useMergeValue';
import omit from '../_util/omit';
import useMergeProps from '../_util/hooks/useMergeProps';
// ??????????????????????????? onPaste ????????? onChange?????? onChange ??? value ?????????????????????
// ????????????????????????????????????????????? onChange ????????????????????????
var THRESHOLD_TOKEN_SEPARATOR_TRIGGER = 100;
// Generate DOM id for instance
var globalSelectIndex = 0;
var defaultProps = {
    trigger: 'click',
    bordered: true,
    filterOption: true,
    unmountOnExit: true,
    defaultActiveFirstOption: true,
};
function Select(baseProps, ref) {
    var _a = useContext(ConfigContext), getPrefixCls = _a.getPrefixCls, renderEmpty = _a.renderEmpty, componentConfig = _a.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Select);
    var children = props.children, renderFormat = props.renderFormat, defaultActiveFirstOption = props.defaultActiveFirstOption, disabled = props.disabled, unmountOnExit = props.unmountOnExit, notFoundContent = props.notFoundContent, showSearch = props.showSearch, tokenSeparators = props.tokenSeparators, options = props.options, filterOption = props.filterOption, labelInValue = props.labelInValue, getPopupContainer = props.getPopupContainer, trigger = props.trigger, triggerElement = props.triggerElement, triggerProps = props.triggerProps, dropdownRender = props.dropdownRender, dropdownMenuStyle = props.dropdownMenuStyle, dropdownMenuClassName = props.dropdownMenuClassName, virtualListProps = props.virtualListProps, 
    // events
    onChange = props.onChange, onDeselect = props.onDeselect, onClear = props.onClear, onSearch = props.onSearch, onFocus = props.onFocus, onBlur = props.onBlur, onPopupScroll = props.onPopupScroll, onVisibleChange = props.onVisibleChange, onInputValueChange = props.onInputValueChange, onPaste = props.onPaste;
    // TODO ???????????????3.0 ?????? tags ??????
    var mode = props.mode, allowCreate = props.allowCreate;
    if (mode === 'tags') {
        mode = 'multiple';
        allowCreate = true;
        warning(true, "[Arco Select] The 'tags' mode will be removed in the next major version, please use {mode: \"multiple\", allowCreate: true} instead.");
    }
    var prefixCls = getPrefixCls('select');
    var isMultipleMode = mode === 'multiple';
    // TODO: ?????? useMergeValue ???????????????
    var _b = __read(useState(getValidValue(props.defaultValue, isMultipleMode, labelInValue)), 2), stateValue = _b[0], setValue = _b[1];
    var value = 'value' in props ? getValidValue(props.value, isMultipleMode, labelInValue) : stateValue;
    var _c = __read(useMergeValue('', {
        value: 'inputValue' in props ? props.inputValue || '' : undefined,
    }), 3), inputValue = _c[0], setInputValue = _c[1], stateInputValue = _c[2];
    var _d = __read(useMergeValue(false, {
        defaultValue: props.defaultPopupVisible,
        value: 'popupVisible' in props
            ? props.popupVisible
            : triggerProps && 'popupVisible' in triggerProps
                ? triggerProps.popupVisible
                : undefined,
    }), 2), popupVisible = _d[0], setPopupVisible = _d[1];
    // allowCreate ????????????????????????????????????
    var _e = __read(useState(null), 2), userCreatingOption = _e[0], setUserCreatingOption = _e[1];
    // allowCreate ????????????????????????????????????????????????
    var _f = __read(useState([]), 2), userCreatedOptions = _f[0], setUserCreatedOptions = _f[1];
    // ????????????????????? hover ?????? option ??? value
    var _g = __read(useState(isArray(value) ? value[0] : value), 2), valueActive = _g[0], setValueActive = _g[1];
    // ????????????????????? flatChildren ?????????
    var _h = useMemo(function () {
        return flatChildren({ children: children, options: options, filterOption: filterOption }, {
            prefixCls: prefixCls,
            inputValue: inputValue,
            userCreatedOptions: userCreatedOptions,
            userCreatingOption: userCreatingOption,
        });
    }, [children, options, filterOption, inputValue, userCreatingOption, userCreatedOptions]), childrenList = _h.childrenList, optionInfoMap = _h.optionInfoMap, optionValueList = _h.optionValueList, optionIndexListForArrowKey = _h.optionIndexListForArrowKey, hasOptGroup = _h.hasOptGroup, hasComplexLabelInOptions = _h.hasComplexLabelInOptions;
    // ref
    var refWrapper = useRef(null);
    var refTrigger = useRef(null);
    var refSelectView = useRef(null);
    // ???????????? value ?????????????????????
    var refValueMap = useRef([]);
    // ??? none ??????????????????????????????????????????????????? onMouseEnter ??? onMouseLeave ??????
    var refKeyboardArrowDirection = useRef(null);
    // ?????? onInputValueChange ????????????
    var refOnInputChangeCallbackValue = useRef(inputValue);
    // ?????? onInputValueChange ???????????????
    var refOnInputChangeCallbackReason = useRef(null);
    // ???????????????????????????????????????
    var refTSLastSeparateTriggered = useRef(0);
    // Unique ID of this select instance
    var instancePopupID = useMemo(function () {
        var id = prefixCls + "-popup-" + globalSelectIndex;
        globalSelectIndex++;
        return id;
    }, []);
    var isNoOptionSelected = isEmptyValue(value, isMultipleMode);
    var valueActiveDefault = defaultActiveFirstOption
        ? optionValueList[optionIndexListForArrowKey[0]]
        : undefined;
    var scrollIntoView = function (optionValue) {
        var _a;
        var activeOption = optionInfoMap.get(optionValue);
        if (refWrapper.current && ((_a = activeOption === null || activeOption === void 0 ? void 0 : activeOption.child) === null || _a === void 0 ? void 0 : _a.props)) {
            refWrapper.current.scrollTo({ key: activeOption.child.props._key });
        }
    };
    // ???????????? inputValue????????? onInputValueChange
    var tryUpdateInputValue = function (value, reason) {
        if (value !== refOnInputChangeCallbackValue.current) {
            setInputValue(value);
            refOnInputChangeCallbackValue.current = value;
            refOnInputChangeCallbackReason.current = reason;
            onInputValueChange && onInputValueChange(value, reason);
        }
    };
    // ???????????? popupVisible????????? onVisibleChange
    var tryUpdatePopupVisible = function (value) {
        if (popupVisible !== value) {
            setPopupVisible(value);
            onVisibleChange && onVisibleChange(value);
            triggerProps && triggerProps.onVisibleChange && triggerProps.onVisibleChange(value);
        }
    };
    // ????????????????????? value ???????????????
    useEffect(function () {
        if (isMultipleMode) {
            if (!Array.isArray(value)) {
                setValue(value === undefined ? [] : [value]);
            }
        }
        else if (Array.isArray(value)) {
            setValue(value.length === 0 ? undefined : value[0]);
        }
    }, [isMultipleMode, value]);
    // ?????????????????????/??????????????????????????????
    useEffect(function () {
        if (popupVisible) {
            // ???????????? hover ?????? Option
            var firstValue = isArray(value) ? value[0] : value;
            var nextValueActive_1 = !isNoOptionSelected && optionInfoMap.has(firstValue) ? firstValue : valueActiveDefault;
            setValueActive(nextValueActive_1);
            // ???????????????????????????????????????scrollIntoView???????????????????????????????????????
            setTimeout(function () { return scrollIntoView(nextValueActive_1); });
        }
        else {
            tryUpdateInputValue('', 'optionListHide');
        }
    }, [popupVisible]);
    // ??????????????????Option??????????????????
    useEffect(function () {
        if (refKeyboardArrowDirection.current === 'up' ||
            refKeyboardArrowDirection.current === 'down') {
            scrollIntoView(valueActive);
            refKeyboardArrowDirection.current = 'none';
        }
    }, [valueActive]);
    // ??????????????????????????? active ????????????
    useEffect(function () {
        setValueActive(valueActiveDefault);
    }, [JSON.stringify(childrenList.map(function (child) { var _a; return (_a = child === null || child === void 0 ? void 0 : child.props) === null || _a === void 0 ? void 0 : _a.value; }))]);
    // ?????? refValueMap????????????????????????????????????
    useEffect(function () {
        refValueMap.current = refValueMap.current.filter(function (x) {
            return isMultipleMode
                ? isArray(value) && value.indexOf(x.value) > -1
                : x.value === value;
        });
    }, [value, isMultipleMode]);
    // allowCreate ??????value ??????????????????????????????
    useEffect(function () {
        // ?????????????????????????????? value ??????????????? tag?????? value ??????????????? valueTag ??????
        if (allowCreate && Array.isArray(value)) {
            var newUserCreatedOptions = value.filter(function (v) {
                var _a;
                var option = optionInfoMap.get(v) || ((_a = refValueMap.current.find(function (item) { return item.value === v; })) === null || _a === void 0 ? void 0 : _a.option);
                return !option || option._origin === 'userCreatingOption';
            });
            var validUserCreatedOptions = userCreatedOptions.filter(function (tag) { return value.indexOf(tag) !== -1; });
            var _userCreatedOptions = validUserCreatedOptions.concat(newUserCreatedOptions);
            if (_userCreatedOptions.toString() !== userCreatedOptions.toString()) {
                setUserCreatedOptions(_userCreatedOptions);
            }
        }
    }, [value]);
    // allowCreate ???????????????????????????????????????????????????
    useEffect(function () {
        if (allowCreate) {
            // ????????????????????????????????????????????????
            setUserCreatingOption(optionInfoMap.has(inputValue) ? null : inputValue);
        }
    }, [inputValue]);
    // ??? inputValue ???????????????????????? onSearch
    useEffect(function () {
        var reason = refOnInputChangeCallbackReason.current;
        if (stateInputValue === inputValue && (reason === 'manual' || reason === 'optionListHide')) {
            onSearch && onSearch(inputValue, reason);
        }
    }, [inputValue]);
    var getOptionInfoByValue = function (value) {
        var option = optionInfoMap.get(value);
        if (option) {
            var index = refValueMap.current.findIndex(function (item) { return item.value === value; });
            if (index > -1) {
                refValueMap.current.splice(index, 1, { value: value, option: option });
            }
            else {
                refValueMap.current.push({ value: value, option: option });
            }
            return option;
        }
        var item = refValueMap.current.find(function (x) { return x.value === value; });
        return item && item.option;
    };
    // ?????????????????????????????????????????? active option ??????
    var getValueActive = function (direction) {
        if (!optionIndexListForArrowKey.length) {
            return undefined;
        }
        if (valueActive === undefined || !optionInfoMap.has(valueActive)) {
            return optionValueList[optionIndexListForArrowKey[0]];
        }
        var activeOption = optionInfoMap.get(valueActive);
        var activeIndex = activeOption._index;
        var _index = optionIndexListForArrowKey.indexOf(activeIndex);
        var _length = optionIndexListForArrowKey.length;
        return optionValueList[optionIndexListForArrowKey[((direction === 'up' ? _index - 1 : _index + 1) + _length) % _length]];
    };
    // Object should be returned when labelInValue is true
    var getValueAndOptionForCallback = function (stateValue, isEmpty) {
        if (isEmpty === void 0) { isEmpty = isEmptyValue(stateValue, isMultipleMode); }
        var value = stateValue;
        var option = stateValue === undefined
            ? undefined
            : Array.isArray(stateValue)
                ? stateValue.map(getOptionInfoByValue)
                : getOptionInfoByValue(stateValue);
        if (labelInValue && !isEmpty) {
            var getOptionLabel_1 = function (optionValue, optionInfo) {
                var e_1, _a;
                if (optionInfo) {
                    return optionInfo.children;
                }
                // https://github.com/arco-design/arco-design/issues/442
                // Make sure parameter value has valid label if props.value is already set
                var propValue = 'value' in props ? props.value : 'defaultValue' in props ? props.defaultValue : null;
                // Multiple mode
                if (Array.isArray(propValue)) {
                    try {
                        for (var propValue_1 = __values(propValue), propValue_1_1 = propValue_1.next(); !propValue_1_1.done; propValue_1_1 = propValue_1.next()) {
                            var item = propValue_1_1.value;
                            if (isObject(item) && item.value === optionValue) {
                                return item.label;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (propValue_1_1 && !propValue_1_1.done && (_a = propValue_1.return)) _a.call(propValue_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                // Single mode
                else if (isObject(propValue) && propValue.value === optionValue) {
                    return propValue.label;
                }
            };
            if (Array.isArray(stateValue)) {
                value = stateValue.map(function (optionValue, index) { return ({
                    value: optionValue,
                    label: getOptionLabel_1(optionValue, option[index]),
                }); });
            }
            else {
                value = { value: stateValue, label: getOptionLabel_1(stateValue, option) };
            }
        }
        return { option: option, value: value };
    };
    var tryUpdateSelectValue = function (value) {
        setValue(value);
        if (onChange) {
            var paramsForCallback = getValueAndOptionForCallback(value);
            onChange(paramsForCallback.value, paramsForCallback.option);
        }
    };
    // ??????????????????????????????
    var checkOption = function (valueToAdd) {
        var option = optionInfoMap.get(valueToAdd);
        if (option) {
            var newValue = value.concat(valueToAdd);
            tryUpdateSelectValue(newValue);
        }
    };
    // ??????????????????????????????
    var uncheckOption = function (valueToRemove) {
        // ??????????????????????????????option?????????????????????????????????????????????????????????
        var newValue = value.filter(function (v) { return v !== valueToRemove; });
        tryUpdateSelectValue(newValue);
        if (onDeselect) {
            var paramsForCallback = getValueAndOptionForCallback(valueToRemove, false);
            onDeselect(paramsForCallback.value, paramsForCallback.option);
        }
    };
    var handleOptionClick = function (optionValue, disabled) {
        if (disabled) {
            return;
        }
        if (isMultipleMode) {
            value.indexOf(optionValue) === -1
                ? checkOption(optionValue)
                : uncheckOption(optionValue);
            // ?????????????????????????????????????????????
            if (!isObject(showSearch) || !showSearch.retainInputValueWhileSelect) {
                tryUpdateInputValue('', 'optionChecked');
            }
        }
        else {
            if (optionValue !== value) {
                tryUpdateSelectValue(optionValue);
            }
            setTimeout(function () {
                tryUpdatePopupVisible(false);
            });
        }
    };
    // ???????????????
    var hotkeyHandler = getHotkeyHandler(new Map([
        [Esc.code, function () { return tryUpdatePopupVisible(false); }],
        [
            Enter.code,
            function () {
                if (popupVisible) {
                    var option = optionInfoMap.get(valueActive);
                    option && handleOptionClick(valueActive, option.disabled);
                }
                else {
                    tryUpdatePopupVisible(true);
                }
            },
        ],
        [
            Tab.code,
            // ???tab????????????????????????????????????
            function () { return tryUpdatePopupVisible(false); },
        ],
        [
            ArrowUp.code,
            function () {
                if (popupVisible) {
                    refKeyboardArrowDirection.current = 'up';
                    setValueActive(getValueActive('up'));
                    return false;
                }
            },
        ],
        [
            ArrowDown.code,
            function () {
                if (popupVisible) {
                    refKeyboardArrowDirection.current = 'down';
                    setValueActive(getValueActive('down'));
                    return false;
                }
            },
        ],
    ]));
    var renderPopup = function () {
        var _a;
        // ???????????????????????? width ????????????????????????????????????????????????????????????????????????
        var needMeasureLongestItem = (triggerProps === null || triggerProps === void 0 ? void 0 : triggerProps.autoAlignPopupWidth) === false;
        // Option ????????????????????????????????????????????????????????????????????????????????????????????????
        var needForbidVirtual = needMeasureLongestItem && hasComplexLabelInOptions;
        var mergedNotFoundContent = 'notFoundContent' in props ? notFoundContent : renderEmpty('Select');
        // ??????????????????
        var eleOptionList = childrenList.length ? (React.createElement(VirtualList, __assign({ id: instancePopupID, role: "listbox", style: dropdownMenuStyle, className: cs(prefixCls + "-popup-inner", dropdownMenuClassName), ref: refWrapper, data: childrenList, height: null, isStaticItemHeight: !hasOptGroup, measureLongestItem: needMeasureLongestItem, itemKey: function (child) { return child.props._key; }, onMouseDown: preventDefaultEvent, onMouseMove: function () {
                refKeyboardArrowDirection.current = null;
            }, onScroll: function (e) { return onPopupScroll && onPopupScroll(e.target); } }, virtualListProps, { threshold: needForbidVirtual ? null : virtualListProps === null || virtualListProps === void 0 ? void 0 : virtualListProps.threshold }), function (child) {
            if (isSelectOptGroup(child)) {
                return React.createElement(child.type, __assign({}, child.props, { prefixCls: prefixCls }));
            }
            if (isSelectOption(child)) {
                var optionProps = {
                    prefixCls: prefixCls,
                    _valueActive: valueActive,
                    _valueSelect: value,
                    _isMultipleMode: isMultipleMode,
                    _onClick: handleOptionClick,
                    _onMouseEnter: function (value) {
                        refKeyboardArrowDirection.current === null && setValueActive(value);
                    },
                    _onMouseLeave: function () {
                        refKeyboardArrowDirection.current === null && setValueActive(undefined);
                    },
                };
                return child && React.createElement(child.type, __assign({}, child.props, optionProps));
            }
            return child;
        })) : null;
        // ??????????????????????????????
        var eleNoOptionPlaceholder = mergedNotFoundContent ? (React.createElement("div", { style: dropdownMenuStyle, className: cs(prefixCls + "-popup-inner", dropdownMenuClassName) }, mergedNotFoundContent)) : null;
        return (React.createElement("div", { className: cs(prefixCls + "-popup", (_a = {},
                _a[prefixCls + "-popup-hidden"] = eleOptionList === null && eleNoOptionPlaceholder === null,
                _a[prefixCls + "-popup-multiple"] = isMultipleMode,
                _a)) }, typeof dropdownRender === 'function'
            ? dropdownRender(eleOptionList || eleNoOptionPlaceholder)
            : eleOptionList || eleNoOptionPlaceholder));
    };
    var handleTokenSeparators = function (str) {
        var hasSeparator = false;
        if (isMultipleMode && isArray(tokenSeparators) && tokenSeparators.length) {
            var rawValues_1 = str.split(new RegExp("[" + tokenSeparators.join('') + "]"));
            // ???????????????????????????
            if (rawValues_1.length > 1) {
                var splitValues = rawValues_1.filter(function (v, index) { return v && rawValues_1.indexOf(v) === index; });
                var newValue_1 = value.slice(0);
                var needUpdate_1 = false;
                splitValues.forEach(function (v) {
                    if (newValue_1.indexOf(v) === -1 && (allowCreate || optionInfoMap.get(v))) {
                        newValue_1.push(v);
                        needUpdate_1 = true;
                    }
                });
                if (needUpdate_1) {
                    tryUpdateSelectValue(newValue_1);
                }
                hasSeparator = true;
            }
        }
        return hasSeparator;
    };
    // SelectView??????????????????
    var selectViewEventHandlers = {
        onFocus: onFocus,
        onBlur: function (event) {
            onBlur && onBlur(event);
            // ??????????????????????????????????????????????????????????????????
            !popupVisible && tryUpdateInputValue('', 'optionListHide');
        },
        onKeyDown: function (event) {
            // ????????????????????????????????????
            if (event.target.tagName === 'INPUT' && event.target.value) {
                var isTab = event.key === Tab.key;
                var isEnter = event.key === Enter.key;
                if (isEnter || isTab) {
                    var suffix = isEnter ? '\n' : isTab ? '\t' : '';
                    if (handleTokenSeparators(event.target.value + suffix)) {
                        refTSLastSeparateTriggered.current = Date.now();
                        // ????????????????????? onChangeInputValue ?????????????????????????????????????????????
                        tryUpdateInputValue('', 'tokenSeparator');
                    }
                }
            }
            // ???????????????
            hotkeyHandler(event);
        },
        onChangeInputValue: function (value, _a) {
            var inputType = _a.nativeEvent.inputType;
            if ((inputType === 'insertFromPaste' &&
                Date.now() - refTSLastSeparateTriggered.current < THRESHOLD_TOKEN_SEPARATOR_TRIGGER) ||
                handleTokenSeparators(value)) {
                tryUpdateInputValue('', 'tokenSeparator');
            }
            else {
                tryUpdateInputValue(value, 'manual');
            }
            if (!popupVisible && value) {
                tryUpdatePopupVisible(true);
            }
        },
        onPaste: function (e) {
            if (handleTokenSeparators(e.clipboardData.getData('text'))) {
                refTSLastSeparateTriggered.current = Date.now();
            }
            onPaste && onPaste(e);
        },
        // Option Items
        onRemoveCheckedItem: function (_, index, event) {
            event.stopPropagation();
            uncheckOption(value[index]);
        },
        onClear: function (event) {
            event.stopPropagation();
            if (isMultipleMode) {
                // ???????????????????????????disabled????????????
                var newValue = value.filter(function (v) {
                    var item = optionInfoMap.get(v);
                    return item && item.disabled;
                });
                tryUpdateSelectValue(newValue);
            }
            else {
                tryUpdateSelectValue(undefined);
            }
            tryUpdateInputValue('', 'manual');
            onClear && onClear(popupVisible);
        },
    };
    useImperativeHandle(ref, function () {
        var _a;
        return ({
            dom: (_a = refSelectView.current) === null || _a === void 0 ? void 0 : _a.dom,
            focus: function () {
                refSelectView.current && refSelectView.current.focus();
            },
            blur: function () {
                refSelectView.current && refSelectView.current.blur();
            },
            hotkeyHandler: hotkeyHandler,
            activeOptionValue: valueActive,
            getOptionInfoByValue: getOptionInfoByValue,
            getOptionInfoList: function () { return __spreadArray([], __read(optionInfoMap.values()), false).filter(function (info) { return info._valid; }); },
        });
    }, [hotkeyHandler, optionInfoMap, valueActive]);
    return (React.createElement(ResizeObserver, { onResize: function () { return refTrigger.current.updatePopupPosition(); } },
        React.createElement(Trigger, __assign({ ref: function (ref) { return (refTrigger.current = ref); }, popup: renderPopup, trigger: trigger, disabled: disabled, getPopupContainer: getPopupContainer, classNames: "slideDynamicOrigin", autoAlignPopupWidth: true, popupAlign: { bottom: 4 }, popupVisible: popupVisible, unmountOnExit: unmountOnExit, onVisibleChange: tryUpdatePopupVisible }, omit(triggerProps, ['popupVisible', 'onVisibleChange'])), typeof triggerElement === 'function'
            ? (function () { return triggerElement(getValueAndOptionForCallback(value)); })()
            : triggerElement || (React.createElement(SelectView, __assign({}, props, selectViewEventHandlers, { ref: refSelectView, 
                // state
                value: value, inputValue: inputValue, popupVisible: popupVisible, 
                // other
                prefixCls: prefixCls, ariaControls: instancePopupID, isEmptyValue: isNoOptionSelected, isMultiple: isMultipleMode, onSort: tryUpdateSelectValue, renderText: function (value) {
                    var option = getOptionInfoByValue(value);
                    var text = value;
                    if (isFunction(renderFormat)) {
                        var paramsForCallback = getValueAndOptionForCallback(value, false);
                        text = renderFormat(paramsForCallback.option || null, paramsForCallback.value);
                    }
                    else {
                        var foundLabelFromProps = false;
                        if (labelInValue) {
                            var propValue = props.value || props.defaultValue;
                            if (Array.isArray(propValue)) {
                                var targetLabeledValue = propValue.find(function (item) { return isObject(item) && item.value === value; });
                                if (targetLabeledValue) {
                                    text = targetLabeledValue.label;
                                    foundLabelFromProps = true;
                                }
                            }
                            else if (isObject(propValue)) {
                                text = propValue.label;
                                foundLabelFromProps = true;
                            }
                        }
                        if (!foundLabelFromProps && option && 'children' in option) {
                            text = option.children;
                        }
                    }
                    return {
                        text: text,
                        disabled: option && option.disabled,
                    };
                } }))))));
}
var ForwardRefSelect = React.forwardRef(Select);
var SelectComponent = ForwardRefSelect;
SelectComponent.displayName = 'Select';
SelectComponent.Option = Option;
SelectComponent.OptGroup = OptGroup;
export default SelectComponent;
