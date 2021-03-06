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
import React, { useContext, useMemo, useState } from 'react';
import cs from '../../_util/classNames';
import IconRight from '../../../icon/react-icon/IconRight';
import IconDown from '../../../icon/react-icon/IconDown';
import { isChildrenSelected } from '../util';
import omit from '../../_util/omit';
import Dropdown from '../../Dropdown';
import Menu from '../index';
import MenuIndent from '../indent';
import MenuContext from '../context';
import { useHotkeyHandler } from '../hotkey';
var globalPopSubMenuIndex = 0;
var SubMenuPop = function (props) {
    var _a;
    var _key = props._key, children = props.children, style = props.style, className = props.className, title = props.title, level = props.level, selectable = props.selectable, forwardedRef = props.forwardedRef, propTriggerProps = props.triggerProps;
    var _b = useContext(MenuContext), menuId = _b.id, prefixCls = _b.prefixCls, mode = _b.mode, inDropdown = _b.inDropdown, levelIndent = _b.levelIndent, hotkeyInfo = _b.hotkeyInfo, _c = _b.selectedKeys, selectedKeys = _c === void 0 ? [] : _c, icons = _b.icons, contextTriggerProps = _b.triggerProps, onClickSubMenu = _b.onClickSubMenu, onClickMenuItem = _b.onClickMenuItem;
    var triggerProps = __assign(__assign({}, contextTriggerProps), propTriggerProps);
    var _d = __read(useState(false), 2), popupVisible = _d[0], setPopupVisible = _d[1];
    var baseClassName = prefixCls + "-pop";
    var isSelected = selectable && selectedKeys.indexOf(props._key) > -1;
    var needPopOnBottom = mode === 'horizontal' && !inDropdown;
    var isActive = useHotkeyHandler(_key, function () {
        setPopupVisible(hotkeyInfo.activeKeyPath.indexOf(_key) > 0);
    });
    // Unique ID of this instance
    var instanceId = useMemo(function () {
        var id = menuId + "-submenu-pop-" + globalPopSubMenuIndex;
        globalPopSubMenuIndex++;
        return id;
    }, []);
    var renderSuffix = function () {
        var MergedIconRight = icons && icons.popArrowRight ? icons.popArrowRight : React.createElement(IconRight, null);
        var MergedIconDown = icons && icons.horizontalArrowDown ? icons.horizontalArrowDown : React.createElement(IconDown, null);
        return (React.createElement("span", { className: prefixCls + "-icon-suffix" }, needPopOnBottom ? MergedIconDown : MergedIconRight));
    };
    var hasSelectedStatus = isChildrenSelected(children, selectedKeys) || isSelected;
    return (React.createElement(Dropdown, { trigger: "hover", onVisibleChange: function (visible) { return setPopupVisible(visible); }, droplist: React.createElement(Menu, { id: instanceId, selectedKeys: selectedKeys, onClickMenuItem: function (key, event) {
                onClickMenuItem(key, event);
                setPopupVisible(false);
            } }, children), triggerProps: __assign({ position: needPopOnBottom ? 'bl' : 'rt', popupVisible: popupVisible, showArrow: true, autoAlignPopupMinWidth: true, classNames: 'fadeIn', duration: 100, mouseEnterDelay: 50, mouseLeaveDelay: 50, className: cs(baseClassName + "-trigger", triggerProps && triggerProps.className) }, omit(triggerProps, ['className'])) },
        React.createElement("div", { "aria-haspopup": true, "aria-expanded": popupVisible, "aria-controls": instanceId, ref: forwardedRef, style: style, className: cs(baseClassName, baseClassName + "-header", (_a = {},
                _a[prefixCls + "-active"] = isActive,
                _a[prefixCls + "-selected"] = hasSelectedStatus,
                _a), className), onClick: function (event) {
                onClickSubMenu(_key, level, 'pop');
                selectable && onClickMenuItem(_key, event);
            } },
            React.createElement(MenuIndent, { prefixCls: prefixCls, levelIndent: levelIndent, level: level }),
            title,
            renderSuffix(),
            hasSelectedStatus && mode === 'horizontal' ? (React.createElement("div", { className: prefixCls + "-selected-label" })) : null)));
};
export default SubMenuPop;
