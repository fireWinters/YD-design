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
import React, { forwardRef, useEffect, useState, useImperativeHandle, useRef, useContext, useCallback, useMemo, } from 'react';
import { isArray, isFunction, isObject, isString } from '../_util/is';
import Trigger from '../Trigger';
import CascaderPanel from './panel/list';
import SearchPanel from './panel/search-panel';
import { ConfigContext } from '../ConfigProvider';
import SelectView from '../_class/select-view';
import cs from '../_util/classNames';
import useMergeValue from '../_util/hooks/useMergeValue';
import useUpdate from '../_util/hooks/useUpdate';
import { Enter, Tab } from '../_util/keycode';
import useCurrentRef from './hook/useRefCurrent';
import useMergeProps from '../_util/hooks/useMergeProps';
import { valueInSet, transformValuesToSet, isEmptyValue, getConfig, getStore, formatValue, removeValueFromSet, SHOW_CHILD, } from './util';
import useForceUpdate from '../_util/hooks/useForceUpdate';
// Generate DOM id for instance
var globalCascaderIndex = 0;
export var DefaultFieldNames = {
    label: 'label',
    value: 'value',
    isLeaf: 'isLeaf',
    children: 'children',
    disabled: 'disabled',
};
var defaultProps = {
    options: [],
    bordered: true,
    fieldNames: DefaultFieldNames,
    trigger: 'click',
    expandTrigger: 'click',
    checkedStrategy: SHOW_CHILD,
};
function Cascader(baseProps, ref) {
    var _a = useContext(ConfigContext), getPrefixCls = _a.getPrefixCls, renderEmpty = _a.renderEmpty, componentConfig = _a.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Cascader);
    var disabled = props.disabled, renderFormat = props.renderFormat, getPopupContainer = props.getPopupContainer, children = props.children, triggerProps = props.triggerProps, expandTrigger = props.expandTrigger;
    var prefixCls = getPrefixCls('cascader');
    var isMultiple = props.mode === 'multiple';
    var timerRef = useRef(null);
    var forceUpdate = useForceUpdate();
    var store = useCurrentRef(function () {
        return getStore(props, formatValue('value' in props ? props.value : props.defaultValue, isMultiple));
    }, [JSON.stringify(getConfig(props)), props.options]);
    var _b = __read(useState(function () {
        return 'value' in props
            ? formatValue(props.value, isMultiple, store)
            : 'defaultValue' in props
                ? formatValue(props.defaultValue, isMultiple, store)
                : [];
    }), 2), stateValue = _b[0], setValue = _b[1];
    var mergeValue = 'value' in props ? formatValue(props.value, isMultiple, store) : stateValue;
    var _c = __read(useMergeValue(false, {
        value: props.popupVisible,
        defaultValue: props.defaultPopupVisible,
    }), 2), popupVisible = _c[0], setPopupVisible = _c[1];
    var _d = __read(useMergeValue('', {
        value: 'inputValue' in props ? props.inputValue || '' : undefined,
    }), 3), inputValue = _d[0], setInputValue = _d[1], stateInputValue = _d[2];
    // ?????? onInputValueChange ????????????
    var refOnInputChangeCallbackValue = useRef(inputValue);
    // ?????? onInputValueChange ???????????????
    var refOnInputChangeCallbackReason = useRef(null);
    var selectRef = useRef(null);
    // ?????????????????????????????????????????????onSearch???????????????
    // ????????????????????????????????????????????????option???????????????????????????????????????????????????
    var stashNodes = useRef((store === null || store === void 0 ? void 0 : store.getCheckedNodes()) || []);
    // Unique ID of this select instance
    var instancePopupID = useMemo(function () {
        var id = prefixCls + "-popup-" + globalCascaderIndex;
        globalCascaderIndex++;
        return id;
    }, []);
    // ???????????? inputValue????????? onInputValueChange
    var tryUpdateInputValue = function (value, reason) {
        if (value !== refOnInputChangeCallbackValue.current) {
            setInputValue(value);
            refOnInputChangeCallbackValue.current = value;
            refOnInputChangeCallbackReason.current = reason;
            props.onInputValueChange && props.onInputValueChange(value, reason);
        }
    };
    // ??? inputValue ???????????????????????? onSearch
    useEffect(function () {
        var reason = refOnInputChangeCallbackReason.current;
        if (stateInputValue === inputValue && (reason === 'manual' || reason === 'optionListHide')) {
            props.onSearch && props.onSearch(inputValue, reason);
        }
    }, [inputValue]);
    useEffect(function () {
        var clearTimer = function () {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        };
        if (!popupVisible && inputValue) {
            if (timerRef.current) {
                clearTimer();
            }
            timerRef.current = setTimeout(function () {
                tryUpdateInputValue('', 'optionListHide');
                timerRef.current = null;
            }, 200);
        }
        return function () {
            clearTimer();
        };
    }, [popupVisible]);
    useUpdate(function () {
        if ('value' in props && props.value !== stateValue) {
            // don't to use formatValue(x, y, store)
            // we just need to get the value in a valid format, and update it to store nodes
            var newValue = formatValue(props.value, isMultiple);
            store.setNodeCheckedByValue(newValue);
            setValue(newValue);
        }
    }, [props.value, isMultiple]);
    useImperativeHandle(ref, function () { return selectRef.current; }, []);
    var updateStashNodes = function (nodes) {
        stashNodes.current = Array.from(new Set([].concat(nodes, stashNodes.current)));
    };
    var getSelectedOptionsByValue = function (values) {
        var result = [];
        var valuesSet = transformValuesToSet(values);
        var findValue = function (nodes) {
            nodes.some(function (node) {
                if (valueInSet(valuesSet, node.pathValue)) {
                    result.push(node.getPathNodes().map(function (x) { return x._data; }));
                    removeValueFromSet(valuesSet, node.pathValue);
                }
                if (!valuesSet.size) {
                    return true;
                }
            });
        };
        findValue(store.getCheckedNodes());
        if (valuesSet.size) {
            findValue(stashNodes.current);
        }
        return result;
    };
    var handleVisibleChange = useCallback(function (newVisible) {
        if (newVisible !== popupVisible) {
            props.onVisibleChange && props.onVisibleChange(newVisible);
            if (!('popupVisible' in props)) {
                setPopupVisible(newVisible);
            }
        }
    }, [props.onVisibleChange, popupVisible]);
    var renderText = useCallback(function (value) {
        var _a;
        // store ?????????????????????stashNodes.current????????????????????????
        var options = getSelectedOptionsByValue([value])[0] || [];
        var text;
        var valueShow = isArray(value) ? value.map(function (x) { return String(x); }) : [];
        if (options.length) {
            valueShow = options.map(function (x) { return x.label; });
        }
        if (isFunction(renderFormat)) {
            text = renderFormat(valueShow);
        }
        else if (valueShow.every(function (v) { return isString(v); })) {
            text = valueShow.join(' / ');
        }
        else {
            text = valueShow.reduce(function (total, item, index) {
                return total.concat(index === 0 ? [item] : [' / ', item]);
            }, []);
        }
        return {
            text: text || '',
            disabled: (_a = options[options.length - 1]) === null || _a === void 0 ? void 0 : _a.disabled,
        };
    }, [store, renderFormat]);
    var handleChange = function (newValue, trigger) {
        var _a;
        if (trigger === 'panel' &&
            isObject(props.showSearch) &&
            !props.showSearch.retainInputValueWhileSelect &&
            isMultiple) {
            tryUpdateInputValue('', 'optionChecked');
        }
        var onChange = props.onChange, changeOnSelect = props.changeOnSelect, expandTrigger = props.expandTrigger;
        var isSame = mergeValue === newValue;
        if (isSame) {
            return;
        }
        if (!isMultiple) {
            store.setNodeCheckedByValue(newValue);
        }
        updateStashNodes(store.getCheckedNodes());
        var selectedOptions = getSelectedOptionsByValue(newValue);
        var _value = isMultiple ? newValue : newValue[0];
        var _selectedOptions = isMultiple ? selectedOptions : selectedOptions[0];
        if (!isMultiple) {
            if (inputValue) {
                // ?????????????????????????????????????????????
                handleVisibleChange(false);
            }
            else if ((selectedOptions[0] && ((_a = selectedOptions[0][selectedOptions[0].length - 1]) === null || _a === void 0 ? void 0 : _a.isLeaf)) ||
                (changeOnSelect && expandTrigger === 'hover')) {
                handleVisibleChange(false);
            }
        }
        if ('value' in props) {
            store.setNodeCheckedByValue(mergeValue);
            // ????????????????????????????????????????????????
            forceUpdate();
        }
        else {
            setValue(newValue);
        }
        onChange &&
            onChange(_value, _selectedOptions, {
                dropdownVisible: popupVisible,
            });
    };
    var onRemoveCheckedItem = function (item, index, e) {
        e.stopPropagation();
        if (item.disabled) {
            return;
        }
        var newValue = mergeValue.filter(function (_, i) { return i !== index; });
        store.setNodeCheckedByValue(newValue);
        handleChange(newValue);
    };
    var renderEmptyEle = function (width) {
        var wd = width || (selectRef.current && selectRef.current.getWidth());
        return (React.createElement("div", { className: prefixCls + "-list-empty", style: { width: wd } }, props.notFoundContent || renderEmpty('Cascader')));
    };
    var renderPopup = function () {
        var _a;
        var showSearchPanel = !isFunction(props.onSearch) && !!inputValue;
        var width = selectRef.current && selectRef.current.getWidth();
        var dropdownRender = isFunction(props.dropdownRender) ? props.dropdownRender : function (menu) { return menu; };
        return (React.createElement("div", { id: instancePopupID, className: cs(prefixCls + "-popup", props.dropdownMenuClassName, (_a = {},
                _a[prefixCls + "-popup-trigger-hover"] = props.expandTrigger === 'hover',
                _a)) }, dropdownRender(React.createElement("div", { className: prefixCls + "-popup-inner", onMouseDown: function (e) { return e.preventDefault(); } }, showSearchPanel ? (React.createElement(SearchPanel, { style: { minWidth: width }, store: store, inputValue: inputValue, renderEmpty: function () { return renderEmptyEle(width); }, multiple: isMultiple, onChange: function (value) {
                handleChange(value, 'panel');
            }, prefixCls: prefixCls, onEsc: function () {
                handleVisibleChange(false);
            }, value: mergeValue, virtualListProps: props.virtualListProps })) : (React.createElement(CascaderPanel, { dropdownMenuColumnStyle: props.dropdownMenuColumnStyle, virtualListProps: props.virtualListProps, expandTrigger: expandTrigger, store: store, dropdownColumnRender: props.dropdownColumnRender, renderOption: props.renderOption, changeOnSelect: props.changeOnSelect, showEmptyChildren: props.showEmptyChildren || !!props.loadMore, multiple: isMultiple, onChange: function (value) {
                handleChange(value, 'panel');
            }, loadMore: props.loadMore, prefixCls: prefixCls, renderEmpty: renderEmptyEle, popupVisible: popupVisible, value: mergeValue, renderFooter: props.renderFooter, onEsc: function () {
                handleVisibleChange(false);
            }, onDoubleClickOption: function () {
                if (props.changeOnSelect && !isMultiple) {
                    handleVisibleChange(false);
                }
            } }))))));
    };
    return (React.createElement(Trigger, __assign({ popup: renderPopup, trigger: props.trigger, disabled: disabled, getPopupContainer: getPopupContainer, position: "bl", classNames: "slideDynamicOrigin", popupAlign: { bottom: 4 }, 
        // ??????????????????unmountOnExit ?????????false???
        unmountOnExit: 'unmountOnExit' in props ? props.unmountOnExit : !isFunction(props.loadMore), popupVisible: popupVisible }, triggerProps, { onVisibleChange: handleVisibleChange }), children || (React.createElement(SelectView, __assign({}, props, { ref: selectRef, ariaControls: instancePopupID, popupVisible: popupVisible, value: isMultiple ? mergeValue : mergeValue && mergeValue[0], inputValue: inputValue, 
        // other
        isEmptyValue: isEmptyValue(mergeValue), prefixCls: prefixCls, isMultiple: isMultiple, renderText: renderText, onRemoveCheckedItem: onRemoveCheckedItem, onClear: function (e) {
            e.stopPropagation();
            if (!isMultiple) {
                handleChange([]);
            }
            else {
                var nodes = store.getCheckedNodes();
                var newValue = nodes.filter(function (x) { return x.disabled; }).map(function (x) { return x.pathValue; });
                store.setNodeCheckedByValue(newValue);
                handleChange(newValue);
            }
            props.onClear && props.onClear(!!popupVisible);
        }, onKeyDown: function (e) {
            if (disabled) {
                return;
            }
            e.stopPropagation();
            var keyCode = e.keyCode || e.which;
            if (keyCode === Enter.code && !popupVisible) {
                handleVisibleChange(true);
                e.preventDefault();
            }
            if (keyCode === Tab.code && popupVisible) {
                handleVisibleChange(false);
            }
        }, 
        // onFocus={this.onFocusInput}
        onChangeInputValue: function (v) {
            tryUpdateInputValue(v, 'manual');
            // tab??? focus ???????????????????????????????????????????????????????????????????????????
            if (!popupVisible) {
                handleVisibleChange(true);
            }
        } })))));
}
var CascaderComponent = forwardRef(Cascader);
CascaderComponent.displayName = 'Cascader';
export default CascaderComponent;
