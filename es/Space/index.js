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
import React, { useContext, Fragment, forwardRef } from 'react';
import cs from '../_util/classNames';
import { ConfigContext } from '../ConfigProvider';
import { isArray, isNumber } from '../_util/is';
import useMergeProps from '../_util/hooks/useMergeProps';
var defaultProps = {
    size: 'small',
    direction: 'horizontal',
};
function Space(baseProps, ref) {
    var _a;
    var _b = useContext(ConfigContext), getPrefixCls = _b.getPrefixCls, componentConfig = _b.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Space);
    var className = props.className, style = props.style, children = props.children, size = props.size, direction = props.direction, align = props.align, wrap = props.wrap, split = props.split, rest = __rest(props, ["className", "style", "children", "size", "direction", "align", "wrap", "split"]);
    var prefixCls = getPrefixCls('space');
    var innerAlign = align || (direction === 'horizontal' ? 'center' : '');
    var classNames = cs(prefixCls, (_a = {},
        _a[prefixCls + "-" + direction] = direction,
        _a[prefixCls + "-align-" + innerAlign] = innerAlign,
        _a[prefixCls + "-wrap"] = wrap,
        _a), className);
    function getMargin(size) {
        if (isNumber(size)) {
            return size;
        }
        switch (size) {
            case 'mini':
                return 4;
            case 'small':
                return 8;
            case 'medium':
                return 16;
            case 'large':
                return 24;
            default:
                return 8;
        }
    }
    var childrenList = React.Children.toArray(children);
    function getMarginStyle(index) {
        var _a;
        var isLastOne = childrenList.length === index + 1;
        if (typeof size === 'string' || typeof size === 'number') {
            var margin = getMargin(size);
            if (wrap) {
                return isLastOne
                    ? { marginBottom: margin }
                    : {
                        marginRight: margin,
                        marginBottom: margin,
                    };
            }
            return !isLastOne
                ? (_a = {},
                    _a[direction === 'vertical' ? 'marginBottom' : 'marginRight'] = margin,
                    _a) : {};
        }
        if (isArray(size)) {
            var marginRight = getMargin(size[0]);
            var marginBottom = getMargin(size[1]);
            if (wrap) {
                return isLastOne
                    ? { marginBottom: marginBottom }
                    : {
                        marginRight: marginRight,
                        marginBottom: marginBottom,
                    };
            }
            if (direction === 'vertical') {
                return { marginBottom: marginBottom };
            }
            return { marginRight: marginRight };
        }
    }
    return (React.createElement("div", __assign({ ref: ref, className: classNames, style: style }, rest), childrenList.map(function (child, index) {
        var shouldRenderSplit = split !== undefined && split !== null && index > 0;
        return (React.createElement(Fragment, { key: index },
            shouldRenderSplit && React.createElement("div", { className: prefixCls + "-item-split" }, split),
            React.createElement("div", { className: prefixCls + "-item", style: getMarginStyle(index) }, child)));
    })));
}
var SpaceComponent = forwardRef(Space);
SpaceComponent.displayName = 'Space';
export default SpaceComponent;
