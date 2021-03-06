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
import React, { useContext, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { isNumber, isObject } from '../../_util/is';
import ResizeObserver from '../../_util/resizeObserver';
import DropdownIcon from './dropdown-icon';
import TabNavIcon from './tab-nav-icon';
import TabHeaderTitle from './tab-title';
import IconPlus from '../../../icon/react-icon/IconPlus';
import cs from '../../_util/classNames';
import { setTransformStyle } from '../../_util/style';
import { getKeyDownEvent, getRectDiff, updateScrollOffset } from '../utils';
import { TabsContext } from '../tabs';
import TabInk from './tab-ink';
import IconHover from '../../_class/icon-hover';
import useDomSize from '../hook/useDomSize';
import throttleByRaf from '../../_util/throttleByRaf';
import useHeaderScroll from '../hook/useHeaderScroll';
var DIRECTION_VERTICAL = 'vertical';
var ALIGN_RIGHT = 'right';
var ALIGN_LEFT = 'left';
var SCROLL_MAP = {
    delete: true,
    add: true,
};
var getHeaderStyle = function (_a) {
    var direction = _a.direction, _b = _a.align, align = _b === void 0 ? ALIGN_LEFT : _b, headerOffset = _a.headerOffset;
    var value = "translateX(" + -headerOffset + "px)";
    if (align === ALIGN_RIGHT) {
        value = "translateX(" + headerOffset + "px)";
    }
    if (direction === DIRECTION_VERTICAL) {
        value = "translateY(" + -headerOffset + "px)";
    }
    return setTransformStyle(value);
};
var getCurrentHeaderOffset = function (_a) {
    var direction = _a.direction, _b = _a.align, align = _b === void 0 ? ALIGN_LEFT : _b, headerDom = _a.headerDom, headerWrapperDom = _a.headerWrapperDom;
    var diffStyle = getRectDiff(headerDom, headerWrapperDom);
    if (direction === DIRECTION_VERTICAL)
        return -diffStyle.top;
    if (align === ALIGN_RIGHT)
        return diffStyle.right;
    return -diffStyle.left;
};
var TabHeader = React.forwardRef(function (props, ref) {
    var _a, _b;
    var ctxProps = useContext(TabsContext);
    var mergeProps = __assign(__assign({}, props), ctxProps);
    var _c = __read(useDomSize(), 3), headerWrapperRef = _c[0], headerWrapperSize = _c[1], setHeaderWrapperSize = _c[2];
    var _d = __read(useDomSize(), 3), headerRef = _d[0], headerSize = _d[1], setHeaderSize = _d[2];
    var _e = __read(useDomSize(), 3), scrollWrapperRef = _e[0], scrollWrapperSize = _e[1], setScrollWrapperSize = _e[2];
    var titleRef = useRef({});
    var _f = __read(useState(0), 2), headerOffset = _f[0], setHeaderOffset = _f[1];
    var _g = __read(useState(true), 2), shouldScroll = _g[0], setShouldScroll = _g[1];
    var paneChildren = mergeProps.paneChildren, editable = mergeProps.editable, prefixCls = mergeProps.prefixCls, onAddTab = mergeProps.onAddTab, direction = mergeProps.direction, _h = mergeProps.type, type = _h === void 0 ? 'line' : _h, _j = mergeProps.overflow, overflow = _j === void 0 ? 'scroll' : _j, activeTab = mergeProps.activeTab, showAddButton = mergeProps.showAddButton, _k = mergeProps.size, size = _k === void 0 ? 'default' : _k, style = mergeProps.style, tabPosition = mergeProps.tabPosition, className = mergeProps.className, extra = mergeProps.extra, animation = mergeProps.animation, icons = mergeProps.icons, deleteButton = mergeProps.deleteButton, addButton = mergeProps.addButton, renderTabTitle = mergeProps.renderTabTitle, scrollAfterEdit = mergeProps.scrollAfterEdit, _l = mergeProps.scrollPosition, scrollPosition = _l === void 0 ? 'auto' : _l;
    var scrollConfig = isObject(scrollAfterEdit)
        ? __assign(__assign({}, SCROLL_MAP), scrollAfterEdit) : SCROLL_MAP;
    var align = type === 'capsule' ? ALIGN_RIGHT : ALIGN_LEFT;
    var isScrollable = useMemo(function () {
        var res = mergeProps.direction === 'vertical'
            ? scrollWrapperSize.height < headerSize.height
            : scrollWrapperSize.width < headerSize.width;
        return res;
    }, [mergeProps.direction, scrollWrapperSize, headerSize]);
    var updateScrollWrapperSize = function () {
        if (scrollWrapperRef.current) {
            var dom = scrollWrapperRef.current;
            setScrollWrapperSize({
                height: dom.offsetHeight,
                width: dom.offsetWidth,
            });
        }
    };
    var onWrapperResize = throttleByRaf(function (entry) {
        updateScrollWrapperSize();
        var dom = entry[0] && entry[0].target;
        if (dom) {
            setHeaderWrapperSize({
                height: dom.offsetHeight,
                width: dom.offsetWidth,
                domRect: dom.getBoundingClientRect(),
            });
        }
    });
    var onHeaderResize = throttleByRaf(function (entry) {
        var dom = entry[0] && entry[0].target;
        if (dom) {
            setHeaderSize({
                height: dom.offsetHeight,
                width: dom.offsetWidth,
                domRect: dom.getBoundingClientRect(),
            });
        }
    });
    var getValidOffset = useCallback(function (offset) {
        var maxOffset = direction === DIRECTION_VERTICAL
            ? headerSize.height - headerWrapperSize.height
            : headerSize.width - headerWrapperSize.width;
        var validOffset = offset;
        validOffset = Math.min(maxOffset, validOffset);
        validOffset = Math.max(validOffset, 0);
        return validOffset;
    }, [direction, headerSize, headerWrapperSize]);
    var updateHeaderOffset = function (offset) {
        var nextOffset = getValidOffset(offset);
        if (nextOffset !== headerOffset) {
            setHeaderOffset(nextOffset);
        }
    };
    useEffect(function () {
        return function () {
            onHeaderResize.cancel && onHeaderResize.cancel();
            onWrapperResize.cancel && onWrapperResize.cancel();
        };
    }, []);
    // ??????????????? tab ?????? headerOffset?????????????????????????????? headerOffset
    useEffect(function () {
        if (!shouldScroll) {
            setShouldScroll(true);
            return;
        }
        var getActiveTabOffset = function () {
            var currentTitleNode = titleRef.current[activeTab];
            if (!currentTitleNode || !isScrollable) {
                return 0;
            }
            var diffStyle = getRectDiff(currentTitleNode, headerWrapperRef.current);
            var currentOffset = getCurrentHeaderOffset({
                direction: direction,
                align: align,
                headerDom: headerRef.current,
                headerWrapperDom: headerWrapperRef.current,
            });
            // ??????????????? offset ???????????????type
            if (direction === 'vertical') {
                var nextOffset_1 = currentOffset;
                var scrollAlign_1 = scrollPosition;
                var topOffset = currentOffset + diffStyle.top;
                var bottomOffset = currentOffset + diffStyle.bottom;
                if (scrollAlign_1 === 'auto') {
                    scrollAlign_1 = diffStyle.top < 0 ? 'start' : diffStyle.bottom > 0 ? 'end' : scrollPosition;
                }
                if (scrollAlign_1 === 'start') {
                    nextOffset_1 = topOffset;
                }
                else if (scrollAlign_1 === 'end') {
                    nextOffset_1 = bottomOffset;
                }
                else if (scrollAlign_1 === 'center') {
                    nextOffset_1 = topOffset - (diffStyle.top - diffStyle.bottom) / 2;
                }
                else if (isNumber(scrollAlign_1)) {
                    nextOffset_1 = Math.max(topOffset - scrollAlign_1, bottomOffset);
                }
                return nextOffset_1;
            }
            // ??????????????? offset ??????????????? capsule ?????????????????? capsule ????????????
            if (align === 'right') {
                var startOffset_1 = currentOffset - diffStyle.left;
                var endOffset_1 = currentOffset - diffStyle.right;
                var scrollAlign_2 = scrollPosition;
                var nextOffset_2 = currentOffset;
                if (scrollPosition === 'auto') {
                    scrollAlign_2 = diffStyle.left < 0 ? 'start' : diffStyle.right > 0 ? 'end' : scrollPosition;
                }
                if (scrollAlign_2 === 'start') {
                    nextOffset_2 = startOffset_1;
                }
                else if (scrollAlign_2 === 'end') {
                    nextOffset_2 = endOffset_1;
                }
                else if (scrollAlign_2 === 'center') {
                    nextOffset_2 = startOffset_1 + (diffStyle.left - diffStyle.right) / 2;
                }
                else if (isNumber(scrollAlign_2)) {
                    nextOffset_2 = Math.min(startOffset_1 + scrollAlign_2, endOffset_1);
                }
                return nextOffset_2;
            }
            var nextOffset = currentOffset;
            var scrollAlign = scrollPosition;
            var startOffset = currentOffset + diffStyle.left;
            var endOffset = currentOffset + diffStyle.right;
            if (scrollPosition === 'auto') {
                scrollAlign = diffStyle.left < 0 ? 'start' : diffStyle.right > 0 ? 'end' : scrollPosition;
            }
            if (scrollAlign === 'start') {
                nextOffset = startOffset;
            }
            else if (scrollAlign === 'end') {
                nextOffset = endOffset;
            }
            else if (scrollAlign === 'center') {
                nextOffset = startOffset - (diffStyle.left - diffStyle.right) / 2;
            }
            else if (isNumber(scrollAlign)) {
                nextOffset = Math.max(startOffset - scrollAlign, endOffset);
            }
            return nextOffset;
        };
        updateScrollOffset(headerWrapperRef.current, direction);
        var offset = getActiveTabOffset();
        offset = getValidOffset(offset);
        setHeaderOffset(offset);
    }, [activeTab, direction, overflow, isScrollable, type, getValidOffset, scrollPosition]);
    var headerStyle = getHeaderStyle({
        direction: direction,
        align: align,
        headerOffset: headerOffset,
    });
    var isDropdown = isScrollable && overflow === 'dropdown' && direction !== 'vertical';
    var isScroll = isScrollable && !isDropdown;
    var isEditable = editable && (type === 'card' || type === 'card-gutter' || type === 'line');
    var handleDelete = function (child) {
        mergeProps.onDeleteTab && mergeProps.onDeleteTab(child.key);
        setShouldScroll(scrollConfig.delete);
    };
    var handleAdd = function () {
        onAddTab && onAddTab();
        setShouldScroll(scrollConfig.add);
    };
    var renderAddIcon = function (isEditable) {
        return (isEditable &&
            showAddButton && (React.createElement("div", __assign({ className: prefixCls + "-add-icon", "aria-label": "add tab", tabIndex: 0, role: "button", onClick: handleAdd }, getKeyDownEvent({ onPressEnter: handleAdd })), addButton || (React.createElement(IconHover, { prefix: prefixCls + "-add" },
            React.createElement("span", { className: prefixCls + "-add" }, (icons === null || icons === void 0 ? void 0 : icons.add) || React.createElement(IconPlus, null)))))));
    };
    useHeaderScroll({
        headerWrapperRef: headerWrapperRef,
        headerOffset: headerOffset,
        align: align,
        direction: direction,
        isScrollable: isScrollable,
        onScroll: function (offset) {
            updateHeaderOffset(offset);
        },
    });
    return (React.createElement("div", { className: cs(prefixCls + "-header-nav", prefixCls + "-header-nav-" + direction, prefixCls + "-header-nav-" + tabPosition, prefixCls + "-header-size-" + size, prefixCls + "-header-nav-" + type, className), style: style, ref: ref },
        React.createElement("div", { className: cs(prefixCls + "-header-scroll", (_a = {},
                _a[prefixCls + "-header-overflow-scroll"] = isScroll,
                _a[prefixCls + "-header-overflow-dropdown"] = isDropdown,
                _a)), ref: scrollWrapperRef },
            isScroll && (React.createElement(TabNavIcon, { iconPos: "prev", prefixCls: prefixCls, currentOffset: headerOffset, headerSize: headerSize, headerWrapperSize: headerWrapperSize, 
                // getRef={(name) => getCalcArguments()[name]}
                direction: direction, align: align, onChange: updateHeaderOffset })),
            React.createElement(ResizeObserver, { onResize: onWrapperResize },
                React.createElement("div", { className: prefixCls + "-header-wrapper", ref: headerWrapperRef },
                    React.createElement(ResizeObserver, { onResize: onHeaderResize },
                        React.createElement("div", { className: cs(prefixCls + "-header", (_b = {},
                                _b[prefixCls + "-header-no-padding"] = !props.headerPadding &&
                                    direction === 'horizontal' &&
                                    ['line', 'text'].indexOf(type) > -1,
                                _b)), ref: headerRef, style: headerStyle },
                            paneChildren.map(function (child, index) { return (React.createElement(TabHeaderTitle, __assign({ key: index, ref: function (node) {
                                    titleRef.current[child.key] = node;
                                }, tabKey: child.key }, child.props, { prefixCls: prefixCls, onDeleteTab: function () { return handleDelete(child); }, renderTitle: props.children || renderTabTitle, onClickTab: function () {
                                    mergeProps.onClickTab && mergeProps.onClickTab(child.key);
                                }, isActive: activeTab === child.key, editable: isEditable && child.props.closable !== false, deleteIcon: icons === null || icons === void 0 ? void 0 : icons.delete, deleteButton: deleteButton, getIdPrefix: ctxProps.getIdPrefix, index: index }))); }),
                            type === 'line' && (React.createElement(TabInk, { disabled: !!paneChildren.find(function (child) {
                                    return child && child.props && child.props.disabled && child.key === activeTab;
                                }), prefixCls: prefixCls, animation: animation, direction: direction, getTitleRef: function (key) { return titleRef.current[key]; }, activeTab: activeTab, getHeaderRef: function () { return headerRef; } })))),
                    !isScrollable && renderAddIcon(isEditable))),
            isScroll && (React.createElement(TabNavIcon, { prefixCls: prefixCls, currentOffset: headerOffset, headerSize: headerSize, headerWrapperSize: headerWrapperSize, direction: direction, align: align, onChange: updateHeaderOffset })),
            isDropdown && (React.createElement(DropdownIcon, { onClickTab: mergeProps.onClickTab, paneChildren: paneChildren, prefixCls: prefixCls, currentOffset: headerOffset, headerSize: headerSize, headerWrapperSize: headerWrapperSize, getTitleRef: function (key) { return titleRef.current[key]; }, direction: direction })),
            ((isEditable && isScrollable) || extra) && (React.createElement("div", { className: prefixCls + "-header-extra" },
                isScrollable && renderAddIcon(isEditable),
                extra)))));
});
TabHeader.displayName = 'TabHeader';
export default TabHeader;
