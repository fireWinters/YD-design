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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState, useMemo, useCallback, forwardRef, useImperativeHandle, useRef, } from 'react';
import VirtualList from '../_class/VirtualList';
import useUpdate from '../_util/hooks/useUpdate';
import Node from './node';
import scrollIntoViewIfNeed from '../_util/scrollIntoView';
function getKey(option) {
    return option.key || option._key;
}
function NodeList(props, ref) {
    var className = props.className, style = props.style, filterNode = props.filterNode, virtualListProps = props.virtualListProps, expandedKeys = props.expandedKeys, currentExpandKeys = props.currentExpandKeys, saveCacheNode = props.saveCacheNode, nodeList = props.nodeList, getNodeProps = props.getNodeProps;
    var isVirtual = (virtualListProps === null || virtualListProps === void 0 ? void 0 : virtualListProps.threshold) !== null;
    var virtualListRef = useRef();
    var treeWrapperRef = useRef();
    var expandedKeysSet = useMemo(function () { return new Set(expandedKeys); }, [expandedKeys]);
    var visibleKeys = useMemo(function () {
        var newKeys = new Set();
        var currentExpandKeysSet = new Set(currentExpandKeys);
        nodeList.forEach(function (nodeProps) {
            var pathParentKeys = nodeProps.pathParentKeys || [];
            // ???????????????????????????????????????????????????????????????????????????????????????children??????animation??????????????????
            // ??????????????????????????????children?????????????????????????????????????????? anyway??????????????????????????????
            if (pathParentKeys.every(function (key) { return !currentExpandKeysSet.has(key) && expandedKeysSet.has(key); })) {
                newKeys.add(nodeProps._key);
            }
        });
        return newKeys;
    }, [expandedKeysSet, currentExpandKeys, nodeList]);
    var calcChildrenList = useCallback(function () {
        return nodeList.filter(function (item) {
            var pass = !filterNode || (filterNode && filterNode(item));
            if (pass && visibleKeys.has(item.key)) {
                return true;
            }
            // ?????????????????????????????????????????????????????????onSelect????????????selectedNodes??????undefined
            saveCacheNode(React.createElement(Node, __assign({}, item, getNodeProps(item), { key: item.key })));
            return false;
        });
    }, [nodeList, filterNode, visibleKeys]);
    // ??????????????????nodeList??????????????????defaultExpandedKeys????????????????????????????????????????????????????????????
    var _a = __read(useState(function () {
        return calcChildrenList();
    }), 2), childrenList = _a[0], setChildrenList = _a[1];
    useUpdate(function () {
        setChildrenList(calcChildrenList());
    }, [calcChildrenList]);
    useImperativeHandle(ref, function () {
        return {
            // index: ?????????dom??????, ??????????????????????????????????????? node ??? key????????????
            // nodeProps: _index ??? key ???????????????node
            scrollIntoView: function (_index, nodeProps) {
                var index = _index;
                var isKey = typeof _index === 'string';
                if (isKey) {
                    var key_1 = _index;
                    // ?????????????????????????????????????????????????????????
                    if (!visibleKeys.has(_index) && nodeProps && nodeProps.pathParentKeys) {
                        key_1 =
                            __spreadArray([], __read(nodeProps.pathParentKeys), false).reverse().find(function (key) { return visibleKeys.has(key); }) || index;
                    }
                    // _index attributes and index are not the same due to some hidden items
                    index = childrenList.findIndex(function (_a) {
                        var _key = _a._key;
                        return _key === key_1;
                    });
                }
                if (!isVirtual && treeWrapperRef.current) {
                    var wrapperDom = treeWrapperRef.current;
                    var node = wrapperDom ? wrapperDom.children[index] : null;
                    node &&
                        scrollIntoViewIfNeed(node, {
                            boundary: wrapperDom.parentElement,
                        });
                }
                else if (virtualListRef.current) {
                    virtualListRef.current.scrollTo({ index: index });
                }
            },
        };
    });
    return isVirtual ? (React.createElement(VirtualList, __assign({ className: className, style: style, ref: virtualListRef, data: childrenList, isStaticItemHeight: false, itemKey: getKey, onMouseDown: props.onMouseDown }, props.ariaProps, virtualListProps), function (item) {
        var node = React.createElement(Node, __assign({}, item, getNodeProps(item, expandedKeysSet), { key: item.key }));
        saveCacheNode(node);
        return node;
    })) : (React.createElement("div", __assign({ role: "tree", tabIndex: 0, className: className, style: style, ref: treeWrapperRef }, props.ariaProps, { onMouseDown: props.onMouseDown }), childrenList.map(function (item) {
        var node = React.createElement(Node, __assign({}, item, getNodeProps(item, expandedKeysSet), { key: item.key }));
        saveCacheNode(node);
        return node;
    })));
}
export default forwardRef(NodeList);
