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
import React, { forwardRef } from 'react';
import Checkbox from '../../Checkbox';
import Radio from '../../Radio';
import { isString, isArray } from '../../_util/is';
import cs from '../../_util/classNames';
import useComponent from '../hooks/useComponent';
import IconPlus from '../../../icon/react-icon/IconPlus';
import IconMinus from '../../../icon/react-icon/IconMinus';
import { INTERNAL_EXPAND_KEY, INTERNAL_SELECTION_KEY } from '../constant';
import Td from './td';
function Tr(props, ref) {
    var _a;
    var expandedRowRender = props.expandedRowRender, onClickExpandBtn = props.onClickExpandBtn, columns = props.columns, components = props.components, onCheck = props.onCheck, onCheckRadio = props.onCheckRadio, prefixCls = props.prefixCls, selectedRowKeys = props.selectedRowKeys, indeterminateKeys = props.indeterminateKeys, rowClassName = props.rowClassName, onRow = props.onRow, rowSelection = props.rowSelection, _b = props.indentSize, indentSize = _b === void 0 ? 16 : _b, currentSorter = props.currentSorter, virtualized = props.virtualized, stickyOffsets = props.stickyOffsets, stickyClassNames = props.stickyClassNames, getRowKey = props.getRowKey, placeholder = props.placeholder, _c = props.expandProps, expandProps = _c === void 0 ? { strictTreeData: true } : _c, data = props.data, expandedRowKeys = props.expandedRowKeys, childrenColumnName = props.childrenColumnName, record = props.record, index = props.index, type = props.type, shouldRowExpand = props.shouldRowExpand, level = props.level;
    var rowProps = __rest(onRow && onRow(record, index), []);
    var rowK = getRowKey(record);
    var usedSelectedRowKeys = type === 'radio' ? selectedRowKeys.slice(0, 1) : selectedRowKeys;
    var trKey = rowK || index;
    var checked = usedSelectedRowKeys.indexOf(rowK) > -1;
    var indeterminate = indeterminateKeys.indexOf(rowK) > -1;
    var classNameTr = cs(prefixCls + "-tr", (_a = {},
        _a[prefixCls + "-row-checked"] = checked,
        _a), rowClassName && rowClassName(record, index));
    var checkboxProps = rowSelection && typeof rowSelection.checkboxProps === 'function'
        ? rowSelection.checkboxProps(record)
        : {};
    var operationClassName = cs(prefixCls + "-td", prefixCls + "-operation");
    var getPrefixColClassName = function (name) {
        var _a;
        return cs(operationClassName, prefixCls + "-" + name, (_a = {},
            _a[prefixCls + "-selection-col"] = (virtualized && type === 'checkbox') || type === 'radio',
            _a[prefixCls + "-expand-icon-col"] = virtualized && expandedRowRender,
            _a));
    };
    function isChildrenNotEmpty(record) {
        return expandProps.strictTreeData
            ? isArray(record[childrenColumnName]) && record[childrenColumnName].length
            : record[childrenColumnName] !== undefined;
    }
    // tree data
    function isDataHaveChildren() {
        return data.find(function (d) { return isChildrenNotEmpty(d); });
    }
    var shouldRenderExpandRow = shouldRowExpand(record, index);
    var recordHaveChildren = isChildrenNotEmpty(record);
    var haveTreeData = !virtualized && isDataHaveChildren() && !expandedRowRender;
    var shouldRenderTreeDataExpandRow = haveTreeData && recordHaveChildren;
    var expandRowByClick = expandProps.expandRowByClick;
    var rowClickProps = expandRowByClick && (shouldRenderExpandRow || shouldRenderTreeDataExpandRow)
        ? {
            onClick: function (e) {
                onClickExpandBtn(rowK);
                rowProps && rowProps.onClick && rowProps.onClick(e);
            },
        }
        : {};
    var _d = useComponent(components), ComponentBodyRow = _d.ComponentBodyRow, ComponentTd = _d.ComponentTd, getBodyComponentOperations = _d.getBodyComponentOperations;
    var InnerComponentBodyRow = virtualized ? 'div' : ComponentBodyRow;
    var InnerComponentTd = virtualized ? 'div' : ComponentTd;
    var baseTrProps = __assign(__assign({ className: classNameTr, key: trKey }, rowProps), rowClickProps);
    var trProps = isString(ComponentBodyRow) ? baseTrProps : __assign(__assign({}, baseTrProps), { record: record, index: index });
    function renderExpandIcon(record, rowK) {
        var expandIcon = expandProps.icon;
        var expanded = !!~expandedRowKeys.indexOf(rowK);
        return typeof expandIcon === 'function' ? (expandIcon({ expanded: expanded, record: record })) : (React.createElement("button", { onClick: function (e) {
                e.stopPropagation();
                onClickExpandBtn(rowK);
            }, type: "button" }, expanded ? React.createElement(IconMinus, null) : React.createElement(IconPlus, null)));
    }
    var expandNode = expandedRowRender && (React.createElement(InnerComponentTd, { className: getPrefixColClassName('expand-icon-cell') }, shouldRenderExpandRow && renderExpandIcon(record, rowK)));
    var renderSelectionCell = rowSelection && rowSelection.renderCell;
    var selectionNode;
    var checkboxNode = (React.createElement(Checkbox, __assign({ value: rowK, onChange: function (check) { return onCheck(check, record); }, checked: checked, indeterminate: indeterminate }, checkboxProps)));
    var radioNode = (React.createElement(Radio, __assign({ onChange: function () { return onCheckRadio(rowK, record); }, value: rowK, checked: checked }, checkboxProps)));
    if (type === 'checkbox') {
        selectionNode = (React.createElement(InnerComponentTd, { className: getPrefixColClassName('checkbox') }, renderSelectionCell ? renderSelectionCell(checkboxNode, checked, record) : checkboxNode));
    }
    if (type === 'radio') {
        selectionNode = (React.createElement(InnerComponentTd, { className: getPrefixColClassName('radio') }, renderSelectionCell ? renderSelectionCell(radioNode, checked, record) : radioNode));
    }
    var bodyOperations = getBodyComponentOperations({ selectionNode: selectionNode, expandNode: expandNode });
    return (React.createElement(InnerComponentBodyRow, __assign({}, trProps, { ref: ref }), columns.map(function (col, colIndex) {
        var _a, _b, _c, _d;
        var stickyOffset = stickyOffsets[colIndex];
        var stickyClassName = stickyClassNames[colIndex];
        if (col.$$isOperation) {
            var node = col.node;
            var isExtraOperation = true;
            if (col.title === INTERNAL_SELECTION_KEY) {
                node = (_a = bodyOperations.find(function (o) { return o.name === 'selectionNode'; })) === null || _a === void 0 ? void 0 : _a.node;
                isExtraOperation = false;
            }
            if (col.title === INTERNAL_EXPAND_KEY) {
                node = (_b = bodyOperations.find(function (o) { return o.name === 'expandNode'; })) === null || _b === void 0 ? void 0 : _b.node;
                isExtraOperation = false;
            }
            var operationNode = typeof node === 'function' ? node(record) : node;
            return React.cloneElement(operationNode, __assign(__assign({ key: col.key || colIndex }, operationNode.props), { className: cs(isExtraOperation ? operationClassName : '', (_c = operationNode === null || operationNode === void 0 ? void 0 : operationNode.props) === null || _c === void 0 ? void 0 : _c.className, stickyClassName), style: __assign(__assign(__assign({}, (_d = operationNode === null || operationNode === void 0 ? void 0 : operationNode.props) === null || _d === void 0 ? void 0 : _d.style), (col.fixed === 'left'
                    ? {
                        left: stickyOffset,
                    }
                    : {})), { width: col.width, minWidth: col.width }) }));
        }
        return (React.createElement(Td, { key: colIndex, prefixCls: prefixCls, virtualized: virtualized, components: components, currentSorter: currentSorter, placeholder: placeholder, indentSize: indentSize, stickyClassName: stickyClassName, stickyOffset: stickyOffset, InnerComponentTd: InnerComponentTd, column: col, columnIndex: colIndex, record: record, trIndex: index, level: level, haveTreeData: haveTreeData, recordHaveChildren: recordHaveChildren, rowKey: rowK, renderExpandIcon: renderExpandIcon }));
    })));
}
var ForwardRefTr = forwardRef(Tr);
export default ForwardRefTr;
