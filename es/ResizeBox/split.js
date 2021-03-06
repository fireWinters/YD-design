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
import React, { forwardRef, useContext, useImperativeHandle, useState, useRef, useEffect, } from 'react';
import cs from '../_util/classNames';
import ResizeTrigger from './resize-trigger';
import { ConfigContext } from '../ConfigProvider';
import { on, off } from '../_util/dom';
import useIsomorphicLayoutEffect from '../_util/hooks/useIsomorphicLayoutEffect';
var DIRECTION_HORIZONTAL = 'horizontal';
var DIRECTION_VERTICAL = 'vertical';
function Split(props, ref) {
    var style = props.style, className = props.className, _a = props.component, component = _a === void 0 ? 'div' : _a, _b = props.direction, direction = _b === void 0 ? 'horizontal' : _b, icon = props.icon, _c = props.size, size = _c === void 0 ? 0.5 : _c, min = props.min, max = props.max, panes = props.panes, disabled = props.disabled, trigger = props.trigger;
    var getPrefixCls = useContext(ConfigContext).getPrefixCls;
    var prefixCls = getPrefixCls('resizebox-split');
    var isHorizontal = direction.includes(DIRECTION_HORIZONTAL);
    var isReverse = direction.includes('reverse');
    var isTriggerHorizontal = !isHorizontal;
    var classNames = cs(prefixCls, prefixCls + "-" + (isHorizontal ? DIRECTION_HORIZONTAL : DIRECTION_VERTICAL), className);
    var _d = __read(panes, 2), firstPane = _d[0], secondPane = _d[1];
    var isPxSize = typeof size === 'string';
    var _e = __read(useState(parseFloat(size)), 2), offset = _e[0], setOffset = _e[1];
    var _f = __read(useState(0), 2), triggerSize = _f[0], setTriggerSize = _f[1];
    var recordRef = useRef({
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        startOffset: 0,
        moving: false,
    });
    var wrapperRef = useRef();
    var paneContainers = useRef([]);
    useImperativeHandle(ref, function () { return wrapperRef.current; }, []);
    function px2percent(numerator, denominator) {
        return parseFloat(numerator) / parseFloat(denominator);
    }
    function getOffset(startSize, startOffset, startPosition, currentPosition) {
        var minOffset = min ? parseFloat(min) : 0;
        var maxOffset = max ? parseFloat(max) : isPxSize ? startSize : 1;
        var ratio = isReverse ? -1 : 1;
        var moveOffset = isPxSize
            ? startOffset + (currentPosition - startPosition) * ratio
            : px2percent(startSize * startOffset + (currentPosition - startPosition) * ratio, startSize);
        moveOffset = Math.max(moveOffset, minOffset);
        moveOffset = Math.min(moveOffset, maxOffset);
        return moveOffset;
    }
    // ???????????????????????????????????????????????????
    function onTriggerMouseDown(e) {
        var _a, _b;
        props.onMovingStart && props.onMovingStart();
        recordRef.current.moving = true;
        recordRef.current.startX = e.pageX;
        recordRef.current.startY = e.pageY;
        recordRef.current.startWidth = (_a = wrapperRef.current) === null || _a === void 0 ? void 0 : _a.offsetWidth;
        recordRef.current.startHeight = (_b = wrapperRef.current) === null || _b === void 0 ? void 0 : _b.offsetHeight;
        recordRef.current.startOffset = offset;
        on(window, 'mousemove', moving);
        on(window, 'touchmove', moving);
        on(window, 'mouseup', moveEnd);
        on(window, 'touchend', moveEnd);
        on(window, 'contextmenu', moveEnd);
        document.body.style.cursor = isTriggerHorizontal ? 'row-resize' : 'col-resize';
    }
    // ?????????????????? firstPane ???????????????
    function moving(e) {
        if (recordRef.current.moving) {
            /* eslint-disable */
            var newOffset = isHorizontal
                ? getOffset(recordRef.current.startWidth, recordRef.current.startOffset, recordRef.current.startX, e.pageX)
                : getOffset(recordRef.current.startHeight, recordRef.current.startOffset, recordRef.current.startY, e.pageY);
            setOffset(newOffset);
            props.onMoving && props.onMoving(e, isPxSize ? newOffset + "px" : newOffset);
        }
    }
    // ?????????????????????????????????
    function moveEnd() {
        recordRef.current.moving = false;
        off(window, 'mousemove', moving);
        off(window, 'touchmove', moving);
        off(window, 'mouseup', moveEnd);
        off(window, 'touchend', moveEnd);
        off(window, 'contextmenu', moveEnd);
        document.body.style.cursor = 'default';
        props.onMovingEnd && props.onMovingEnd();
    }
    // ?????? trigger ??????
    function onTriggerResize(e) {
        var contentRect = e[0].contentRect;
        var newTriggerSize = contentRect[isTriggerHorizontal ? 'height' : 'width'];
        setTriggerSize(newTriggerSize);
    }
    // ?????? offset ??? triggerSize ?????? firstPane ?????????
    function getFirstPaneSize() {
        var unit = isPxSize ? 'px' : '%';
        if (!offset)
            return "0" + unit;
        var baseVal = isPxSize ? offset : offset * 100;
        return "calc(" + baseVal + unit + " - " + triggerSize / 2 + "px)";
    }
    useEffect(function () {
        props.onPaneResize && props.onPaneResize(paneContainers.current);
    }, [offset, triggerSize]);
    useIsomorphicLayoutEffect(function () {
        var newOffset = parseFloat(size);
        if (offset !== newOffset) {
            setOffset(newOffset);
        }
    }, [size]);
    var Tag = component;
    var firstPaneNode = (React.createElement("div", { className: cs(prefixCls + "-pane", 'first-pane'), style: { flexBasis: getFirstPaneSize() }, ref: function (el) {
            paneContainers.current[0] = el;
        } }, firstPane));
    var secondPaneNode = (React.createElement("div", { className: cs(prefixCls + "-pane", 'second-pane'), ref: function (el) {
            paneContainers.current[1] = el;
        } }, secondPane));
    return (React.createElement(Tag, { style: style, className: classNames, ref: wrapperRef },
        isReverse ? secondPaneNode : firstPaneNode,
        !disabled && (React.createElement(ResizeTrigger, { className: prefixCls + "-trigger", direction: isTriggerHorizontal ? DIRECTION_HORIZONTAL : DIRECTION_VERTICAL, icon: icon, onMouseDown: onTriggerMouseDown, onResize: onTriggerResize }, trigger)),
        isReverse ? firstPaneNode : secondPaneNode));
}
var SplitComponent = forwardRef(Split);
SplitComponent.displayName = 'ResizeBoxSplit';
export default SplitComponent;
