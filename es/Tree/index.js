var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { Component } from 'react';
import isEqualWith from 'lodash/isEqualWith';
import cs from '../_util/classNames';
import Node from './node';
import NodeList from './node-list';
import { isEmptyObject, isFunction } from '../_util/is';
import { ConfigContext } from '../ConfigProvider';
import { getAllCheckedKeysByCheck, getCheckedKeysByInitKeys, getTreeDataFromTreeChildren, } from './util';
import { TreeContext } from './context';
var DefaultFieldNames = {
    key: 'key',
    title: 'title',
    children: 'children',
    selectable: 'selectable',
    disabled: 'disabled',
    disableCheckbox: 'disableCheckbox',
    checkable: 'checkable',
    isLeaf: 'isLeaf',
};
var defaultProps = {
    selectable: true,
    autoExpandParent: true,
    checkedStrategy: 'all',
    actionOnClick: 'select',
    allowDrop: function () { return true; },
    fieldNames: DefaultFieldNames,
};
var needMergeKeys = [
    'style',
    'className',
    'height',
    'size',
    'blockNode',
    'autoExpandParent',
    'checkedStrategy',
    'fieldNames',
    'icons',
    'virtualListProps',
    'showLine',
    'selectable',
    'allowDrop',
    'actionOnClick',
];
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree(props, context) {
        var _this = _super.call(this, props, context) || this;
        // ????????????NodeInstance ???????????????1.x??????????????????????????????
        _this.cacheNodes = {};
        _this.key2nodeProps = {};
        _this.getMergedProps = function (baseProps) {
            var componentConfig = _this.context.componentConfig;
            var props = baseProps || _this.props;
            return needMergeKeys.reduce(function (_props, key) {
                if (props[key] !== undefined) {
                    _props[key] = props[key];
                }
                else if ((componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Tree) && (componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Tree[key]) !== undefined) {
                    _props[key] = componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Tree[key];
                }
                else if (defaultProps[key] !== undefined) {
                    _props[key] = defaultProps[key];
                }
                return _props;
            }, {});
        };
        // index: ?????????dom??????, ??????????????????????????????????????? node ??? key????????????
        // nodeProps ?????????????????????????????????????????????????????????????????????????????????key????????????
        _this.scrollIntoView = function (_index, nodeProps) {
            var index = _index;
            if (typeof _index === 'string' || nodeProps) {
                // ??????key
                index = _index || nodeProps._key;
            }
            if (_this.nodeListRef) {
                _this.nodeListRef.scrollIntoView(index, nodeProps || _this.key2nodeProps[index]);
            }
        };
        _this.getTreeData = function () {
            return 'treeData' in _this.props
                ? _this.props.treeData
                : getTreeDataFromTreeChildren(_this.props.children);
        };
        // ???????????????????????????????????????????????????nodeList
        _this.needUpdateTreeData = function (prevProps, props) {
            var keys = [
                'fieldNames',
                'selectable',
                'draggable',
                'checkStrictly',
                'showLine',
                'blockNode',
                'checkable',
                'treeData',
                'children',
            ];
            return (prevProps.treeData !== props.treeData ||
                prevProps.children !== props.children ||
                keys.some(function (key) { return isEqualWith(prevProps[key], props[key]); }));
        };
        // ?????? fieldNames ??????????????????
        _this.getFieldInfo = function (data) {
            var mergedProps = _this.getMergedProps();
            var selectable = mergedProps.selectable;
            // fieldsNames ??????treeData????????????
            var fieldNames = __assign(__assign({}, DefaultFieldNames), ('treeData' in _this.props ? mergedProps.fieldNames : {}));
            var result = {
                children: data[fieldNames.children],
                selectable: fieldNames.selectable in data ? data[fieldNames.selectable] : selectable,
                checkable: fieldNames.checkable in data ? data[fieldNames.checkable] : _this.props.checkable,
                title: data[fieldNames.title],
                disabled: data[fieldNames.disabled],
                disableCheckbox: data[fieldNames.disableCheckbox],
                isLeaf: data[fieldNames.isLeaf],
                key: data[fieldNames.key],
            };
            if (!(fieldNames.key in data)) {
                delete result.key;
            }
            return result;
        };
        _this.getNodeList = function (treedata, prefix) {
            _this.key2nodeProps = {};
            var prefixCls = prefix || _this.context.getPrefixCls('tree');
            var nodeList = [];
            var currentIndex = 0;
            var _a = _this.getMergedProps(), showLine = _a.showLine, blockNode = _a.blockNode;
            var loop = function (treeData, father) {
                var totalLength = treeData.length;
                return treeData.map(function (data, index) {
                    var _a = _this.getFieldInfo(data), children = _a.children, selectable = _a.selectable, checkable = _a.checkable, _b = _a.key, key = _b === void 0 ? ((father === null || father === void 0 ? void 0 : father._key) || '') + "-" + index : _b, rest = __rest(_a, ["children", "selectable", "checkable", "key"]);
                    var nodeProps = __assign(__assign(__assign({ 
                        // data ?????????dataRef?????????????????????
                        dataRef: data, draggable: _this.props.draggable, selectable: selectable, checkable: checkable, showLine: showLine, blockNode: blockNode }, data), rest), { key: key, children: children, _key: key, _index: currentIndex++, parentKey: father ? father._key : undefined, pathParentKeys: (father && father.pathParentKeys) || [], _level: father._level || 0, 
                        // ??????node???sowLine?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                        _lineless: father && father._lineless ? __spreadArray(__spreadArray([], __read((father._lineless || [])), false), [father._isTail], false) : [] });
                    if (totalLength === index + 1) {
                        nodeProps.className = cs(prefixCls + "-node-is-tail", nodeProps.className);
                    }
                    nodeList.push(nodeProps);
                    _this.key2nodeProps[key] = nodeProps;
                    if (children && children.length) {
                        _this.key2nodeProps[key].children = loop(children, {
                            _key: key,
                            _level: nodeProps._level + 1,
                            _lineless: nodeProps._lineless,
                            _isTail: totalLength === index + 1,
                            pathParentKeys: __spreadArray(__spreadArray([], __read(((father === null || father === void 0 ? void 0 : father.pathParentKeys) || [])), false), [key], false),
                        });
                    }
                    return nodeProps;
                });
            };
            loop(treedata || [], {});
            return nodeList;
        };
        _this.getInitExpandedKeys = function (keys) {
            if (!_this.getMergedProps().autoExpandParent) {
                return keys || [];
            }
            if (!keys) {
                return Object.keys(_this.key2nodeProps).filter(function (key) {
                    var props = _this.key2nodeProps[key];
                    return props.children && props.children.length;
                });
            }
            var expandedKeys = {};
            keys.forEach(function (key) {
                var item = _this.key2nodeProps[key];
                if (!item) {
                    return;
                }
                expandedKeys[key] = 1;
                if (item.pathParentKeys) {
                    item.pathParentKeys.forEach(function (x) {
                        expandedKeys[x] = 1;
                    });
                }
            });
            return Object.keys(expandedKeys);
        };
        _this.getInitCheckedKeys = function (keys) {
            if (!_this.props.checkStrictly) {
                var _a = getCheckedKeysByInitKeys(keys, _this.key2nodeProps), checkedKeys = _a.checkedKeys, indeterminateKeys = _a.indeterminateKeys;
                return {
                    checkedKeys: checkedKeys,
                    halfCheckedKeys: indeterminateKeys,
                };
            }
            return {
                checkedKeys: keys,
                halfCheckedKeys: _this.props.halfCheckedKeys || [],
            };
        };
        _this.handleSelect = function (key, e) {
            var onSelect = _this.props.onSelect;
            var extra = { e: e, node: _this.cacheNodes[key] };
            if (_this.props.multiple) {
                var selectedKeys = __spreadArray([], __read(_this.state.selectedKeys), false);
                var index = selectedKeys.indexOf(key);
                if (index > -1) {
                    selectedKeys.splice(index, 1);
                    extra.selected = false;
                }
                else {
                    extra.selected = true;
                    selectedKeys.push(key);
                }
                extra.selectedNodes = selectedKeys.map(function (x) { return _this.cacheNodes[x]; });
                if (!('selectedKeys' in _this.props)) {
                    _this.setState({ selectedKeys: selectedKeys });
                }
                onSelect && onSelect(selectedKeys, extra);
            }
            else {
                extra.selected = true;
                extra.selectedNodes = [_this.cacheNodes[key]];
                if (!('selectedKeys' in _this.props)) {
                    _this.setState({ selectedKeys: [key] });
                }
                onSelect && onSelect([key], extra);
            }
        };
        _this.handleCheck = function (checked, key, e) {
            var checkedStrategy = _this.getMergedProps().checkedStrategy;
            var _a = _this.props, onCheck = _a.onCheck, checkStrictly = _a.checkStrictly;
            var extra = { e: e, node: _this.cacheNodes[key] };
            var checkedKeys = _this.state.checkedKeys;
            var halfCheckedKeys = _this.state.halfCheckedKeys;
            if (checkStrictly) {
                if (checked) {
                    checkedKeys = checkedKeys.concat(key);
                }
                else {
                    checkedKeys = checkedKeys.filter(function (item) { return item !== key; });
                }
                var newState = {};
                if (!('checkedKeys' in _this.props)) {
                    newState.checkedKeys = checkedKeys;
                }
                if (!('halfCheckedKeys' in _this.props)) {
                    newState.halfCheckedKeys = halfCheckedKeys;
                }
                if (!isEmptyObject(newState)) {
                    _this.setState(__assign({}, newState));
                }
            }
            else {
                // ????????????????????????????????????
                var _b = getAllCheckedKeysByCheck(key, checked, checkedKeys, _this.key2nodeProps, halfCheckedKeys), newCheckedKeys = _b.checkedKeys, indeterminateKeys = _b.indeterminateKeys;
                checkedKeys = newCheckedKeys;
                halfCheckedKeys = indeterminateKeys;
                if (!('checkedKeys' in _this.props)) {
                    _this.setState({ checkedKeys: checkedKeys, halfCheckedKeys: halfCheckedKeys });
                }
                else {
                    _this.setState({ halfCheckedKeys: halfCheckedKeys });
                }
                if (checkedStrategy === Tree.SHOW_PARENT) {
                    checkedKeys = checkedKeys.filter(function (x) {
                        var item = _this.key2nodeProps[x];
                        if (!item || checkedKeys.indexOf(item.parentKey) === -1) {
                            return true;
                        }
                    });
                }
                else if (checkedStrategy === Tree.SHOW_CHILD) {
                    checkedKeys = checkedKeys.filter(function (x) {
                        var item = _this.key2nodeProps[x];
                        if (!item || !item.children || !item.children.length) {
                            return true;
                        }
                    });
                }
            }
            onCheck &&
                onCheck(checkedKeys, __assign({ checkedNodes: checkedKeys.map(function (x) { return _this.cacheNodes[x]; }).filter(function (x) { return x; }), checked: checked, halfCheckedKeys: halfCheckedKeys, halfCheckedNodes: halfCheckedKeys.map(function (x) { return _this.cacheNodes[x]; }).filter(function (x) { return x; }) }, extra));
        };
        _this.handleLoadMore = function (node) {
            var loadMore = _this.props.loadMore;
            if (isFunction(loadMore)) {
                var _a = _this.state, _b = _a.loadingKeys, loadingKeys = _b === void 0 ? [] : _b, loadedKeys = _a.loadedKeys;
                _this.setState({
                    loadingKeys: Array.from(new Set(__spreadArray(__spreadArray([], __read(loadingKeys), false), [node._key], false))),
                    loadedKeys: loadedKeys.filter(function (x) { return x !== node._key; }),
                }, function () { return __awaiter(_this, void 0, void 0, function () {
                    var e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, loadMore(this.cacheNodes[node._key])];
                            case 1:
                                _a.sent();
                                this.setState({
                                    loadedKeys: Array.from(new Set(__spreadArray(__spreadArray([], __read(this.state.loadedKeys), false), [node._key], false))),
                                    loadingKeys: this.state.loadingKeys.filter(function (x) { return x !== node._key; }),
                                });
                                this.handleExpand(!node.expanded, node._key);
                                return [3 /*break*/, 3];
                            case 2:
                                e_1 = _a.sent();
                                console.error('[tree]load data error: ', e_1);
                                this.setState({
                                    loadingKeys: this.state.loadingKeys.filter(function (x) { return x !== node._key; }),
                                });
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
            }
        };
        _this.handleNodeDragStart = function (e, node) {
            _this.dragNode = _this.cacheNodes[node._key];
            _this.dropPosition = 0;
            var onDragStart = _this.props.onDragStart;
            onDragStart && onDragStart(e, _this.cacheNodes[node._key]);
        };
        _this.handleNodeDragEnd = function (e, node) {
            _this.dragNode = null;
            _this.dropPosition = 0;
            var onDragEnd = _this.props.onDragEnd;
            onDragEnd && onDragEnd(e, _this.cacheNodes[node._key]);
        };
        _this.handleNodeDragOver = function (e, node, dropPosition) {
            _this.dropPosition = dropPosition;
            var onDragOver = _this.props.onDragOver;
            onDragOver && onDragOver(e, _this.cacheNodes[node._key]);
        };
        _this.handleNodeDragLeave = function (e, node) {
            // this.dropNode = null;
            _this.dropPosition = 0;
            var onDragLeave = _this.props.onDragLeave;
            onDragLeave && onDragLeave(e, _this.cacheNodes[node._key]);
        };
        _this.isChildOfNode = function (node, target) {
            var current = _this.key2nodeProps[node.parentKey];
            while (current) {
                var _key = current._key, parentKey = current.parentKey;
                if (_key === target.props._key) {
                    return true;
                }
                if (parentKey === _key)
                    return;
                current = _this.key2nodeProps[parentKey];
            }
        };
        _this.isSameNode = function (node1, node2) {
            // ?????? node
            if (node1 === undefined || node2 === undefined)
                return false;
            if (node1 === node2)
                return true;
            // ?????? node.key
            var key1 = node1.key;
            var key2 = node2.key;
            if (key1 !== undefined || key2 !== undefined)
                return key1 === key2;
            // ?????? node.props._key
            var _key1 = node1.props._key;
            var _key2 = node2.props._key;
            if (_key1 === undefined && _key2 === undefined)
                return false;
            return _key1 === _key2;
        };
        _this.handleNodeDrop = function (e, node, dropPosition) {
            if (_this.dragNode) {
                var allowDrop = _this.getMergedProps().allowDrop;
                var onDrop = _this.props.onDrop;
                var nodeInstance = _this.cacheNodes[node._key];
                if (onDrop &&
                    !_this.isChildOfNode(node, _this.dragNode) &&
                    !_this.isSameNode(_this.dragNode, nodeInstance)) {
                    if (allowDrop &&
                        !allowDrop({ dropNode: nodeInstance, dragNode: _this.dragNode, dropPosition: dropPosition })) {
                        return;
                    }
                    onDrop({
                        dragNode: _this.dragNode,
                        dropNode: nodeInstance,
                        dropPosition: dropPosition,
                        e: e,
                    });
                }
            }
        };
        _this.handleAllowDrop = function (node, dropPosition) {
            var allowDrop = _this.getMergedProps().allowDrop;
            var isAllowDrop = true;
            if (typeof allowDrop === 'function') {
                isAllowDrop = allowDrop({
                    dropNode: _this.cacheNodes[node._key],
                    dragNode: _this.dragNode,
                    dropPosition: dropPosition,
                });
            }
            return isAllowDrop;
        };
        _this.handleExpand = function (expanded, key) {
            var _a = _this.state, currentExpandKeys = _a.currentExpandKeys, _b = _a.expandedKeys, expandedKeys = _b === void 0 ? [] : _b;
            var onExpand = _this.props.onExpand;
            if (currentExpandKeys.indexOf(key) > -1) {
                // ????????????key??????????????????/???????????????????????????
                return;
            }
            var newExpandedKeys = [];
            if (expanded) {
                newExpandedKeys = Array.from(new Set(__spreadArray(__spreadArray([], __read(expandedKeys), false), [key], false)));
            }
            else {
                newExpandedKeys = expandedKeys.filter(function (k) { return k !== key; });
            }
            if (!('expandedKeys' in _this.props)) {
                _this.setState({
                    expandedKeys: newExpandedKeys,
                    currentExpandKeys: __spreadArray(__spreadArray([], __read(currentExpandKeys), false), [key], false),
                });
            }
            onExpand &&
                onExpand(newExpandedKeys, {
                    expanded: expanded,
                    node: _this.cacheNodes[key],
                    expandedNodes: newExpandedKeys.map(function (x) { return _this.cacheNodes[x]; }).filter(function (x) { return x; }),
                });
        };
        // ??????????????????expandedKeysSet
        _this.getNodeProps = function (nodeProps, expandedKeysSet) {
            var autoExpandParent = _this.getMergedProps().autoExpandParent;
            var loadMore = _this.props.loadMore;
            var _a = _this.state, selectedKeys = _a.selectedKeys, expandedKeys = _a.expandedKeys, checkedKeys = _a.checkedKeys, halfCheckedKeys = _a.halfCheckedKeys, _b = _a.loadingKeys, loadingKeys = _b === void 0 ? [] : _b, _c = _a.loadedKeys, loadedKeys = _c === void 0 ? [] : _c;
            var hasChildren = nodeProps.children && nodeProps.children.length;
            var otherProps = {
                isLeaf: !hasChildren,
                autoExpandParent: hasChildren ? autoExpandParent : false,
                expanded: expandedKeysSet
                    ? expandedKeysSet.has(nodeProps._key)
                    : expandedKeys.indexOf(nodeProps._key) > -1,
            };
            if (loadMore) {
                var loaded = loadedKeys.indexOf(nodeProps._key) > -1;
                otherProps.loaded = loaded;
                otherProps.isLeaf = hasChildren ? false : nodeProps.isLeaf;
            }
            return __assign(__assign(__assign({}, nodeProps), otherProps), { selected: selectedKeys && selectedKeys.indexOf(nodeProps._key) > -1, indeterminated: (halfCheckedKeys === null || halfCheckedKeys === void 0 ? void 0 : halfCheckedKeys.indexOf(nodeProps._key)) > -1, loading: loadingKeys.indexOf(nodeProps._key) > -1, checked: checkedKeys && checkedKeys.indexOf(nodeProps._key) > -1, selectedKeys: selectedKeys, checkedKeys: checkedKeys, loadingKeys: loadingKeys, loadedKeys: loadedKeys, expandedKeys: _this.state.expandedKeys, childrenData: nodeProps.children || [], children: null });
        };
        _this.handleExpandEnd = function (key) {
            var currentExpandKeys = _this.state.currentExpandKeys;
            if (currentExpandKeys.indexOf(key) > -1) {
                _this.setState({
                    currentExpandKeys: currentExpandKeys.filter(function (v) { return v !== key; }),
                });
            }
        };
        // ??????tree???state?????????????????????????????????
        _this.getTreeState = function () {
            return _this.state;
        };
        _this.state = {};
        var treeData = _this.getTreeData();
        var nodeList = _this.getNodeList(treeData, context.getPrefixCls('tree'));
        var _a = _this.getInitCheckedKeys(props.checkedKeys || props.defaultCheckedKeys || []), checkedKeys = _a.checkedKeys, halfCheckedKeys = _a.halfCheckedKeys;
        _this.state = {
            selectedKeys: props.selectedKeys || props.defaultSelectedKeys || [],
            checkedKeys: checkedKeys,
            halfCheckedKeys: halfCheckedKeys,
            expandedKeys: _this.getInitExpandedKeys(props.expandedKeys || props.defaultExpandedKeys),
            loadedKeys: [],
            loadingKeys: [],
            currentExpandKeys: [],
            nodeList: nodeList,
        };
        return _this;
    }
    Tree.getDerivedStateFromProps = function (nextProps, state) {
        var newState = {};
        if ('selectedKeys' in nextProps && !isEqualWith(nextProps.selectedKeys, state.selectedKeys)) {
            newState.selectedKeys = nextProps.selectedKeys || [];
        }
        if (Object.keys(newState).length) {
            return newState;
        }
        return null;
    };
    Tree.prototype.componentDidUpdate = function (prevProps) {
        // ?????? componentWillReceiveProps ??????
        var _this = this;
        var prevMergedProps = this.getMergedProps(prevProps);
        var mergedProps = this.getMergedProps();
        if (prevProps !== this.props || !isEqualWith(prevMergedProps, mergedProps)) {
            var newState_1 = {};
            if (this.needUpdateTreeData(__assign({ prevMergedProps: prevMergedProps }, prevProps), __assign(__assign({}, mergedProps), this.props))) {
                var treeData = this.getTreeData();
                var nodeList = this.getNodeList(treeData);
                newState_1.treeData = treeData;
                newState_1.nodeList = nodeList;
            }
            if (newState_1.treeData ||
                ('checkedKeys' in this.props && !isEqualWith(prevProps.checkedKeys, this.props.checkedKeys))) {
                // ??????treeData??????????????????????????????checkedKeys
                var currentCheckedKeys = 'checkedKeys' in this.props ? this.props.checkedKeys : this.state.checkedKeys;
                var _a = this.getInitCheckedKeys(currentCheckedKeys || []), halfCheckedKeys = _a.halfCheckedKeys, checkedKeys = _a.checkedKeys;
                if (!isEqualWith(checkedKeys, this.state.checkedKeys)) {
                    newState_1.checkedKeys = checkedKeys;
                }
                if (!isEqualWith(halfCheckedKeys, this.state.halfCheckedKeys)) {
                    newState_1.halfCheckedKeys = halfCheckedKeys;
                }
            }
            if (this.props.checkStrictly &&
                'halfCheckedKeys' in this.props &&
                !isEqualWith(prevProps.halfCheckedKeys, this.props.halfCheckedKeys)) {
                newState_1.halfCheckedKeys = this.props.halfCheckedKeys;
            }
            if ('expandedKeys' in this.props &&
                !isEqualWith(this.props.expandedKeys, prevProps.expandedKeys)) {
                newState_1.expandedKeys = this.props.expandedKeys;
                // ????????????expandKeys???????????????????????????????????????/???????????????
                // ?????? [...[1, 2, 3], ...[1, 3, 4]] ????????? 2 ????????????4????????????
                // ?????????????????????????????????/?????????????????????????????????????????? currentExpandKeys ?????????
                newState_1.currentExpandKeys = __spreadArray(__spreadArray([], __read(newState_1.expandedKeys), false), __read(this.state.expandedKeys), false).reduce(function (total, next) {
                    var index = total.indexOf(next);
                    if (index === -1) {
                        total.push(next);
                    }
                    else {
                        total.splice(index, 1);
                    }
                    return total;
                }, [])
                    .filter(function (key, _, array) {
                    var _a;
                    if (_this.key2nodeProps[key]) {
                        var pathParentKeys = _this.key2nodeProps[key].pathParentKeys;
                        if (pathParentKeys.some(function (x) { return array.indexOf(x) > -1; })) {
                            return false;
                        }
                        return (_a = _this.key2nodeProps[key].children) === null || _a === void 0 ? void 0 : _a.length;
                    }
                });
            }
            var currentExpandKeys = newState_1.currentExpandKeys || this.state.currentExpandKeys;
            if (newState_1.treeData && currentExpandKeys) {
                newState_1.currentExpandKeys = currentExpandKeys.filter(function (key) {
                    var item = newState_1.treeData.find(function (node) { return node._key === key; });
                    return item && item.children && item.children.length;
                });
            }
            if (Object.keys(newState_1).length) {
                this.setState(newState_1);
            }
        }
    };
    Tree.prototype.render = function () {
        var _a;
        var _this = this;
        // render ?????????????????????NodeList?????????????????????
        this.cacheNodes = {};
        var _b = this.getMergedProps(), className = _b.className, showLine = _b.showLine, size = _b.size, _virtualListProps = _b.virtualListProps, height = _b.height, style = _b.style, icons = _b.icons, actionOnClick = _b.actionOnClick;
        var _c = this.props, loadMore = _c.loadMore, checkable = _c.checkable;
        // ????????? APi : height
        var virtualListProps = _virtualListProps
            ? __assign({ threshold: 100 }, _virtualListProps) : height
            ? { height: height, threshold: 100 }
            : {
                threshold: null,
            };
        var getPrefixCls = this.context.getPrefixCls;
        var prefixCls = getPrefixCls('tree');
        return (React.createElement(TreeContext.Provider, { value: {
                icons: icons,
                key2nodeProps: this.key2nodeProps,
                getFieldInfo: this.getFieldInfo,
                getTreeState: this.getTreeState,
                getNodeProps: this.getNodeProps,
                onExpandEnd: this.handleExpandEnd,
                onSelect: this.handleSelect,
                onCheck: this.handleCheck,
                onNodeDragStart: this.handleNodeDragStart,
                onNodeDragEnd: this.handleNodeDragEnd,
                onNodeDragLeave: this.handleNodeDragLeave,
                onNodeDragOver: this.handleNodeDragOver,
                onNodeDrop: this.handleNodeDrop,
                onExpand: this.handleExpand,
                renderExtra: this.props.renderExtra,
                renderTitle: this.props.renderTitle,
                loadMore: loadMore && this.handleLoadMore,
                allowDrop: this.handleAllowDrop,
                actionOnClick: actionOnClick,
                virtualListProps: virtualListProps,
            } },
            React.createElement(NodeList, { ref: function (node) {
                    _this.nodeListRef = node;
                }, className: cs(prefixCls, (_a = {},
                    _a[prefixCls + "-checkable"] = checkable,
                    _a[prefixCls + "-show-line"] = showLine,
                    _a[prefixCls + "-size-" + size] = size,
                    _a), className), style: style, filterNode: this.props.filterNode, virtualListProps: virtualListProps, expandedKeys: this.state.expandedKeys, currentExpandKeys: this.state.currentExpandKeys, getNodeProps: this.getNodeProps, nodeList: this.state.nodeList, onMouseDown: this.props.onMouseDown, saveCacheNode: function (node) {
                    _this.cacheNodes[node.key] = node;
                }, ariaProps: {
                    role: 'tree',
                    'aria-multiselectable': this.props.multiple,
                    tabIndex: 0,
                } })));
    };
    Tree.displayName = 'Tree';
    Tree.SHOW_PARENT = 'parent';
    Tree.SHOW_ALL = 'all';
    Tree.SHOW_CHILD = 'child';
    Tree.Node = Node;
    Tree.contextType = ConfigContext;
    return Tree;
}(Component));
export default Tree;
