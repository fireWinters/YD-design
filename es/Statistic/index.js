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
import React, { useState, useEffect, useContext, forwardRef, useRef, useImperativeHandle, useMemo, } from 'react';
import BTween from 'b-tween';
import dayjs from 'dayjs';
import cs from '../_util/classNames';
import Countdown from './countdown';
import { isNumber } from '../_util/is';
import { ConfigContext } from '../ConfigProvider';
import Skeleton from '../Skeleton';
import useMergeProps from '../_util/hooks/useMergeProps';
var defaultProps = {
    countFrom: 0,
    countDuration: 2000,
};
function Statistic(baseProps, ref) {
    var _a = useContext(ConfigContext), getPrefixCls = _a.getPrefixCls, componentConfig = _a.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Statistic);
    var className = props.className, style = props.style, title = props.title, extra = props.extra, groupSeparator = props.groupSeparator, precision = props.precision, prefix = props.prefix, suffix = props.suffix, format = props.format, styleValue = props.styleValue, loading = props.loading;
    var tween = useRef();
    var _b = __read(useState('value' in props ? props.value : undefined), 2), value = _b[0], setValue = _b[1];
    var prefixCls = getPrefixCls('statistic');
    var countUp = function (from, to) {
        if (from === void 0) { from = props.countFrom; }
        if (to === void 0) { to = props.value; }
        var countDuration = props.countDuration;
        if (from !== to) {
            tween.current = new BTween({
                from: {
                    value: from,
                },
                to: {
                    value: to,
                },
                duration: countDuration,
                easing: 'quartOut',
                onUpdate: function (keys) {
                    setValue(keys.value.toFixed(precision));
                },
                onFinish: function () {
                    setValue(to);
                },
            });
            tween.current.start();
        }
    };
    useEffect(function () {
        if (props.countUp) {
            if (tween.current) {
                tween.current.stop();
            }
            if (value !== props.value) {
                countUp(Number(value), props.value);
            }
            else {
                countUp();
            }
        }
        else {
            setValue(props.value);
        }
        return function () {
            tween.current && tween.current.stop();
            tween.current = null;
        };
    }, [props.value]);
    useImperativeHandle(ref, function () { return ({
        countUp: countUp,
    }); });
    var _c = useMemo(function () {
        var _value = value;
        if (format) {
            _value = dayjs(value).format(format);
        }
        if (isNumber(precision) && precision >= 0) {
            _value = Number(value).toFixed(precision);
        }
        var int = String(_value).split('.')[0];
        var decimal = String(_value).split('.')[1];
        if (groupSeparator && isNumber(Number(value))) {
            int = Number(int).toLocaleString('en-US');
        }
        return {
            int: int,
            decimal: decimal,
        };
    }, [format, groupSeparator, precision, value]), int = _c.int, decimal = _c.decimal;
    return (React.createElement("div", { className: cs("" + prefixCls, className), style: style },
        title && React.createElement("div", { className: prefixCls + "-title" }, title),
        React.createElement("div", { className: prefixCls + "-content" },
            React.createElement(Skeleton, { animation: true, loading: !!loading, text: { rows: 1, width: '100%' } },
                React.createElement("div", { className: prefixCls + "-value", style: styleValue },
                    !isNumber(Number(value)) ? (value) : (React.createElement("span", { className: prefixCls + "-value-int" },
                        React.createElement("span", { className: prefixCls + "-value-prefix" }, prefix),
                        int)),
                    decimal !== undefined || suffix ? (React.createElement("span", { className: prefixCls + "-value-decimal" },
                        isNumber(Number(value)) && decimal !== undefined && "." + decimal,
                        suffix && React.createElement("span", { className: prefixCls + "-value-suffix" }, suffix))) : null)),
            extra && React.createElement("div", { className: prefixCls + "-extra" }, extra))));
}
var ForwardRefStatistic = forwardRef(Statistic);
var StatisticComponent = ForwardRefStatistic;
StatisticComponent.displayName = 'Statistic';
StatisticComponent.Countdown = Countdown;
export default StatisticComponent;
