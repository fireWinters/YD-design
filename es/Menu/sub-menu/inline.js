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
import React, { useContext, useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';
import cs from '../../_util/classNames';
import useStateWithPromise from '../../_util/hooks/useStateWithPromise';
import IconDown from '../../../icon/react-icon/IconDown';
import { processChildren, isChildrenSelected, PROPS_NEED_TO_BE_PASSED_IN_SUBMENU } from '../util';
import MenuContext from '../context';
import MenuIndent from '../indent';
import { useHotkeyHandler } from '../hotkey';
import pick from '../../_util/pick';
var globalInlineSubMenuIndex = 0;
var SubMenuInline = function (props) {
    var _a;
    var _key = props._key, children = props.children, style = props.style, className = props.className, title = props.title, level = props.level, forwardedRef = props.forwardedRef, selectable = props.selectable, rest = __rest(props, ["_key", "children", "style", "className", "title", "level", "forwardedRef", "selectable"]);
    var _b = useContext(MenuContext), menuId = _b.id, prefixCls = _b.prefixCls, levelIndent = _b.levelIndent, _c = _b.openKeys, openKeys = _c === void 0 ? [] : _c, _d = _b.selectedKeys, selectedKeys = _d === void 0 ? [] : _d, icons = _b.icons, onClickSubMenu = _b.onClickSubMenu, onClickMenuItem = _b.onClickMenuItem;
    var baseClassName = prefixCls + "-inline";
    var isOpen = (openKeys === null || openKeys === void 0 ? void 0 : openKeys.indexOf(_key)) > -1;
    var isSelected = (selectable && selectedKeys.indexOf(props._key) > -1) ||
        isChildrenSelected(children, selectedKeys);
    var _e = __read(useStateWithPromise(isOpen ? 'auto' : 0), 2), height = _e[0], setHeight = _e[1];
    var subMenuClickHandler = function (event) {
        onClickSubMenu(_key, level, 'inline');
        selectable && onClickMenuItem(_key, event);
    };
    var isActive = useHotkeyHandler(_key, function (isActive, type) { return isActive && type === 'enter' && subMenuClickHandler(null); });
    // Unique ID of this instance
    var instanceId = useMemo(function () {
        var id = menuId + "-submenu-inline-" + globalInlineSubMenuIndex;
        globalInlineSubMenuIndex++;
        return id;
    }, []);
    // Should omit these properties in Menu.Item
    var childrenList = processChildren(children, __assign(__assign({}, pick(rest, PROPS_NEED_TO_BE_PASSED_IN_SUBMENU)), { level: level + 1, selectable: selectable }));
    var header = (React.createElement("div", { "aria-expanded": isOpen, "aria-controls": instanceId, className: cs(baseClassName + "-header", (_a = {},
            _a[prefixCls + "-active"] = isActive,
            _a[prefixCls + "-selected"] = isSelected,
            _a)), onClick: subMenuClickHandler },
        React.createElement(MenuIndent, { level: level, prefixCls: prefixCls, levelIndent: levelIndent }),
        React.createElement("span", null, title),
        React.createElement("span", { className: prefixCls + "-icon-suffix " + (isOpen ? 'is-open' : '') }, icons && icons.horizontalArrowDown ? icons.horizontalArrowDown : React.createElement(IconDown, null))));
    var content = (React.createElement("div", { id: instanceId, className: cs(baseClassName + "-content"), style: { height: height } }, childrenList));
    return (React.createElement("div", { ref: forwardedRef, className: cs(baseClassName, className), style: style },
        header,
        React.createElement(CSSTransition, { in: isOpen, timeout: 200, classNames: baseClassName, unmountOnExit: false, onEnter: function (element) {
                setHeight(0).then(function () {
                    setHeight(element.scrollHeight);
                });
            }, onEntered: function () {
                setHeight('auto');
            }, onExit: function (element) {
                setHeight(element.scrollHeight).then(function () {
                    setHeight(0);
                });
            } }, content)));
};
export default SubMenuInline;
