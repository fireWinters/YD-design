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
import React, { useState, useRef, useContext, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import SubMenu from './sub-menu';
import { getStyle } from '../_util/style';
import MenuContext from './context';
var OVERFLOW_THRESHOLD = 10;
function getNodeWidth(node) {
    return node && +node.getBoundingClientRect().width.toFixed(2);
}
function translatePxToNumber(str) {
    var result = Number(str.replace('px', ''));
    return isNaN(result) ? 0 : result;
}
var OverflowWrap = function (props) {
    var children = props.children;
    var prefixCls = useContext(MenuContext).prefixCls;
    var refUl = useRef(null);
    var refResizeObserver = useRef(null);
    var _a = __read(useState(null), 2), lastVisibleIndex = _a[0], setLastVisibleIndex = _a[1];
    var overflowSubMenuClass = prefixCls + "-overflow-sub-menu";
    var overflowMenuItemClass = prefixCls + "-overflow-hidden-menu-item";
    var overflowSubMenuMirrorClass = prefixCls + "-overflow-sub-menu-mirror";
    useEffect(function () {
        var ulElement = refUl.current;
        computeLastVisibleIndex();
        refResizeObserver.current = new ResizeObserver(function (entries) {
            entries.forEach(computeLastVisibleIndex);
        });
        refResizeObserver.current.observe(ulElement);
        return function () {
            if (refResizeObserver.current) {
                refResizeObserver.current.disconnect();
            }
        };
    }, [children]);
    function computeLastVisibleIndex() {
        if (!refUl.current) {
            return;
        }
        var ulElement = refUl.current;
        var maxWidth = getNodeWidth(ulElement) - OVERFLOW_THRESHOLD;
        var childNodeList = [].slice.call(ulElement.children);
        var menuItemIndex = 0;
        var currentItemRight = 0;
        var overflowSubMenuWidth = 0;
        // ?????? childrenNodeList.length !== React.Children.count(children) ??????????????? menuItemIndex ?????????????????? MenuItem ??????
        for (var i = 0; i < childNodeList.length; i++) {
            var node = childNodeList[i];
            var classNames = node.className.split(' ');
            var isOverflowSubMenu = classNames.indexOf(overflowSubMenuClass) > -1;
            var isOverflowSubMenuMirror = classNames.indexOf(overflowSubMenuMirrorClass) > -1;
            // ?????? overflowSubMenu ????????????????????????????????? overflowSubMenuMirror
            if (isOverflowSubMenu) {
                continue;
            }
            var nodeWidth = getNodeWidth(node) +
                translatePxToNumber(getStyle(node, 'marginLeft')) +
                translatePxToNumber(getStyle(node, 'marginRight'));
            if (isOverflowSubMenuMirror) {
                overflowSubMenuWidth = nodeWidth;
                continue;
            }
            currentItemRight += nodeWidth;
            // ????????????????????????
            if (currentItemRight > maxWidth) {
                setLastVisibleIndex(
                // ?????????????????????????????????????????? ... ?????????????????????
                menuItemIndex - (currentItemRight - nodeWidth + overflowSubMenuWidth <= maxWidth ? 1 : 2));
                return;
            }
            menuItemIndex++;
        }
        // ????????????
        setLastVisibleIndex(null);
    }
    var renderOverflowSubMenu = function (children, isMirror) {
        if (isMirror === void 0) { isMirror = false; }
        return (React.createElement(SubMenu, __assign({ title: React.createElement("span", null, "\u00B7\u00B7\u00B7"), key: "arco-menu-overflow-sub-menu" + (isMirror ? '-mirror' : ''), className: isMirror ? overflowSubMenuMirrorClass : overflowSubMenuClass }, props, { children: children })));
    };
    var renderChildren = function () {
        var overflowSubMenu = null;
        var overflowSubMenuMirror = renderOverflowSubMenu(null, true);
        var originMenuItems = React.Children.map(children, function (child, index) {
            var item = child;
            if (lastVisibleIndex !== null) {
                if (index > lastVisibleIndex) {
                    item = React.cloneElement(child, {
                        className: overflowMenuItemClass,
                    });
                }
                if (index === lastVisibleIndex + 1) {
                    var overflowedItems = React.Children.toArray(children)
                        .slice(lastVisibleIndex + 1)
                        .map(function (child) {
                        return React.cloneElement(child, { key: child.props._key });
                    });
                    overflowSubMenu = renderOverflowSubMenu(overflowedItems);
                }
            }
            return item;
        });
        return __spreadArray(__spreadArray([overflowSubMenuMirror], __read(originMenuItems), false), [overflowSubMenu], false);
    };
    return (React.createElement("div", { className: prefixCls + "-overflow-wrap", ref: refUl }, renderChildren()));
};
export default OverflowWrap;
