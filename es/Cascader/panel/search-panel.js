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
import React, { useEffect, useState, useRef } from 'react';
import isEqualWith from 'lodash/isEqualWith';
import scrollIntoView from 'scroll-into-view-if-needed';
import cs from '../../_util/classNames';
import IconCheck from '../../../icon/react-icon/IconCheck';
import Checkbox from '../../Checkbox';
import { ArrowDown, Esc, Enter, ArrowUp } from '../../_util/keycode';
import useUpdateEffect from '../../_util/hooks/useUpdate';
import useIsFirstRender from '../../_util/hooks/useIsFirstRender';
import { isString, isObject } from '../../_util/is';
import { getMultipleCheckValue } from '../util';
import VirtualList from '../../_class/VirtualList';
export var getLegalIndex = function (currentIndex, maxIndex) {
    if (currentIndex < 0) {
        return maxIndex;
    }
    if (currentIndex > maxIndex) {
        return 0;
    }
    return currentIndex;
};
var formatLabel = function (inputValue, label, prefixCls) {
    var dom = label;
    if (isString(label)) {
        var index = label.toUpperCase().indexOf(inputValue.toUpperCase());
        if (index > -1) {
            var prefix = label.substr(0, index);
            var suffix = label.substr(index + inputValue.length);
            dom = (React.createElement(React.Fragment, null,
                prefix,
                React.createElement("span", { className: prefixCls + "-highlight" }, label.substr(index, inputValue.length)),
                suffix));
        }
    }
    return dom;
};
var SearchPanel = function (props) {
    var _a;
    var store = props.store, prefixCls = props.prefixCls, multiple = props.multiple, onChange = props.onChange, inputValue = props.inputValue, renderEmpty = props.renderEmpty, style = props.style;
    var value = props.value || [];
    var _b = __read(useState(store.searchNodeByLabel(inputValue) || []), 2), options = _b[0], setOptions = _b[1];
    var refActiveItem = useRef();
    // ????????????????????????scrollIntoView??????????????????hover?????????????????????
    var isKeyboardHover = useRef();
    var isFirstRender = useIsFirstRender();
    // ?????????????????????????????????
    var _c = __read(useState(-1), 2), currentHoverIndex = _c[0], setCurrentHoverIndex = _c[1];
    var handleSearchOptionClick = function (option, checked, e) {
        e.stopPropagation();
        if (option.disabled) {
            return;
        }
        if (multiple) {
            var checkedValues = getMultipleCheckValue(props.value, store, option, checked);
            onChange && onChange(checkedValues);
        }
        else {
            onChange && onChange([option.pathValue]);
        }
    };
    useUpdateEffect(function () {
        setOptions(store.searchNodeByLabel(inputValue));
    }, [inputValue]);
    useUpdateEffect(function () {
        setCurrentHoverIndex(function (currentIndex) {
            if (currentIndex > options.length - 1) {
                return -1;
            }
            return currentIndex;
        });
    }, [options]);
    useEffect(function () {
        var handleKeyDown = function (e) {
            e.stopPropagation();
            // ??????keycode??????????????????????????????????????????enter,space????????????
            // p.s ??????????????????keycode ??????229
            var keyCode = e.keyCode || e.which;
            switch (keyCode) {
                case Esc.code: {
                    props.onEsc();
                    return false;
                }
                case ArrowDown.code:
                case ArrowUp.code: {
                    isKeyboardHover.current = true;
                    var diff = ArrowDown.code === keyCode ? 1 : -1;
                    var nextIndex = getLegalIndex(currentHoverIndex + diff, options.length - 1);
                    while (nextIndex !== currentHoverIndex) {
                        var item_1 = options[nextIndex];
                        if (item_1.disabled) {
                            nextIndex = getLegalIndex(nextIndex + diff, options.length - 1);
                        }
                        else {
                            break;
                        }
                    }
                    setCurrentHoverIndex(nextIndex);
                    return false;
                }
                case Enter.code:
                    var item_2 = options[currentHoverIndex];
                    if (item_2) {
                        var isChecked = value.some(function (x) {
                            return isEqualWith(x, item_2.pathValue);
                        });
                        handleSearchOptionClick(item_2, !isChecked, e);
                    }
                    return false;
                default:
                    break;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return function () {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [options, currentHoverIndex, value]);
    useEffect(function () {
        var _a;
        var target = refActiveItem.current;
        if (target && (isKeyboardHover.current || isFirstRender)) {
            scrollIntoView(target, {
                behavior: 'instant',
                block: 'nearest',
                scrollMode: 'if-needed',
                boundary: (_a = target.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode,
            });
        }
    }, [currentHoverIndex, options]);
    refActiveItem.current = null;
    return options.length ? (React.createElement("div", { className: prefixCls + "-list-wrapper" },
        React.createElement(VirtualList, __assign({ needFiller: false, wrapper: "ul", role: "menu", style: style, data: options, isStaticItemHeight: true, itemKey: "value", threshold: props.virtualListProps ? 100 : null }, (isObject(props.virtualListProps) ? props.virtualListProps : {}), { onMouseMove: function () {
                isKeyboardHover.current = false;
            }, className: cs(prefixCls + "-list", prefixCls + "-list-search", (_a = {},
                _a[prefixCls + "-list-multiple"] = multiple,
                _a)) }), function (item, i) {
            var _a;
            var pathNodes = item.getPathNodes();
            var label = formatLabel(inputValue, pathNodes.map(function (x) { return x.label; }).join(' / '), prefixCls);
            var isChecked = item._checked;
            return (React.createElement("li", { role: "menuitem", "aria-disabled": item.disabled, ref: function (node) {
                    if (i === currentHoverIndex) {
                        refActiveItem.current = node;
                    }
                    if (isChecked && !refActiveItem.current) {
                        refActiveItem.current = node;
                    }
                }, className: cs(prefixCls + "-list-search-item", (_a = {},
                    _a[prefixCls + "-list-search-item-active"] = isChecked,
                    _a[prefixCls + "-list-search-item-hover"] = i === currentHoverIndex,
                    _a[prefixCls + "-list-search-item-disabled"] = item.disabled,
                    _a)), onClick: function (e) {
                    handleSearchOptionClick(item, !isChecked, e);
                }, key: i, onMouseEnter: function () {
                    if (!isKeyboardHover.current && !item.disabled) {
                        setCurrentHoverIndex(i);
                    }
                }, onMouseLeave: function () {
                    if (!isKeyboardHover.current && !item.disabled) {
                        setCurrentHoverIndex(-1);
                    }
                } },
                React.createElement("div", { className: prefixCls + "-list-item-label" }, multiple ? (React.createElement(Checkbox, { checked: isChecked, disabled: item.disabled }, label)) : (React.createElement(React.Fragment, null,
                    label,
                    isChecked && (React.createElement("span", { className: prefixCls + "-check-icon" },
                        React.createElement(IconCheck, null))))))));
        }))) : (React.createElement(React.Fragment, null, renderEmpty && renderEmpty()));
};
export default SearchPanel;
