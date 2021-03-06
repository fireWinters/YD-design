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
import React from 'react';
import { isArray } from '../../_util/is';
import cs from '../../_util/classNames';
import useComponent from '../hooks/useComponent';
import VirtualList from '../../_class/VirtualList';
import Tr from './tr';
function TBody(props) {
    var _a = props.childrenColumnName, childrenColumnName = _a === void 0 ? 'children' : _a, _b = props.expandProps, expandProps = _b === void 0 ? {} : _b, expandedRowRender = props.expandedRowRender, expandedRowKeys = props.expandedRowKeys, data = props.data, columns = props.columns, prefixCls = props.prefixCls, components = props.components, rowSelection = props.rowSelection, noDataElement = props.noDataElement, scroll = props.scroll, _c = props.indentSize, indentSize = _c === void 0 ? 16 : _c, hasFixedColumn = props.hasFixedColumn, tableViewWidth = props.tableViewWidth, virtualized = props.virtualized, getRowKey = props.getRowKey, saveVirtualWrapperRef = props.saveVirtualWrapperRef;
    var ComponentTbody = useComponent(components).ComponentTbody;
    var type;
    if (rowSelection && 'type' in rowSelection) {
        type = rowSelection.type;
    }
    else if (rowSelection && !('type' in rowSelection)) {
        type = 'checkbox';
    }
    function isChildrenNotEmpty(record) {
        return isArray(record[childrenColumnName]) && record[childrenColumnName].length;
    }
    function shouldRowExpand(record, index) {
        if ('rowExpandable' in expandProps && typeof expandProps.rowExpandable === 'function') {
            return expandProps.rowExpandable(record);
        }
        return expandedRowRender && expandedRowRender(record, index) !== null;
    }
    var trProps = __assign(__assign({}, props), { type: type, shouldRowExpand: shouldRowExpand });
    function renderTreeTrs(record, index) {
        var trList = [];
        trList.push(React.createElement(Tr, __assign({ key: getRowKey(record) }, trProps, { record: record, level: 0, index: index })));
        var travel = function (children, rowKey, level) {
            if (level === void 0) { level = 0; }
            if (isArray(children) && children.length) {
                children.forEach(function (child, i) {
                    if (expandedRowKeys.indexOf(rowKey) !== -1) {
                        trList.push(React.createElement(Tr, __assign({}, trProps, { key: getRowKey(child), record: child, level: level + 1, index: i })));
                        if (isChildrenNotEmpty(child)) {
                            travel(child[childrenColumnName], getRowKey(child), level + 1);
                        }
                    }
                });
            }
        };
        if (!expandedRowRender) {
            travel(record[childrenColumnName], getRowKey(record));
        }
        return trList;
    }
    var scrollStyleX = {};
    var scrollStyleY = {};
    if (scroll) {
        if (scroll.x && (typeof scroll.x === 'number' || typeof scroll.x === 'string')) {
            scrollStyleX = {
                width: scroll.x,
            };
        }
        if (scroll.y && (typeof scroll.y === 'number' || typeof scroll.y === 'string')) {
            scrollStyleY = {
                maxHeight: scroll.y,
            };
        }
    }
    var noElementProps = {
        className: prefixCls + "-no-data",
    };
    if (tableViewWidth) {
        noElementProps.className = prefixCls + "-no-data " + prefixCls + "-expand-fixed-row";
        noElementProps.style = { width: tableViewWidth };
    }
    var noDataTr = (React.createElement("tr", { className: cs(prefixCls + "-tr", prefixCls + "-empty-row") },
        React.createElement("td", { className: prefixCls + "-td", colSpan: columns.length },
            React.createElement("div", __assign({}, noElementProps), noDataElement))));
    // https://github.com/arco-design/arco-design/issues/644
    // except the real scroll container, all parent nodes should not have a overflow style.
    if (virtualized) {
        return data.length > 0 ? (React.createElement(VirtualList, { data: data, height: scrollStyleY.maxHeight, isStaticItemHeight: false, 
            // position sticky works
            outerStyle: __assign(__assign({}, scrollStyleX), { minWidth: '100%', overflow: 'visible' }), className: prefixCls + "-body", ref: function (ref) { return saveVirtualWrapperRef(ref === null || ref === void 0 ? void 0 : ref.dom); } }, function (child, index) { return (React.createElement(Tr, __assign({}, trProps, { key: getRowKey(child), record: child, index: index, level: 0 }))); })) : (React.createElement("div", { className: prefixCls + "-body" },
            React.createElement("table", null,
                React.createElement("tbody", null, noDataTr))));
    }
    return (React.createElement(ComponentTbody, null, data.length > 0
        ? data.map(function (record, index) {
            var rowK = getRowKey(record);
            var shouldRenderExpandIcon = shouldRowExpand(record, index) && expandedRowKeys.indexOf(rowK) !== -1;
            return (React.createElement(React.Fragment, { key: rowK },
                renderTreeTrs(record, index),
                shouldRenderExpandIcon && (React.createElement("tr", { className: cs(prefixCls + "-tr", prefixCls + "-expand-content"), key: rowK + "-expanded" },
                    React.createElement("td", { className: prefixCls + "-td", colSpan: columns.length, style: { paddingLeft: indentSize } }, hasFixedColumn ? (React.createElement("div", { className: prefixCls + "-expand-fixed-row", style: { width: tableViewWidth } }, expandedRowRender && expandedRowRender(record, index))) : (expandedRowRender && expandedRowRender(record, index)))))));
        })
        : noDataTr));
}
export default TBody;
