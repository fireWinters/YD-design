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
import React, { forwardRef, useState, useEffect, useContext, useRef } from 'react';
import dayjs from 'dayjs';
import { getDayjsValue, getNow } from '../_util/dayjs';
import cs from '../_util/classNames';
import { getDateString } from './util';
import { ConfigContext } from '../ConfigProvider';
function Countdown(props, ref) {
    var getPrefixCls = useContext(ConfigContext).getPrefixCls;
    var className = props.className, style = props.style, title = props.title, styleValue = props.styleValue, value = props.value, start = props.start, format = props.format, onFinish = props.onFinish;
    var dayjsValue = getDayjsValue(value, format) || dayjs();
    var now = getDayjsValue(props.now, format);
    var prefixCls = getPrefixCls('statistic');
    var _a = __read(useState(getDateString(Math.max(dayjsValue.diff(now, 'millisecond'), 0), format)), 2), valueShow = _a[0], setValueShow = _a[1];
    var timerRef = useRef(null);
    var stopTimer = function () {
        clearInterval(timerRef.current);
        timerRef.current = null;
    };
    var startTimer = function () {
        timerRef.current = setInterval(function () {
            var _value = dayjsValue.diff(getNow(), 'millisecond');
            if (_value <= 0) {
                stopTimer();
                onFinish && onFinish();
            }
            var valueShow = getDateString(Math.max(_value, 0), format);
            setValueShow(valueShow);
        }, 1000 / 30);
    };
    useEffect(function () {
        if (!timerRef.current && start) {
            if (dayjsValue.valueOf() >= Date.now()) {
                startTimer();
            }
        }
        return function () {
            stopTimer();
        };
    }, [props.start]);
    return (React.createElement("div", { ref: ref, className: cs("" + prefixCls, prefixCls + "-countdown", className), style: style },
        title && React.createElement("div", { className: prefixCls + "-title" }, title),
        React.createElement("div", { className: prefixCls + "-content" },
            React.createElement("div", { className: prefixCls + "-value", style: styleValue }, valueShow))));
}
var CountdownComponent = forwardRef(Countdown);
CountdownComponent.displayName = 'StatisticCountdown';
CountdownComponent.defaultProps = {
    format: 'HH:mm:ss',
    start: true,
};
export default CountdownComponent;
