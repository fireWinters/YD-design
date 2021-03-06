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
import React, { forwardRef, memo, useContext, useRef, useMemo } from 'react';
import { plus, times, divide } from 'number-precision';
import SliderButton from './button';
import Marks from './marks';
import Dots from './dots';
import Input from './input';
import Ticks from './ticks';
import { isFunction, isObject, isArray } from '../_util/is';
import { formatPercent, getIntervalOffset } from './utils';
import cs from '../_util/classNames';
import { ConfigContext } from '../ConfigProvider';
import useMergeValue from '../_util/hooks/useMergeValue';
import { off, on } from '../_util/dom';
import useLegalValue from './hooks/useLegalValue';
import useInterval from './hooks/useInterval';
import useMergeProps from '../_util/hooks/useMergeProps';
import useUpdate from '../_util/hooks/useUpdate';
function isSameOrder(firstNums, secondNums) {
    var diff1 = firstNums[0] - firstNums[1];
    var diff2 = secondNums[0] - secondNums[1];
    return diff1 <= 0 === diff2 <= 0;
}
var defaultProps = {
    max: 100,
    min: 0,
    step: 1,
};
function Slider(baseProps, ref) {
    var _a, _b, _c;
    var _d = useContext(ConfigContext), getPrefixCls = _d.getPrefixCls, componentConfig = _d.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Slider);
    var className = props.className, style = props.style, tooltipVisible = props.tooltipVisible, tooltipPosition = props.tooltipPosition, disabled = props.disabled, min = props.min, max = props.max, propRange = props.range, step = props.step, showTicks = props.showTicks, marks = props.marks, onlyMarkValue = props.onlyMarkValue, vertical = props.vertical, showInput = props.showInput, reverse = props.reverse, getIntervalConfig = props.getIntervalConfig;
    var range = !!propRange;
    var rangeConfig = isObject(propRange) ? __assign({}, propRange) : { draggableBar: false };
    var _e = useInterval({
        min: min,
        max: max,
        onlyMarkValue: onlyMarkValue,
        step: step,
        marks: marks,
        getIntervalConfig: getIntervalConfig,
    }), intervalConfigs = _e.intervalConfigs, markList = _e.markList;
    var _f = useLegalValue({
        isRange: range,
        min: min,
        max: max,
        onlyMarkValue: onlyMarkValue,
        step: step,
        intervalConfigs: intervalConfigs,
        marks: marks,
    }), getLegalValue = _f.getLegalValue, getLegalRangeValue = _f.getLegalRangeValue, isLegalValue = _f.isLegalValue;
    // ???????????????????????????
    var _g = __read(useMergeValue(range ? [min, min] : min, {
        defaultValue: props.defaultValue,
        value: props.value,
    }), 2), value = _g[0], setValue = _g[1];
    // ???????????????
    var curVal = getLegalRangeValue(value);
    var lastVal = useRef(curVal);
    var _h = __read(curVal, 2), beginVal = _h[0], endVal = _h[1];
    // value????????? ??????lastVal
    useUpdate(function () {
        lastVal.current = getLegalRangeValue(value);
    }, [value, getLegalRangeValue]);
    if (!isSameOrder(curVal, lastVal.current)) {
        // ????????????
        _a = __read([endVal, beginVal], 2), beginVal = _a[0], endVal = _a[1];
    }
    // ????????????
    var beginOffset = getIntervalOffset(beginVal, intervalConfigs);
    var endOffset = getIntervalOffset(endVal, intervalConfigs);
    // ?????????????????????
    var isShowInput = showInput && !onlyMarkValue;
    var extraInputProps = useMemo(function () {
        if (isShowInput && (isArray(showInput) || isObject(showInput))) {
            return isArray(showInput) ? __spreadArray([], __read(showInput), false) : [__assign({}, showInput), __assign({}, showInput)];
        }
        return [];
    }, [isShowInput, showInput]);
    // ????????????
    var prefixCls = getPrefixCls('slider');
    // ref
    var roadRef = useRef(null);
    var position = useRef({
        left: 0,
        height: 0,
        top: 0,
        width: 0,
    });
    var isDragging = useRef(false);
    var barStartDragVal = useRef(0);
    function getEmitParams(_a) {
        var _b;
        var _c = __read(_a, 2), beginVal = _c[0], endVal = _c[1];
        if (beginVal > endVal) {
            _b = __read([endVal, beginVal], 2), beginVal = _b[0], endVal = _b[1];
        }
        return range ? [beginVal, endVal] : endVal;
    }
    function updateValue(val) {
        var _a = __read(val, 2), newBeginVal = _a[0], newEndVal = _a[1];
        newBeginVal = getLegalValue(newBeginVal);
        newEndVal = getLegalValue(newEndVal);
        lastVal.current = [newBeginVal, newEndVal];
        var emitParams = getEmitParams([newBeginVal, newEndVal]);
        setValue(emitParams);
        return emitParams;
    }
    function onChange(val) {
        var emitParams = updateValue(val);
        if (isFunction(props.onChange)) {
            props.onChange(emitParams);
        }
    }
    function onMouseUp() {
        if (isFunction(props.onAfterChange)) {
            var emitParams = getEmitParams(lastVal.current);
            props.onAfterChange(emitParams);
        }
    }
    function inRange(val) {
        var _a;
        var _b = __read([beginVal, endVal], 2), range1 = _b[0], range2 = _b[1];
        if (range1 > range2) {
            _a = __read([range2, range1], 2), range1 = _a[0], range2 = _a[1];
        }
        if (range)
            return val >= range1 && val <= range2;
        return val <= range2;
    }
    // ?????????????????????
    function getValueByCoords(x, y) {
        var _a = position.current, left = _a.left, top = _a.top, width = _a.width, height = _a.height;
        var roadLength = width;
        var diff = reverse ? left + width - x : x - left;
        if (vertical) {
            roadLength = height;
            diff = reverse ? y - top : top + height - y;
        }
        if (roadLength <= 0) {
            return 0;
        }
        // ???????????????????????????????????????????????????????????????????????????
        var offset = Math.max(divide(diff, roadLength), 0);
        offset = Math.min(1, offset);
        // ?????????????????????????????????????????????
        var currentInterval = intervalConfigs.find(function (config) {
            return offset >= config.beginOffset && offset <= config.endOffset;
        });
        var begin = currentInterval.begin, beginOffset = currentInterval.beginOffset, currentStep = currentInterval.step, endOffset = currentInterval.endOffset, end = currentInterval.end;
        // ??????????????????????????????????????????????????????
        var currentValueOffset = offset - beginOffset;
        // ???????????????????????????
        var currentIntervalOffset = endOffset - beginOffset;
        // ??????????????????????????? = ???????????????????????????????????????????????? / ???????????????????????????????????????* ?????????????????????
        var valueInInterval = (currentValueOffset / currentIntervalOffset) * (end - begin);
        // ???????????????????????????????????????
        var stepNum = Math.round(valueInInterval / currentStep);
        // ????????? = ??????????????? + ???????????? * ??????
        return plus(begin, times(stepNum, currentStep));
    }
    function getBarStyle(offsets) {
        var _a, _b, _c;
        var _d = __read(offsets, 2), begin = _d[0], end = _d[1];
        if (begin > end) {
            _a = __read([end, begin], 2), begin = _a[0], end = _a[1];
        }
        var beginOffset = formatPercent(begin);
        var endOffset = formatPercent(1 - end);
        return vertical
            ? (_b = {},
                _b[reverse ? 'top' : 'bottom'] = beginOffset,
                _b[reverse ? 'bottom' : 'top'] = endOffset,
                _b) : (_c = {},
            _c[reverse ? 'right' : 'left'] = beginOffset,
            _c[reverse ? 'left' : 'right'] = endOffset,
            _c);
    }
    function getBtnStyle(offset) {
        var _a, _b;
        return vertical
            ? (_a = {}, _a[reverse ? 'top' : 'bottom'] = formatPercent(offset), _a) : (_b = {}, _b[reverse ? 'right' : 'left'] = formatPercent(offset), _b);
    }
    function getTooltipProps() {
        var tooltipProps = {
            getTooltipContainer: props.getTooltipContainer,
            formatTooltip: props.formatTooltip,
        };
        if ('tooltipPosition' in props) {
            tooltipProps.tooltipPosition = tooltipPosition;
        }
        if ('tooltipVisible' in props) {
            tooltipProps.tooltipVisible = tooltipVisible;
        }
        return tooltipProps;
    }
    function getPosition() {
        position.current = roadRef.current.getBoundingClientRect();
    }
    function onRoadMouseDown(e) {
        getPosition();
        var val = getValueByCoords(e.clientX, e.clientY);
        if (rangeConfig.draggableBar && inRange(val)) {
            barStartDragVal.current = getLegalValue(val);
            on(window, 'mousemove', onBarMouseMove);
            on(window, 'mouseup', onBarMouseUp);
        }
        else {
            handleJumpClick(val);
        }
    }
    // ?????????????????????????????????
    function handleJumpClick(val) {
        if (disabled)
            return;
        var value = getLegalValue(val);
        if (range && endVal - value > value - beginVal) {
            onChange([value, endVal]);
        }
        else {
            onChange([beginVal, value]);
        }
        onMouseUp();
    }
    function handleInputChange(val) {
        onChange(val);
        onMouseUp();
    }
    // ??????????????????
    function handleBeginMove(x, y) {
        isDragging.current = true;
        onChange([getValueByCoords(x, y), endVal]);
    }
    // ??????????????????
    function handleEndMove(x, y) {
        isDragging.current = true;
        onChange([beginVal, getValueByCoords(x, y)]);
    }
    function handleMoveEnd() {
        isDragging.current = false;
        onMouseUp();
    }
    // bar ?????????
    function onBarMouseMove(e) {
        var newVal = getLegalValue(getValueByCoords(e.clientX, e.clientY));
        var offsetVal = newVal - barStartDragVal.current;
        var newBeginVal = beginVal + offsetVal;
        var newEndVal = endVal + offsetVal;
        if (isLegalValue(newBeginVal) && isLegalValue(newEndVal)) {
            onChange([newBeginVal, newEndVal]);
        }
    }
    // bar ????????????
    function onBarMouseUp() {
        off(window, 'mousemove', onBarMouseMove);
        off(window, 'mouseup', onBarMouseUp);
        onMouseUp();
    }
    return (React.createElement("div", { className: cs(prefixCls, (_b = {},
            _b[prefixCls + "-vertical"] = vertical,
            _b[prefixCls + "-with-marks"] = marks,
            _b[prefixCls + "-reverse"] = reverse,
            _b), className), style: style, ref: ref },
        React.createElement("div", { className: prefixCls + "-wrapper" },
            React.createElement("div", { ref: roadRef, className: cs(prefixCls + "-road", (_c = {},
                    _c[prefixCls + "-road-disabled"] = disabled,
                    _c[prefixCls + "-road-vertical"] = vertical,
                    _c)), onMouseDown: onRoadMouseDown },
                React.createElement("div", { className: prefixCls + "-bar", style: getBarStyle([beginOffset, endOffset]) }),
                showTicks && (React.createElement(Ticks, { intervalConfigs: intervalConfigs, min: min, max: max, value: [beginVal, endVal], prefixCls: prefixCls, vertical: vertical, reverse: reverse })),
                React.createElement(Dots, { data: markList, intervalConfigs: intervalConfigs, value: [beginVal, endVal], vertical: vertical, prefixCls: prefixCls, reverse: reverse, onMouseDown: handleJumpClick }),
                React.createElement(Marks, { data: markList, intervalConfigs: intervalConfigs, vertical: vertical, prefixCls: prefixCls, reverse: reverse, onMouseDown: handleJumpClick }),
                range && (React.createElement(SliderButton, __assign({ style: getBtnStyle(beginOffset), disabled: disabled, prefixCls: prefixCls, value: beginVal, maxValue: max, minValue: min, vertical: vertical }, getTooltipProps(), { onMoveBegin: getPosition, onMoving: handleBeginMove, onMoveEnd: handleMoveEnd }))),
                React.createElement(SliderButton, __assign({ style: getBtnStyle(endOffset), disabled: disabled, prefixCls: prefixCls, value: endVal, maxValue: max, minValue: min, vertical: vertical }, getTooltipProps(), { onMoveBegin: getPosition, onMoving: handleEndMove, onMoveEnd: handleMoveEnd }))),
            isShowInput && (React.createElement(Input, { min: min, max: max, step: step, value: [beginVal, endVal], range: range, disabled: disabled, prefixCls: prefixCls, onChange: handleInputChange, extra: extraInputProps })))));
}
var SliderComponent = forwardRef(Slider);
SliderComponent.displayName = 'Slider';
export default memo(SliderComponent);
