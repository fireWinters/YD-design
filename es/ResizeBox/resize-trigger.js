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
import React, { useContext } from 'react';
import cs from '../_util/classNames';
import ResizeObserver from '../_util/resizeObserver';
import { ConfigContext } from '../ConfigProvider';
import IconDragDotVertical from '../../icon/react-icon/IconDragDotVertical';
import IconDragDot from '../../icon/react-icon/IconDragDot';
import IconCaretRight from '../../icon/react-icon/IconCaretRight';
import IconCaretLeft from '../../icon/react-icon/IconCaretLeft';
import IconCaretDown from '../../icon/react-icon/IconCaretDown';
import IconCareUp from '../../icon/react-icon/IconCaretUp';
import { isFunction, isObject } from '../_util/is';
export default function ResizeTrigger(props) {
    var _a;
    var className = props.className, direction = props.direction, icon = props.icon, onMouseDown = props.onMouseDown, onResize = props.onResize, children = props.children, _b = props.collapsible, collapsible = _b === void 0 ? {} : _b, _c = props.resizable, resizable = _c === void 0 ? true : _c, renderChildren = props.renderChildren;
    var getPrefixCls = useContext(ConfigContext).getPrefixCls;
    var prefixCls = getPrefixCls('resizebox-trigger');
    var isHorizontal = direction === 'horizontal';
    var classNames = cs(prefixCls, prefixCls + "-" + (isHorizontal ? 'horizontal' : 'vertical'), (_a = {}, _a[prefixCls + "-not-resizable"] = !resizable, _a), className);
    var prevCollapsedConfig = isObject(collapsible.prev)
        ? __assign(__assign({}, collapsible.prev), { icon: collapsible.prev.icon || (isHorizontal ? React.createElement(IconCareUp, null) : React.createElement(IconCaretLeft, null)) }) : {};
    var nextCollapsedConfig = isObject(collapsible.next)
        ? __assign(__assign({}, collapsible.next), { icon: collapsible.next.icon || (isHorizontal ? React.createElement(IconCaretDown, null) : React.createElement(IconCaretRight, null)) }) : {};
    var renderPrevCollapsedTrigger = function () {
        // 1. ?????????prev
        // ??????????????????????????????????????????????????????????????????
        if ((prevCollapsedConfig.icon && !prevCollapsedConfig.collapsed) ||
            nextCollapsedConfig.collapsed) {
            return (React.createElement("span", { className: cs(prefixCls + "-icon", cs(prefixCls + "-prev")), onClick: prevCollapsedConfig.onClick }, prevCollapsedConfig.icon));
        }
        return React.createElement("span", { className: cs(prefixCls + "-icon-empty") });
    };
    var renderNextCollapsedTrigger = function () {
        if ((nextCollapsedConfig.icon && !nextCollapsedConfig.collapsed) ||
            prevCollapsedConfig.collapsed) {
            return (React.createElement("span", { className: cs(prefixCls + "-icon", cs(prefixCls + "-next")), onClick: nextCollapsedConfig.onClick }, nextCollapsedConfig.icon));
        }
        return React.createElement("span", { className: cs(prefixCls + "-icon-empty") });
    };
    var renderResizeTrigger = function () {
        if (resizable) {
            return (React.createElement("span", { className: prefixCls + "-icon" }, icon || (isHorizontal ? React.createElement(IconDragDot, null) : React.createElement(IconDragDotVertical, null))));
        }
        return React.createElement("span", { className: cs(prefixCls + "-icon-empty") });
    };
    var prev = renderPrevCollapsedTrigger();
    var trigger = renderResizeTrigger();
    var next = renderNextCollapsedTrigger();
    var renderIcon = function () {
        return (React.createElement("div", { className: prefixCls + "-icon-wrapper" },
            prev,
            trigger,
            next));
    };
    if (!resizable) {
        return (React.createElement("div", { className: classNames }, isFunction(renderChildren)
            ? renderChildren(prev, trigger, next)
            : children || renderIcon()));
    }
    return (React.createElement(ResizeObserver, { onResize: onResize },
        React.createElement("div", { className: classNames, onMouseDown: onMouseDown }, isFunction(renderChildren)
            ? renderChildren(prev, trigger, next)
            : children || renderIcon())));
}
