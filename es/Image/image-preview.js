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
import React, { forwardRef, useContext, useRef, useState, useImperativeHandle, useEffect, useCallback, useMemo, } from 'react';
import { CSSTransition } from 'react-transition-group';
import { findDOMNode } from 'react-dom';
import cs from '../_util/classNames';
import { on, off, isServerRendering } from '../_util/dom';
import ResizeObserver from '../_util/resizeObserver';
import IconLoading from '../../icon/react-icon/IconLoading';
import IconZoomOut from '../../icon/react-icon/IconZoomOut';
import IconZoomIn from '../../icon/react-icon/IconZoomIn';
import IconFullscreen from '../../icon/react-icon/IconFullscreen';
import IconClose from '../../icon/react-icon/IconClose';
import IconRotateLeft from '../../icon/react-icon/IconRotateLeft';
import IconRotateRight from '../../icon/react-icon/IconRotateRight';
import IconOriginalSize from '../../icon/react-icon/IconOriginalSize';
import ConfigProvider, { ConfigContext } from '../ConfigProvider';
import useImageStatus from './utils/hooks/useImageStatus';
import PreviewScales, { defaultScales } from './utils/getScale';
import getFixTranslate from './utils/getFixTranslate';
import ImagePreviewToolbar from './image-preview-toolbar';
import useMergeValue from '../_util/hooks/useMergeValue';
import Portal from '../Portal';
import { PreviewGroupContext } from './previewGroupContext';
import ImagePreviewArrow from './image-preview-arrow';
import useOverflowHidden from '../_util/hooks/useOverflowHidden';
import { Esc } from '../_util/keycode';
import useUpdate from '../_util/hooks/useUpdate';
var ROTATE_STEP = 90;
function Preview(props, ref) {
    var _a, _b;
    var className = props.className, style = props.style, src = props.src, defaultVisible = props.defaultVisible, _c = props.maskClosable, maskClosable = _c === void 0 ? true : _c, _d = props.closable, closable = _d === void 0 ? true : _d, _e = props.breakPoint, breakPoint = _e === void 0 ? 316 : _e, actions = props.actions, _f = props.actionsLayout, actionsLayout = _f === void 0 ? [
        'fullScreen',
        'rotateRight',
        'rotateLeft',
        'zoomIn',
        'zoomOut',
        'originalSize',
        'extra',
    ] : _f, _g = props.getPopupContainer, getPopupContainer = _g === void 0 ? function () { return document.body; } : _g, onVisibleChange = props.onVisibleChange, _h = props.scales, scales = _h === void 0 ? defaultScales : _h, _j = props.escToExit, escToExit = _j === void 0 ? true : _j;
    var _k = useContext(PreviewGroupContext), previewGroup = _k.previewGroup, previewUrlMap = _k.previewUrlMap, currentIndex = _k.currentIndex, setCurrentIndex = _k.setCurrentIndex, infinite = _k.infinite;
    var mergedSrc = previewGroup ? previewUrlMap.get(currentIndex) : src;
    var _l = __read(useState(mergedSrc), 2), previewImgSrc = _l[0], setPreviewImgSrc = _l[1];
    var _m = __read(useMergeValue(false, {
        defaultValue: defaultVisible,
        value: props.visible,
    }), 2), visible = _m[0], setVisible = _m[1];
    var globalContext = useContext(ConfigContext);
    var getPrefixCls = globalContext.getPrefixCls, locale = globalContext.locale;
    var prefixCls = getPrefixCls('image');
    var previewPrefixCls = prefixCls + "-preview";
    var classNames = cs(previewPrefixCls, (_a = {},
        _a[previewPrefixCls + "-hide"] = !visible,
        _a), className);
    var refImage = useRef();
    var refImageContainer = useRef();
    var refWrapper = useRef();
    var keyboardEventOn = useRef(false);
    var refMoveData = useRef({
        pageX: 0,
        pageY: 0,
        originX: 0,
        originY: 0,
    });
    var _o = useImageStatus('loading'), isLoading = _o.isLoading, isLoaded = _o.isLoaded, setStatus = _o.setStatus;
    var _p = __read(useState(false), 2), toolbarSimple = _p[0], setToolbarSimple = _p[1];
    var _q = __read(useState({ x: 0, y: 0 }), 2), translate = _q[0], setTranslate = _q[1];
    var _r = __read(useState(1), 2), scale = _r[0], setScale = _r[1];
    var _s = __read(useState(false), 2), scaleValueVisible = _s[0], setScaleValueVisible = _s[1];
    var _t = __read(useState(0), 2), rotate = _t[0], setRotate = _t[1];
    var _u = __read(useState(false), 2), moving = _u[0], setMoving = _u[1];
    var previewScales = useMemo(function () {
        return new PreviewScales(scales);
    }, []);
    // Reset image params
    function reset() {
        setTranslate({ x: 0, y: 0 });
        setScale(1);
        setRotate(0);
    }
    useImperativeHandle(ref, function () { return ({
        reset: reset,
    }); });
    var _v = __read(useState(), 2), container = _v[0], setContainer = _v[1];
    var getContainer = useCallback(function () { return container; }, [container]);
    useEffect(function () {
        var container = getPopupContainer && getPopupContainer();
        var containerDom = (findDOMNode(container) || document.body);
        setContainer(containerDom);
    }, [getPopupContainer]);
    useOverflowHidden(getContainer, { hidden: visible });
    var isFixed = useMemo(function () { return !isServerRendering && container === document.body; }, [container]);
    // Jump to image at the specified index
    function jumpTo(index) {
        var previewListLen = previewUrlMap.size;
        if (infinite) {
            index %= previewListLen;
            if (index < 0)
                index = previewListLen - Math.abs(index);
        }
        if (index !== currentIndex && index >= 0 && index <= previewListLen - 1) {
            setCurrentIndex(index);
        }
    }
    function onPrev() {
        jumpTo(currentIndex - 1);
    }
    function onNext() {
        jumpTo(currentIndex + 1);
    }
    // Anticlockwise rotation
    function onRotateLeft() {
        setRotate(rotate === 0 ? 360 - ROTATE_STEP : rotate - ROTATE_STEP);
    }
    // Clockwise rotation
    function onRotateRight() {
        setRotate((rotate + ROTATE_STEP) % 360);
    }
    // Scale
    var hideScaleTimer = useRef(null);
    var showScaleValue = function () {
        !scaleValueVisible && setScaleValueVisible(true);
        hideScaleTimer.current && clearTimeout(hideScaleTimer.current);
        hideScaleTimer.current = setTimeout(function () {
            setScaleValueVisible(false);
        }, 1000);
    };
    var onScaleChange = function (newScale) {
        if (scale !== newScale) {
            setScale(newScale);
            showScaleValue();
        }
    };
    function onZoomIn() {
        var newScale = previewScales.getNextScale(scale, 'zoomIn');
        onScaleChange(newScale);
    }
    function onZoomOut() {
        var newScale = previewScales.getNextScale(scale, 'zoomOut');
        onScaleChange(newScale);
    }
    function onResetScale() {
        onScaleChange(1);
    }
    function onFullScreen() {
        var wrapperRect = refWrapper.current.getBoundingClientRect();
        var imgRect = refImage.current.getBoundingClientRect();
        var newHeightScale = wrapperRect.height / (imgRect.height / scale);
        var newWidthScale = wrapperRect.width / (imgRect.width / scale);
        var newScale = Math.max(newHeightScale, newWidthScale);
        onScaleChange(newScale);
    }
    // Image container is clicked
    function onOutsideImgClick(e) {
        if (e.target === e.currentTarget && maskClosable) {
            close();
        }
    }
    // Close button is clicked.
    function onCloseClick() {
        close();
    }
    function close() {
        if (visible) {
            onVisibleChange && onVisibleChange(false, visible);
            setVisible(false);
        }
    }
    function onWrapperResize(entry) {
        if (entry && entry.length) {
            var wrapperRect = entry[0].contentRect;
            var nextSimple = wrapperRect.width < breakPoint;
            setToolbarSimple(nextSimple);
        }
    }
    // Check the translate and correct it if needed
    var checkAndFixTranslate = function () {
        if (!refWrapper.current || !refImage.current)
            return;
        var wrapperRect = refWrapper.current.getBoundingClientRect();
        var imgRect = refImage.current.getBoundingClientRect();
        var _a = __read(getFixTranslate(wrapperRect, imgRect, translate.x, translate.y, scale), 2), x = _a[0], y = _a[1];
        if (x !== translate.x || y !== translate.y) {
            setTranslate({
                x: x,
                y: y,
            });
        }
    };
    // Update position on moving if needed
    var onMoving = function (e) {
        if (visible && moving) {
            e.preventDefault && e.preventDefault();
            var _a = refMoveData.current, originX = _a.originX, originY = _a.originY, pageX = _a.pageX, pageY = _a.pageY;
            var nextX = originX + (e.pageX - pageX) / scale;
            var nextY = originY + (e.pageY - pageY) / scale;
            setTranslate({
                x: nextX,
                y: nextY,
            });
        }
    };
    var onMoveEnd = function (e) {
        e.preventDefault && e.preventDefault();
        setMoving(false);
    };
    // Record position data on move start
    var onMoveStart = function (e) {
        e.preventDefault && e.preventDefault();
        setMoving(true);
        var ev = e.type === 'touchstart' ? e.touches[0] : e;
        refMoveData.current.pageX = ev.pageX;
        refMoveData.current.pageY = ev.pageY;
        refMoveData.current.originX = translate.x;
        refMoveData.current.originY = translate.y;
    };
    useEffect(function () {
        if (visible && moving) {
            on(document, 'mousemove', onMoving, false);
            on(document, 'mouseup', onMoveEnd, false);
        }
        return function () {
            off(document, 'mousemove', onMoving, false);
            off(document, 'mouseup', onMoveEnd, false);
        };
    }, [visible, moving]);
    // Correct translate after moved
    useEffect(function () {
        if (!moving) {
            checkAndFixTranslate();
        }
    }, [moving, translate]);
    // Correct translate when scale changes
    useEffect(function () {
        checkAndFixTranslate();
    }, [scale]);
    // Reset when preview is opened
    useEffect(function () {
        if (visible) {
            reset();
        }
    }, [visible]);
    // Reset on first mount or image switches
    useEffect(function () {
        setPreviewImgSrc(mergedSrc);
        setStatus(mergedSrc ? 'loading' : 'loaded');
        reset();
    }, [mergedSrc]);
    useUpdate(function () {
        previewScales.updateScale(scales);
        setScale(1);
    }, [scales]);
    // Close when pressing esc
    useEffect(function () {
        var onKeyDown = function (e) {
            if (escToExit && e && e.key === Esc.key) {
                close();
            }
        };
        if (visible && !moving && !keyboardEventOn.current) {
            keyboardEventOn.current = true;
            on(document, 'keydown', onKeyDown);
        }
        return function () {
            keyboardEventOn.current = false;
            off(document, 'keydown', onKeyDown);
        };
    }, [visible, escToExit, moving]);
    var defaultActions = [
        {
            key: 'fullScreen',
            name: locale.ImagePreview.fullScreen,
            content: React.createElement(IconFullscreen, null),
            onClick: onFullScreen,
        },
        {
            key: 'rotateRight',
            name: locale.ImagePreview.rotateRight,
            content: React.createElement(IconRotateRight, null),
            onClick: onRotateRight,
        },
        {
            key: 'rotateLeft',
            name: locale.ImagePreview.rotateLeft,
            content: React.createElement(IconRotateLeft, null),
            onClick: onRotateLeft,
        },
        {
            key: 'zoomIn',
            name: locale.ImagePreview.zoomIn,
            content: React.createElement(IconZoomIn, null),
            onClick: onZoomIn,
            disabled: scale === previewScales.maxScale,
        },
        {
            key: 'zoomOut',
            name: locale.ImagePreview.zoomOut,
            content: React.createElement(IconZoomOut, null),
            onClick: onZoomOut,
            disabled: scale === previewScales.minScale,
        },
        {
            key: 'originalSize',
            name: locale.ImagePreview.originalSize,
            content: React.createElement(IconOriginalSize, null),
            onClick: onResetScale,
        },
    ];
    return (React.createElement(Portal, { visible: visible, forceRender: false, getContainer: getContainer },
        React.createElement(ConfigProvider, __assign({}, globalContext, { getPopupContainer: function () { return refWrapper.current; } }),
            React.createElement("div", { className: classNames, style: __assign(__assign({}, (style || {})), (isFixed ? {} : { zIndex: 'inherit', position: 'absolute' })) },
                React.createElement(CSSTransition, { in: visible, timeout: 400, appear: true, classNames: "fadeImage", mountOnEnter: true, unmountOnExit: false, onEnter: function (e) {
                        e.parentNode.style.display = 'block';
                        e.style.display = 'block';
                    }, onExited: function (e) {
                        e.parentNode.style.display = '';
                        e.style.display = 'none';
                    } },
                    React.createElement("div", { className: previewPrefixCls + "-mask" })),
                visible && (React.createElement(ResizeObserver, { onResize: onWrapperResize },
                    React.createElement("div", { ref: refWrapper, className: previewPrefixCls + "-wrapper", onClick: onOutsideImgClick },
                        React.createElement("div", { ref: refImageContainer, className: previewPrefixCls + "-img-container", style: { transform: "scale(" + scale + ", " + scale + ")" }, onClick: onOutsideImgClick },
                            React.createElement("img", { ref: refImage, className: cs(previewPrefixCls + "-img", (_b = {},
                                    _b[previewPrefixCls + "-img-moving"] = moving,
                                    _b)), style: {
                                    transform: "translate(" + translate.x + "px, " + translate.y + "px) rotate(" + rotate + "deg)",
                                }, onLoad: function () {
                                    setStatus('loaded');
                                }, onError: function () {
                                    setStatus('error');
                                }, onMouseDown: onMoveStart, key: previewImgSrc, src: previewImgSrc }),
                            isLoading && (React.createElement("div", { className: previewPrefixCls + "-loading" },
                                React.createElement(IconLoading, null)))),
                        React.createElement(CSSTransition, { in: scaleValueVisible, timeout: 400, appear: true, classNames: "fadeImage", unmountOnExit: true },
                            React.createElement("div", { className: previewPrefixCls + "-scale-value" },
                                (scale * 100).toFixed(0),
                                "%")),
                        isLoaded && (React.createElement(ImagePreviewToolbar, { prefixCls: prefixCls, previewPrefixCls: previewPrefixCls, actions: actions, actionsLayout: actionsLayout, defaultActions: defaultActions, simple: toolbarSimple })),
                        closable && (React.createElement("div", { className: previewPrefixCls + "-close-btn", onClick: onCloseClick },
                            React.createElement(IconClose, null))),
                        previewGroup && (React.createElement(ImagePreviewArrow, { previewCount: previewUrlMap.size, current: currentIndex, infinite: infinite, onPrev: onPrev, onNext: onNext })))))))));
}
var PreviewComponent = forwardRef(Preview);
PreviewComponent.displayName = 'ImagePreview';
export default PreviewComponent;
