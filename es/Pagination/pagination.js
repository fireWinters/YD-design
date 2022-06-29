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
import React, { useState, useEffect, useContext, forwardRef } from 'react';
import PageItem, { StepType, JumpPager, StepPager } from './page-item';
import PageOption from './page-options';
import PageJumper from './page-jumper';
import cs from '../_util/classNames';
import { ConfigContext } from '../ConfigProvider';
import useMergeProps from '../_util/hooks/useMergeProps';
var _defaultCurrent = 1;
var _defaultPageSize = 10;
function getAllPages(pageSize, total) {
    return Math.ceil(total / pageSize);
}
function getBufferSize(bufferSize, allPages) {
    var min = 0;
    var max = Math.floor(allPages / 2) - 1;
    var newBufferSize = Math.max(bufferSize, min);
    return Math.min(newBufferSize, max);
}
var defaultProps = {
    total: 0,
    pageSizeChangeResetCurrent: true,
    bufferSize: 2,
};
function Pagination(baseProps, ref) {
    var _a;
    var _b;
    var _c = useContext(ConfigContext), getPrefixCls = _c.getPrefixCls, ctxSize = _c.size, locale = _c.locale, componentConfig = _c.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Pagination);
    var propTotal = props.total, propPageSize = props.pageSize, propCurrent = props.current, propShowMore = props.showMore, pageSizeChangeResetCurrent = props.pageSizeChangeResetCurrent, defaultCurrent = props.defaultCurrent, defaultPageSize = props.defaultPageSize;
    var _d = __read(useState(propCurrent || defaultCurrent || _defaultCurrent), 2), current = _d[0], setCurrent = _d[1];
    var _e = __read(useState(propPageSize || defaultPageSize || _defaultPageSize), 2), pageSize = _e[0], setPageSize = _e[1];
    var _f = __read(useState(propTotal), 2), total = _f[0], setTotal = _f[1];
    var _g = __read(useState(!!propShowMore), 2), showMore = _g[0], setShowMore = _g[1];
    if (propCurrent && !props.onChange) {
        console.warn('Warning: you have provide current prop for pagination but without onChange handler ,' +
            ' this will cause no-change when you change page. ');
    }
    useEffect(function () {
        if ('total' in props && propTotal !== total) {
            setTotal(propTotal);
        }
        if (!!propShowMore !== showMore) {
            setShowMore(!!propShowMore);
        }
        if (propPageSize && propPageSize !== pageSize) {
            setPageSize(propPageSize);
            var currentAllPages = getAllPages(propPageSize, propTotal);
            var nextCurrent = current > currentAllPages ? currentAllPages : current;
            if (nextCurrent !== current) {
                setCurrent(nextCurrent);
            }
        }
        if (propCurrent && propCurrent !== current) {
            setCurrent(propCurrent);
        }
    }, [propPageSize, propTotal, propShowMore, propCurrent]);
    var onChange = function (pageNumber, size) {
        if (pageNumber === void 0) { pageNumber = current; }
        if (size === void 0) { size = pageSize; }
        var onChange = props.onChange;
        onChange && onChange(pageNumber, size);
    };
    var onPageSizeChange = function (pageSize) {
        var onPageSizeChange = props.onPageSizeChange;
        var allPages = getAllPages(pageSize, total);
        var newState = {
            pageSize: pageSize,
        };
        if (pageSizeChangeResetCurrent) {
            newState.current = 1;
        }
        else {
            newState.current = current > allPages ? allPages : current;
        }
        if (!('pageSize' in props)) {
            setPageSize(newState.pageSize);
        }
        if (!('current' in props) && current !== newState.current) {
            setCurrent(newState.current);
        }
        onPageSizeChange && onPageSizeChange(pageSize, newState.current);
        onChange(pageSizeChangeResetCurrent ? 1 : newState.current, pageSize);
    };
    var onPageNumberChange = function (pageNumber) {
        if (!('current' in props)) {
            setCurrent(pageNumber);
        }
        onChange(pageNumber);
    };
    var className = props.className, style = props.style, pageItemStyle = props.pageItemStyle, activePageItemStyle = props.activePageItemStyle, showTotal = props.showTotal, sizeCanChange = props.sizeCanChange, sizeOptions = props.sizeOptions, simple = props.simple, mini = props.mini, showJumper = props.showJumper, selectProps = props.selectProps, icons = props.icons, disabled = props.disabled, itemRender = props.itemRender, hideOnSinglePage = props.hideOnSinglePage;
    var size = props.size || ctxSize;
    var prefixCls = getPrefixCls('pagination');
    // compatible 1.0
    var innerSize = mini ? 'mini' : size;
    var classNames = cs(prefixCls, prefixCls + "-size-" + innerSize, (_a = {},
        _a[prefixCls + "-simple"] = simple,
        _a[prefixCls + "-disabled"] = disabled,
        _a), className);
    var renderPager;
    var pageList = [];
    var allPages = getAllPages(pageSize, total);
    var bufferSize = getBufferSize(props.bufferSize, allPages);
    if (hideOnSinglePage && allPages <= 1) {
        return null;
    }
    var pagerProps = {
        onClick: onPageNumberChange,
        rootPrefixCls: prefixCls,
        simple: simple,
        current: current,
        allPages: allPages,
        icons: icons,
        disabled: disabled,
        pageItemStyle: pageItemStyle,
        activePageItemStyle: activePageItemStyle,
        itemRender: itemRender,
    };
    // simple mode, no pager list
    if (simple) {
        var prefix = prefixCls + "-item-simple";
        renderPager = (React.createElement("ul", { className: prefixCls + "-list" },
            React.createElement(StepPager, __assign({ key: "previous" }, pagerProps, { type: StepType.previous })),
            React.createElement("li", { className: prefix + "-pager" },
                React.createElement(PageJumper, { disabled: disabled, rootPrefixCls: prefixCls, totalPages: allPages, current: current, onPageChange: onPageNumberChange, simple: { showJumper: typeof showJumper === 'boolean' ? showJumper : true }, size: innerSize })),
            React.createElement(StepPager, __assign({ key: "next" }, pagerProps, { type: StepType.next }))));
    }
    else {
        // fold = ... >= 2pages;
        var beginFoldPage = 1 + 2 + bufferSize;
        var endFoldPage = allPages - 2 - bufferSize;
        if (
        // beginPage(1 page) + bufferSize * 2 + endPage(1 page) + ...(2 pages)
        allPages <= 4 + bufferSize * 2 ||
            (current === beginFoldPage && current === endFoldPage)) {
            for (var i = 1; i <= allPages; i++) {
                pageList.push(React.createElement(PageItem, __assign({}, pagerProps, { key: i, pageNum: i })));
            }
        }
        else {
            var left = 1;
            var right = allPages;
            var hasJumpPre = true;
            var hasJumpNext = true;
            // fold front and back
            if (current > beginFoldPage && current < endFoldPage) {
                right = current + bufferSize;
                left = current - bufferSize;
                // fold back
            }
            else if (current <= beginFoldPage) {
                hasJumpPre = false;
                left = 1;
                right = Math.max(beginFoldPage, bufferSize + current);
                // fold begin
            }
            else if (current >= endFoldPage) {
                hasJumpNext = false;
                right = allPages;
                left = Math.min(endFoldPage, current - bufferSize);
            }
            for (var i = left; i <= right; i++) {
                pageList.push(React.createElement(PageItem, __assign({ key: i, pageNum: i }, pagerProps)));
            }
            var JumpPre = (React.createElement(JumpPager, __assign({}, pagerProps, { key: left - 1, type: StepType.previous, jumpPage: -(bufferSize * 2 + 1) })));
            var JumpNext = (React.createElement(JumpPager, __assign({}, pagerProps, { key: right + 1, type: StepType.next, jumpPage: bufferSize * 2 + 1 })));
            var FirstPager = React.createElement(PageItem, __assign({ key: 1, pageNum: 1 }, pagerProps));
            var LastPager = React.createElement(PageItem, __assign({}, pagerProps, { key: allPages, pageNum: allPages }));
            if (hasJumpPre) {
                pageList[0] = React.cloneElement(pageList[0], {
                    className: prefixCls + "-item-after-pre",
                });
                // TODO:
                pageList.unshift(JumpPre);
                pageList.unshift(FirstPager);
            }
            if (hasJumpNext) {
                pageList[pageList.length - 1] = React.cloneElement(pageList[pageList.length - 1], {
                    className: prefixCls + "-item-before-next",
                });
                pageList.push(JumpNext);
                pageList.push(LastPager);
            }
        }
        renderPager = (React.createElement("ul", { className: prefixCls + "-list" },
            React.createElement(StepPager, __assign({}, pagerProps, { key: "previous", type: StepType.previous })),
            pageList,
            showMore && (React.createElement(JumpPager, __assign({}, pagerProps, { key: allPages + 1, type: StepType.next, jumpPage: bufferSize * 2 + 1 }))),
            React.createElement(StepPager, __assign({ key: "next" }, pagerProps, { type: StepType.next }))));
    }
    var totalElement = null;
    if (typeof showTotal === 'boolean' && showTotal) {
        totalElement = (React.createElement("div", { className: prefixCls + "-total-text" }, (_b = locale.Pagination.total) === null || _b === void 0 ? void 0 : _b.replace('{0}', total)));
    }
    if (typeof showTotal === 'function') {
        totalElement = (React.createElement("div", { className: prefixCls + "-total-text" }, showTotal(total, [(current - 1) * pageSize + 1, current * pageSize])));
    }
    return (React.createElement("div", { className: classNames, style: style, ref: ref },
        totalElement,
        renderPager,
        React.createElement(PageOption, { disabled: disabled, rootPrefixCls: prefixCls, sizeCanChange: sizeCanChange, sizeOptions: sizeOptions, onPageSizeChange: onPageSizeChange, pageSize: pageSize, size: innerSize, selectProps: selectProps }),
        !simple && showJumper && (React.createElement(PageJumper, { disabled: disabled, rootPrefixCls: prefixCls, totalPages: allPages, current: current, onPageChange: onPageNumberChange, size: innerSize }))));
}
var PaginationComponent = forwardRef(Pagination);
PaginationComponent.displayName = 'Pagination';
export default PaginationComponent;
