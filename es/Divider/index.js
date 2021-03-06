import React, { useContext, forwardRef } from 'react';
import cs from '../_util/classNames';
import { ConfigContext } from '../ConfigProvider';
import useMergeProps from '../_util/hooks/useMergeProps';
var defaultProps = {
    type: 'horizontal',
    orientation: 'center',
};
function Divider(baseProps, ref) {
    var _a;
    var _b = useContext(ConfigContext), getPrefixCls = _b.getPrefixCls, componentConfig = _b.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Divider);
    var children = props.children, style = props.style, className = props.className, type = props.type, orientation = props.orientation;
    var prefixCls = getPrefixCls('divider');
    var classNames = cs(prefixCls, prefixCls + "-" + type, (_a = {},
        _a[prefixCls + "-with-text"] = children,
        _a[prefixCls + "-with-text-" + orientation] = children && orientation,
        _a), className);
    return (React.createElement("div", { role: "separator", ref: ref, className: classNames, style: style }, children && type === 'horizontal' ? (React.createElement("span", { className: prefixCls + "-text " + prefixCls + "-text-" + orientation }, children)) : null));
}
var DividerComponent = forwardRef(Divider);
DividerComponent.displayName = 'Divider';
export default DividerComponent;
