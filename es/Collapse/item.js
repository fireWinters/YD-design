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
import React, { useContext } from 'react';
import { Transition } from 'react-transition-group';
import cs from '../_util/classNames';
import { CollapseContext } from './collapse';
import { ConfigContext } from '../ConfigProvider';
import IconHover from '../_class/icon-hover';
function Item(props, ref) {
    var _a, _b, _c, _d, _e;
    var _f;
    var getPrefixCls = useContext(ConfigContext).getPrefixCls;
    var ctx = useContext(CollapseContext);
    var children = props.children, name = props.name, header = props.header, className = props.className, style = props.style, contentStyle = props.contentStyle, extra = props.extra, disabled = props.disabled, destroyOnHide = props.destroyOnHide, expandIcon = props.expandIcon, _g = props.showExpandIcon, showExpandIcon = _g === void 0 ? true : _g, rest = __rest(props, ["children", "name", "header", "className", "style", "contentStyle", "extra", "disabled", "destroyOnHide", "expandIcon", "showExpandIcon"]);
    var prefixCls = getPrefixCls('collapse-item');
    var isExpanded = ((_f = ctx.activeKeys) === null || _f === void 0 ? void 0 : _f.indexOf(name)) > -1;
    var icon = showExpandIcon ? ('expandIcon' in props ? expandIcon : ctx.expandIcon) : null;
    return (React.createElement("div", __assign({ ref: ref }, rest, { className: cs(prefixCls, (_a = {},
            _a[prefixCls + "-active"] = isExpanded,
            _a[prefixCls + "-no-icon"] = !icon,
            _a[prefixCls + "-disabled"] = disabled,
            _a), className), style: style }),
        React.createElement("div", { role: "button", "aria-disabled": disabled, "aria-expanded": isExpanded, tabIndex: 0, className: cs(prefixCls + "-header", prefixCls + "-header-" + ctx.expandIconPosition, (_b = {},
                _b[prefixCls + "-header-disabled"] = disabled,
                _b)), onClick: function (e) {
                !disabled && ctx.onToggle(name, e);
            } },
            icon && (React.createElement(IconHover, { prefix: prefixCls, disabled: disabled, className: cs((_c = {},
                    _c[prefixCls + "-icon-hover-right"] = ctx.expandIconPosition === 'right',
                    _c[prefixCls + "-header-icon-right"] = ctx.expandIconPosition === 'right',
                    _c)) },
                React.createElement("span", { className: cs(prefixCls + "-header-icon", (_d = {},
                        _d[prefixCls + "-header-icon-down"] = isExpanded,
                        _d)) }, icon))),
            React.createElement("div", { className: prefixCls + "-header-title" }, header),
            extra && (React.createElement("div", { className: prefixCls + "-header-extra", onClick: function (e) {
                    e.stopPropagation();
                } }, extra))),
        React.createElement(Transition, { in: isExpanded, addEndListener: function (node, done) {
                node.addEventListener('transitionend', done, false);
            }, mountOnEnter: 'destroyOnHide' in props ? destroyOnHide : ctx.destroyOnHide || ctx.lazyload, unmountOnExit: 'destroyOnHide' in props ? destroyOnHide : ctx.destroyOnHide, onEnter: function (e) {
                e.style.height = 0;
                e.style.display = 'block';
            }, onEntering: function (e) {
                e.style.height = e.scrollHeight + "px";
            }, onEntered: function (e) {
                e.style.height = 'auto';
            }, onExit: function (e) {
                e.style.display = 'block';
                e.style.height = e.offsetHeight + "px";
                // have to trigger reflow to get animation effect on exit
                e.offsetHeight; // eslint-disable-line
            }, onExiting: function (e) {
                e.style.height = 0;
            }, onExited: function (e) {
                e.style.display = 'none';
                e.style.height = 'auto';
            } },
            React.createElement("div", { role: "region", className: cs(prefixCls + "-content", (_e = {},
                    _e[prefixCls + "-content-expanded"] = isExpanded,
                    _e)) },
                React.createElement("div", { style: contentStyle, className: prefixCls + "-content-box" }, children)))));
}
var ItemRef = React.forwardRef(Item);
ItemRef.displayName = 'CollapseItem';
export default ItemRef;
