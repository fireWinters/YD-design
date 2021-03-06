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
import React, { useState, useEffect, useContext, useCallback } from 'react';
import debounce from 'lodash/debounce';
import IconLoading from '../../icon/react-icon/IconLoading';
import cs from '../_util/classNames';
import { ConfigContext } from '../ConfigProvider';
import DotLoading from './dot-loading';
import useMergeProps from '../_util/hooks/useMergeProps';
function Spin(baseProps, ref) {
    var _a;
    var _b = useContext(ConfigContext), getPrefixCls = _b.getPrefixCls, componentConfig = _b.componentConfig;
    var props = useMergeProps(baseProps, {}, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Spin);
    var style = props.style, className = props.className, children = props.children, propLoading = props.loading, size = props.size, icon = props.icon, element = props.element, tip = props.tip, dot = props.dot, delay = props.delay, _c = props.block, block = _c === void 0 ? false : _c;
    var _d = __read(useState(delay ? false : propLoading), 2), loading = _d[0], setLoading = _d[1];
    var debouncedSetLoading = useCallback(debounce(setLoading, delay), [delay]);
    var _usedLoading = delay ? loading : propLoading;
    var prefixCls = getPrefixCls('spin');
    useEffect(function () {
        delay && debouncedSetLoading(propLoading);
        return function () {
            debouncedSetLoading && debouncedSetLoading.cancel();
        };
    }, [propLoading]);
    var loadingIcon = (React.createElement("span", { className: prefixCls + "-icon" }, icon
        ? React.cloneElement(icon, {
            className: cs(prefixCls.replace('-spin', '-icon') + "-loading"),
            style: {
                fontSize: size,
            },
        })
        : element ||
            (dot ? React.createElement(DotLoading, { size: size }) : React.createElement(IconLoading, { style: { fontSize: size } }))));
    return (React.createElement("div", { ref: ref, className: cs(prefixCls, (_a = {},
            _a[prefixCls + "-block"] = block,
            _a[prefixCls + "-loading"] = _usedLoading,
            _a[prefixCls + "-with-tip"] = tip && !children,
            _a), className), style: style }, children ? (React.createElement(React.Fragment, null,
        React.createElement("div", { className: prefixCls + "-children" }, children),
        _usedLoading && (React.createElement("div", { className: prefixCls + "-loading-layer", style: { fontSize: size } },
            React.createElement("span", { className: prefixCls + "-loading-layer-inner" },
                loadingIcon,
                tip ? React.createElement("div", { className: prefixCls + "-tip" }, tip) : null))))) : (React.createElement(React.Fragment, null,
        loadingIcon,
        tip ? React.createElement("div", { className: prefixCls + "-tip" }, tip) : null))));
}
var SpinComponent = React.forwardRef(Spin);
SpinComponent.displayName = 'Spin';
export default SpinComponent;
