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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useContext, useRef } from 'react';
import Trigger, { EventsByTriggerNeed } from '../Trigger';
import Button from './button';
import { ConfigContext } from '../ConfigProvider';
import cs from '../_util/classNames';
import useMergeValue from '../_util/hooks/useMergeValue';
import omit from '../_util/omit';
import pick from '../_util/pick';
import useMergeProps from '../_util/hooks/useMergeProps';
var defaultProps = {
    position: 'bl',
    trigger: 'hover',
    unmountOnExit: true,
};
function Dropdown(baseProps, _) {
    var _a;
    var _b = useContext(ConfigContext), getPrefixCls = _b.getPrefixCls, componentConfig = _b.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Button);
    var trigger = props.trigger, droplist = props.droplist, children = props.children, position = props.position, disabled = props.disabled, unmountOnExit = props.unmountOnExit, triggerProps = props.triggerProps, getPopupContainer = props.getPopupContainer, onVisibleChange = props.onVisibleChange, rest = __rest(props, ["trigger", "droplist", "children", "position", "disabled", "unmountOnExit", "triggerProps", "getPopupContainer", "onVisibleChange"]);
    var prefixCls = getPrefixCls('dropdown');
    var triggerRef = useRef(null);
    var _c = __read(useMergeValue(false, {
        defaultValue: props.defaultPopupVisible,
        value: props.popupVisible,
    }), 2), popupVisible = _c[0], setPopupVisible = _c[1];
    var getPopupContent = function () {
        return React.Children.only(droplist || React.createElement("span", null));
    };
    var changePopupVisible = function (visible) {
        setPopupVisible(visible);
        onVisibleChange && onVisibleChange(visible);
        triggerProps && triggerProps.onVisibleChange && triggerProps.onVisibleChange(visible);
    };
    var handleVisibleChange = function (visible) {
        if (visible !== popupVisible) {
            changePopupVisible(visible);
        }
    };
    var renderPopup = function () {
        var content = getPopupContent();
        return content && content.props.isMenu
            ? React.cloneElement(content, {
                prefixCls: prefixCls + "-menu",
                inDropdown: true,
                selectable: false,
                onClickMenuItem: function () {
                    var _a;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var returnValueOfOnClickMenuItem = null;
                    // Trigger onClickMenuItem first
                    var content = getPopupContent();
                    if (content.props.onClickMenuItem) {
                        returnValueOfOnClickMenuItem = (_a = content.props).onClickMenuItem.apply(_a, __spreadArray([], __read(args), false));
                    }
                    // Set focus to avoid onblur
                    var child = triggerRef.current && triggerRef.current.getRootElement();
                    child && child.focus && child.focus();
                    // Trigger onVisibleChange. Outer component can determine whether to change the state based on the current visibility value.
                    if (returnValueOfOnClickMenuItem instanceof Promise) {
                        returnValueOfOnClickMenuItem.finally(function () { return changePopupVisible(false); });
                    }
                    else if (returnValueOfOnClickMenuItem !== false) {
                        changePopupVisible(false);
                    }
                },
            })
            : content;
    };
    return (React.createElement(Trigger, __assign({ ref: function (ref) { return (triggerRef.current = ref); }, classNames: "slideDynamicOrigin", childrenPrefix: prefixCls, trigger: trigger, popup: renderPopup, mouseEnterDelay: 400, mouseLeaveDelay: 400, disabled: disabled, unmountOnExit: unmountOnExit, position: position, popupVisible: popupVisible, popupAlign: {
            left: 4,
            right: 4,
            top: 4,
            bottom: 4,
        }, getPopupContainer: getPopupContainer, alignPoint: trigger === 'contextMenu' }, pick(rest, EventsByTriggerNeed), omit(triggerProps, ['onVisibleChange']), { onVisibleChange: handleVisibleChange }), React.isValidElement(children)
        ? React.cloneElement(children, {
            disabled: disabled,
            className: cs((_a = {},
                _a[prefixCls + "-popup-visible"] = popupVisible,
                _a), children.props.className),
        })
        : children));
}
var ForwardRefDropdown = React.forwardRef(Dropdown);
var DropdownComponent = ForwardRefDropdown;
DropdownComponent.displayName = 'Dropdown';
DropdownComponent.Button = Button;
export default DropdownComponent;
