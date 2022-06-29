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
import { useMemo } from 'react';
export default function useMergeProps(componentProps, defaultProps, globalComponentConfig) {
    var _defaultProps = useMemo(function () {
        return __assign(__assign({}, defaultProps), globalComponentConfig);
    }, [defaultProps, globalComponentConfig]);
    var props = useMemo(function () {
        var mProps = __assign({}, componentProps);
        // https://github.com/facebook/react/blob/cae635054e17a6f107a39d328649137b83f25972/packages/react/src/ReactElement.js#L312
        for (var propName in _defaultProps) {
            if (mProps[propName] === undefined) {
                mProps[propName] = _defaultProps[propName];
            }
        }
        return mProps;
    }, [componentProps, _defaultProps]);
    return props;
}
