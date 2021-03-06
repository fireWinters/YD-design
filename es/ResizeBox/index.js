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
import React, { useContext, forwardRef, useImperativeHandle, useState, useRef, } from 'react';
import cs from '../_util/classNames';
import { ConfigContext } from '../ConfigProvider';
import { on, off } from '../_util/dom';
import ResizeTrigger from './resize-trigger';
import Split from './split';
import useMergeValue from '../_util/hooks/useMergeValue';
import { isNumber } from '../_util/is';
import useMergeProps from '../_util/hooks/useMergeProps';
import SplitGroup from './split-group';
var DIRECTION_LEFT = 'left';
var DIRECTION_RIGHT = 'right';
var DIRECTION_TOP = 'top';
var DIRECTION_BOTTOM = 'bottom';
var allDirections = [
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    DIRECTION_TOP,
    DIRECTION_BOTTOM,
];
var defaultProps = {
    component: 'div',
    directions: ['right'],
    resizeIcons: {},
    resizeTriggers: {},
};
function ResizeBox(baseProps, ref) {
    var _a = useContext(ConfigContext), getPrefixCls = _a.getPrefixCls, componentConfig = _a.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.ResizeBox);
    var style = props.style, className = props.className, component = props.component, directions = props.directions, resizeIcons = props.resizeIcons, children = props.children, resizeTriggers = props.resizeTriggers, propWidth = props.width, propHeight = props.height;
    var prefixCls = getPrefixCls('resizebox');
    var classNames = cs(prefixCls, className);
    var _b = __read(useState({}), 2), paddingStyles = _b[0], setPaddingStyles = _b[1];
    var _c = __read(useMergeValue(undefined, { value: propWidth }), 2), width = _c[0], setWidth = _c[1];
    var _d = __read(useMergeValue(undefined, { value: propHeight }), 2), height = _d[0], setHeight = _d[1];
    var recordRef = useRef({
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        direction: DIRECTION_RIGHT,
        moving: false,
        padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
    });
    var wrapperRef = useRef();
    useImperativeHandle(ref, function () { return wrapperRef.current; }, []);
    function getIsHorizontal(direction) {
        return [DIRECTION_TOP, DIRECTION_BOTTOM].indexOf(direction) > -1;
    }
    function getRealSize(clientSize, padding) {
        if (clientSize === 0)
            return 0;
        var res = clientSize - padding;
        return res <= 0 ? 0 : res;
    }
    function onTriggerMouseDown(direction, e) {
        var _a, _b;
        props.onMovingStart && props.onMovingStart();
        recordRef.current.moving = true;
        recordRef.current.startX = e.pageX;
        recordRef.current.startY = e.pageY;
        recordRef.current.direction = direction;
        // ?????? clientWidth ????????????????????? padding?????? padding ??????????????? width ??????????????????????????????????????????
        var _c = recordRef.current.padding, top = _c.top, left = _c.left, right = _c.right, bottom = _c.bottom;
        recordRef.current.startWidth = getRealSize((_a = wrapperRef.current) === null || _a === void 0 ? void 0 : _a.clientWidth, left + right);
        recordRef.current.startHeight = getRealSize((_b = wrapperRef.current) === null || _b === void 0 ? void 0 : _b.clientHeight, top + bottom);
        on(window, 'mousemove', moving);
        on(window, 'touchmove', moving);
        on(window, 'mouseup', moveEnd);
        on(window, 'touchend', moveEnd);
        on(window, 'contextmenu', moveEnd);
        document.body.style.cursor = getIsHorizontal(direction) ? 'row-resize' : 'col-resize';
    }
    function moving(e) {
        if (!recordRef.current.moving)
            return false;
        var _a = recordRef.current, startX = _a.startX, startY = _a.startY, startWidth = _a.startWidth, startHeight = _a.startHeight;
        var newWidth = startWidth;
        var newHeight = startHeight;
        // ?????????????????????
        var offsetX = e.pageX - startX;
        // ?????????????????????
        var offsetY = e.pageY - startY;
        switch (recordRef.current.direction) {
            case DIRECTION_LEFT:
                newWidth = startWidth - offsetX;
                setWidth(newWidth);
                break;
            case DIRECTION_RIGHT:
                newWidth = startWidth + offsetX;
                setWidth(newWidth);
                break;
            case DIRECTION_TOP:
                newHeight = startHeight - offsetY;
                setHeight(newHeight);
                break;
            case DIRECTION_BOTTOM:
                newHeight = startHeight + offsetY;
                setHeight(newHeight);
                break;
            default:
                break;
        }
        props.onMoving &&
            props.onMoving(e, {
                width: newWidth,
                height: newHeight,
            });
    }
    function moveEnd() {
        recordRef.current.moving = false;
        offEvents();
        document.body.style.cursor = 'default';
        props.onMovingEnd && props.onMovingEnd();
    }
    function offEvents() {
        off(window, 'mousemove', moving);
        off(window, 'touchmove', moving);
        off(window, 'mouseup', moveEnd);
        off(window, 'touchend', moveEnd);
        off(window, 'contextmenu', moveEnd);
    }
    function onTriggerResize(direction, e) {
        var isHorizontal = getIsHorizontal(direction);
        var contentRect = e[0].contentRect;
        var styleDirection = "" + direction.slice(0, 1).toUpperCase() + direction.slice(1);
        var size = contentRect[isHorizontal ? 'height' : 'width'];
        // ?????? padding??????????????? width
        recordRef.current.padding[direction] = size;
        setPaddingStyles(function (pre) {
            var _a;
            return (__assign(__assign({}, pre), (_a = {}, _a["padding" + styleDirection] = size, _a)));
        });
    }
    var wrapperStyles = __assign(__assign(__assign(__assign({}, paddingStyles), (style || {})), (isNumber(width) ? { width: width } : {})), (isNumber(height) ? { height: height } : {}));
    var Tag = component;
    return (React.createElement(Tag, { style: wrapperStyles, className: classNames, ref: wrapperRef },
        children,
        directions.map(function (direction) {
            if (allDirections.indexOf(direction) !== -1) {
                return (React.createElement(ResizeTrigger, { key: direction, className: prefixCls + "-direction-" + direction, direction: getIsHorizontal(direction) ? 'horizontal' : 'vertical', icon: resizeIcons[direction], onMouseDown: function (e) {
                        onTriggerMouseDown(direction, e);
                    }, onResize: function (e) {
                        onTriggerResize(direction, e);
                    } }, resizeTriggers[direction]));
            }
        })));
}
var ForwardRefResizeBox = forwardRef(ResizeBox);
var ResizeBoxComponent = ForwardRefResizeBox;
ResizeBoxComponent.Split = Split;
ResizeBoxComponent.SplitGroup = SplitGroup;
ResizeBoxComponent.displayName = 'ResizeBox';
export default ResizeBoxComponent;
