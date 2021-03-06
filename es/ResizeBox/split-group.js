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
import React, { useState, useEffect, useRef, useContext, forwardRef, useImperativeHandle, } from 'react';
import { ConfigContext } from '../ConfigProvider';
import cs from '../_util/classNames';
import { isFunction, isNumber, isUndefined, isObject, isString } from '../_util/is';
import ResizeTrigger from './resize-trigger';
import { on, off } from '../_util/dom';
var DIRECTION_HORIZONTAL = 'horizontal';
var DIRECTION_VERTICAL = 'vertical';
function SplitGroup(props, ref) {
    var _a;
    var panes = props.panes, style = props.style, className = props.className, _b = props.component, component = _b === void 0 ? 'div' : _b, _c = props.direction, direction = _c === void 0 ? 'horizontal' : _c, icon = props.icon;
    var getPrefixCls = useContext(ConfigContext).getPrefixCls;
    var defaultOffset = 1 / panes.length;
    var wrapperRef = useRef();
    var recordRef = useRef(new Array(panes.length).fill({
        moving: false,
        startOffset: 0,
        startPosition: 0,
    }));
    var paneContainers = useRef([]);
    var movingIndex = useRef(0);
    var prevOffsets = useRef([]);
    var _d = __read(useState(new Array(panes.length).fill(defaultOffset)), 2), offsets = _d[0], setOffsets = _d[1];
    var _e = __read(useState(false), 2), isMoving = _e[0], setIsMoving = _e[1];
    var _f = __read(useState(new Array(panes.length).fill(0)), 2), triggerSize = _f[0], setTriggerSize = _f[1];
    var _g = __read(useState(new Array(Math.max(panes.length - 1, 0)).fill({ prev: false, next: false })), 2), collapsedStatus = _g[0], setCollapsedStatus = _g[1];
    var prefixCls = getPrefixCls('resizebox-split-group');
    var isHorizontal = direction === DIRECTION_HORIZONTAL;
    var isTriggerHorizontal = !isHorizontal;
    var classNames = cs(prefixCls, prefixCls + "-" + (isHorizontal ? DIRECTION_HORIZONTAL : DIRECTION_VERTICAL), (_a = {}, _a[prefixCls + "-moving"] = isMoving, _a), className);
    var Tag = component;
    // ??????????????? offset, ????????????size ?????????????????????
    var getInitialOffsets = function () {
        var newOffsets = [];
        panes.forEach(function (pane) {
            var size = pane.size;
            if (!isUndefined(size)) {
                newOffsets.push(formatSize(size));
            }
            else {
                newOffsets.push(undefined);
            }
        });
        // ???????????????????????????????????? size ?????????
        var noSizeArr = newOffsets.filter(function (size) { return !size; });
        var remainPercent = 1 -
            newOffsets.reduce(function (a, b) {
                var formatA = a || 0;
                var formatB = b || 0;
                return formatA + formatB;
            }, 0);
        var averagePercent = remainPercent / noSizeArr.length;
        newOffsets = newOffsets.map(function (size) {
            if (!isUndefined(size)) {
                return size;
            }
            return averagePercent;
        });
        return newOffsets;
    };
    // ????????????????????????????????????????????????????????????????????????????????????
    var getPaneSize = function (index) {
        var prevTriggerSize = triggerSize[index - 1] || 0;
        var currentTriggerSize = triggerSize[index];
        var baseVal = offsets[index] * 100;
        var unit = '%';
        return "calc(" + baseVal + unit + " - " + (prevTriggerSize + currentTriggerSize) / 2 + "px)";
    };
    // ?????? ?????????/????????? => ????????????????????????(?????????)
    function formatSize(size) {
        var totalPX = isHorizontal ? wrapperRef.current.offsetWidth : wrapperRef.current.offsetHeight;
        if (!size || (isNumber(size) && size < 0)) {
            return 0;
        }
        var percent = isString(size) ? parseFloat(size) / totalPX : size;
        return Math.min(percent, 1);
    }
    // ?????????????????????????????????????????????????????? ??? ???????????????????????????????????????????????????
    var getMinAndMax = function (index) {
        var next = Math.min(index + 1, panes.length - 1);
        var totalOffset = offsets[index] + offsets[next];
        var currentMin = formatSize(panes[index].min) || 0;
        var currentMax = formatSize(panes[index].max) || totalOffset;
        var nextMin = formatSize(panes[next].min) || 0;
        var nextMax = formatSize(panes[next].max) || totalOffset;
        //  min ?????????????????? max
        currentMax = Math.min(totalOffset - nextMin, currentMax);
        nextMax = Math.min(totalOffset - currentMin, nextMax);
        return {
            currentMin: currentMin,
            currentMax: currentMax,
            nextMin: nextMin,
            nextMax: nextMax,
        };
    };
    // ??????????????????????????????????????????????????????????????????????????????????????????
    var getNewOffsets = function (startOffset, startPosition, currentPosition) {
        var current = movingIndex.current;
        var next = current + 1;
        var newOffsets = __spreadArray([], __read(offsets), false);
        var currentPercent = offsets[current];
        var nextPercent = offsets[next];
        var totalPercent = currentPercent + nextPercent;
        var _a = getMinAndMax(current), minOffset = _a.currentMin, maxOffset = _a.currentMax;
        var moveOffset = startOffset + formatSize(currentPosition - startPosition + "px");
        moveOffset = Math.max(minOffset, moveOffset);
        moveOffset = Math.min(maxOffset, moveOffset);
        newOffsets[current] = moveOffset;
        // ?????? totalOffset = nextOffset + currentOffset  ?????????
        newOffsets[next] = totalPercent - moveOffset;
        return newOffsets;
    };
    function onTriggerResize(e, index) {
        var contentRect = e[0].contentRect;
        var currentSize = contentRect[isTriggerHorizontal ? 'height' : 'width'];
        var newTriggerSize = __spreadArray([], __read(triggerSize), false);
        newTriggerSize[index] = currentSize;
        setTriggerSize(newTriggerSize);
    }
    // ????????????????????????????????????
    var getCollapsedConfig = function (index) {
        var collapsible = panes[index].collapsible;
        if (!isObject(collapsible)) {
            collapsible = !collapsible ? {} : { prev: true, next: true };
        }
        var prev = collapsible.prev, next = collapsible.next;
        if (!prev && !next) {
            return {};
        }
        if (!collapsedStatus[index]) {
            return {};
        }
        // ?????????prev?????????????????? ???????????? prev ??????????????????????????????????????????????????????
        var hasPrev = !!prev || (!prev && collapsedStatus[index].next);
        // ?????????next?????????????????? ???????????? next ??????????????????????????????????????????????????????
        var hasNext = !!next || (!next && collapsedStatus[index].prev);
        return { hasPrev: hasPrev, hasNext: hasNext };
    };
    // ???????????????????????????????????????????????????
    function onTriggerMouseDown(e, index) {
        props.onMovingStart && props.onMovingStart(index);
        movingIndex.current = index;
        var currentRecord = recordRef.current[index];
        currentRecord.moving = true;
        currentRecord.startOffset = offsets[index];
        currentRecord.startPosition = isHorizontal ? e.pageX : e.pageY;
        setIsMoving(true);
        on(window, 'mousemove', moving);
        on(window, 'touchmove', moving);
        on(window, 'mouseup', moveEnd);
        on(window, 'touchend', moveEnd);
        on(window, 'contextmenu', moveEnd);
        document.body.style.cursor = isTriggerHorizontal ? 'row-resize' : 'col-resize';
    }
    // ?????????????????? ?????????????????????????????? ????????????
    function moving(e) {
        var index = movingIndex.current;
        var currentRecord = recordRef.current[index];
        var totalPX = isHorizontal ? wrapperRef.current.offsetWidth : wrapperRef.current.offsetHeight;
        if (currentRecord.moving) {
            var newOffsets = getNewOffsets(currentRecord.startOffset, currentRecord.startPosition, isHorizontal ? e.pageX : e.pageY);
            setOffsets(newOffsets);
            prevOffsets.current = newOffsets;
            props.onMoving &&
                props.onMoving(e, newOffsets.map(function (value) { return value * totalPX + "px"; }), index);
        }
    }
    // ?????????????????????????????????
    function moveEnd() {
        var index = movingIndex.current;
        recordRef.current[index].moving = false;
        setIsMoving(false);
        off(window, 'mousemove', moving);
        off(window, 'touchmove', moving);
        off(window, 'mouseup', moveEnd);
        off(window, 'touchend', moveEnd);
        off(window, 'contextmenu', moveEnd);
        document.body.style.cursor = 'default';
        props.onMovingEnd && props.onMovingEnd(index);
    }
    // ????????????????????????????????????
    function handleCollapsed(e, index, status, callback) {
        var next = index + 1;
        var newOffset = __spreadArray([], __read(offsets), false);
        var currentOffset = offsets[index];
        var nextOffset = offsets[next];
        var totalOffset = currentOffset + nextOffset;
        var totalPX = isHorizontal ? wrapperRef.current.offsetWidth : wrapperRef.current.offsetHeight;
        var _a = getMinAndMax(index), currentMin = _a.currentMin, nextMin = _a.nextMin;
        // ????????????????????????????????????????????????????????????preOffsets?????????
        var newCurrentOffset = prevOffsets.current[index];
        var newNextOffset = prevOffsets.current[next];
        // ??????????????????????????????
        var collapsed = collapsedStatus[index][status];
        // ??????????????????????????????????????????currentPane = currentMin;
        if (status === 'prev') {
            // ?????????????????????????????????????????? ?????? ?????????????????????????????????????????????
            if (nextOffset !== nextMin || newNextOffset === nextMin) {
                // ?????????????????????
                newCurrentOffset = currentMin;
                newNextOffset = totalOffset - currentMin;
                collapsed = true;
            }
            // ????????????????????????
        }
        else if (currentOffset !== currentMin || newCurrentOffset === currentMin) {
            newCurrentOffset = totalOffset - nextMin;
            newNextOffset = nextMin;
            collapsed = true;
        }
        newOffset[index] = newCurrentOffset;
        newOffset[next] = newNextOffset;
        props.onMoving &&
            props.onMoving(e, newOffset.map(function (value) { return value * totalPX + "px"; }), index);
        props.onMovingEnd && props.onMovingEnd(index);
        setOffsets(newOffset);
        if (isFunction(callback)) {
            callback(e, index, status, collapsed);
        }
    }
    useEffect(function () {
        var offsets = getInitialOffsets();
        setOffsets(offsets);
        prevOffsets.current = offsets;
    }, [JSON.stringify(panes.map(function (item) { return item.size; }))]);
    useImperativeHandle(ref, function () { return wrapperRef.current; }, []);
    useEffect(function () {
        var newCollapsedStatus = [];
        offsets.forEach(function (offset, index) {
            var currentCollapsedStatus = { prev: false, next: false };
            var next = index + 1;
            var _a = getMinAndMax(index), currentMin = _a.currentMin, nextMin = _a.nextMin;
            // ??? offsets ????????????????????????????????? collapsed ??????
            if (offset === currentMin) {
                currentCollapsedStatus.prev = true;
            }
            else if (offsets[next] === nextMin) {
                currentCollapsedStatus.next = true;
            }
            newCollapsedStatus.push(currentCollapsedStatus);
        });
        setCollapsedStatus(newCollapsedStatus);
    }, [offsets]);
    return (React.createElement(Tag, { style: style, className: classNames, ref: wrapperRef }, panes.map(function (pane, index) {
        var content = pane.content, disabled = pane.disabled, trigger = pane.trigger, _a = pane.resizable, resizable = _a === void 0 ? true : _a, _b = pane.collapsible, collapsible = _b === void 0 ? {} : _b;
        var _c = getCollapsedConfig(index), hasPrev = _c.hasPrev, hasNext = _c.hasNext;
        var prevConfig = isObject(collapsible) && isObject(collapsible.prev) ? collapsible.prev : {};
        var nextConfig = isObject(collapsible) && isObject(collapsible.next) ? collapsible.next : {};
        return (React.createElement(React.Fragment, { key: index },
            React.createElement("div", { className: prefixCls + "-pane", style: { flexBasis: getPaneSize(index) }, ref: function (el) { return (paneContainers.current[index] = el); } }, content),
            !disabled && index !== panes.length - 1 && (React.createElement(ResizeTrigger, { className: prefixCls + "-trigger", direction: isTriggerHorizontal ? DIRECTION_HORIZONTAL : DIRECTION_VERTICAL, icon: icon, onResize: function (e) { return onTriggerResize(e, index); }, onMouseDown: function (e) { return onTriggerMouseDown(e, index); }, collapsible: {
                    prev: hasPrev
                        ? {
                            onClick: function (e) { return handleCollapsed(e, index, 'prev', prevConfig.onClick); },
                            icon: prevConfig.icon,
                            collapsed: collapsedStatus[index].prev,
                        }
                        : undefined,
                    next: hasNext
                        ? {
                            onClick: function (e) { return handleCollapsed(e, index, 'next', nextConfig.onClick); },
                            icon: nextConfig.icon,
                            collapsed: collapsedStatus[index].next,
                        }
                        : undefined,
                }, resizable: resizable, renderChildren: trigger }))));
    })));
}
var SplitGroupComponent = forwardRef(SplitGroup);
SplitGroupComponent.displayName = 'ResizeBoxSplitGroup';
export default SplitGroupComponent;
