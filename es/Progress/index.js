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
import React, { forwardRef, useContext } from 'react';
import cs from '../_util/classNames';
import { ConfigContext } from '../ConfigProvider';
import LineProgress from './line-progess';
import CircleProgress from './circle-progress';
import StepsProgress from './steps-progress';
import useMergeProps from '../_util/hooks/useMergeProps';
var defaultProps = {
    type: 'line',
    showText: true,
    percent: 0,
    size: 'default',
};
function Progress(baseProps, ref) {
    var _a;
    var _b = useContext(ConfigContext), getPrefixCls = _b.getPrefixCls, componentConfig = _b.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Progress);
    var className = props.className, style = props.style, size = props.size, width = props.width, strokeWidth = props.strokeWidth, steps = props.steps, percent = props.percent;
    var type = steps && props.type !== 'circle' ? 'steps' : props.type;
    var prefixCls = getPrefixCls('progress');
    var status = 'status' in props ? props.status : percent >= 100 ? 'success' : 'normal';
    var widthStyle = { width: width };
    if (size === 'mini' && type === 'line') {
        widthStyle.width = width || 16;
        widthStyle.height = width || 16;
    }
    return (React.createElement("div", { ref: ref, className: cs(prefixCls, prefixCls + "-" + type, prefixCls + "-" + size, (_a = {},
            _a[prefixCls + "-is-" + status] = status !== 'normal',
            _a), className), style: __assign(__assign({}, widthStyle), style) },
        type === 'steps' && (React.createElement(StepsProgress, __assign({}, props, { type: type, status: status, prefixCls: prefixCls }))),
        type === 'circle' && (React.createElement(CircleProgress, __assign({ width: props.width }, props, { pathStrokeColor: props.trailColor, status: status, prefixCls: prefixCls }))),
        type === 'line' &&
            (size === 'mini' ? (React.createElement(CircleProgress, __assign({ pathStrokeColor: props.trailColor }, props, { pathStrokeWidth: strokeWidth || 4, width: width || 16, strokeWidth: strokeWidth || 4, prefixCls: prefixCls, status: status }))) : (React.createElement(LineProgress, __assign({}, props, { status: status, prefixCls: prefixCls }))))));
}
var ProgressRef = forwardRef(Progress);
ProgressRef.displayName = 'Progress';
export default ProgressRef;
