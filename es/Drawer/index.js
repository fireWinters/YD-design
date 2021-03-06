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
import React, { useContext, useRef, useEffect, useCallback, useMemo, useState, useImperativeHandle, } from 'react';
import { CSSTransition } from 'react-transition-group';
import FocusLock from 'react-focus-lock';
import { findDOMNode } from 'react-dom';
import IconClose from '../../icon/react-icon/IconClose';
import cs from '../_util/classNames';
import Button from '../Button';
import Portal from '../Portal';
import ConfigProvider, { ConfigContext } from '../ConfigProvider';
import { isServerRendering, off, on } from '../_util/dom';
import IconHover from '../_class/icon-hover';
import { Esc } from '../_util/keycode';
import { isObject } from '../_util/is';
import useOverflowHidden from '../_util/hooks/useOverflowHidden';
import useMergeProps from '../_util/hooks/useMergeProps';
var defaultProps = {
    placement: 'right',
    width: 250,
    height: 250,
    escToExit: true,
    mask: true,
    closable: true,
    maskClosable: true,
    mountOnEnter: true,
    getPopupContainer: function () { return document.body; },
};
function Drawer(baseProps, ref) {
    var _a, _b, _c;
    var context = useContext(ConfigContext);
    var locale = context.locale, getPrefixCls = context.getPrefixCls, componentConfig = context.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Drawer);
    var style = props.style, className = props.className, children = props.children, wrapClassName = props.wrapClassName, maskStyle = props.maskStyle, headerStyle = props.headerStyle, bodyStyle = props.bodyStyle, title = props.title, footer = props.footer, okText = props.okText, cancelText = props.cancelText, width = props.width, height = props.height, placement = props.placement, mask = props.mask, visible = props.visible, closable = props.closable, maskClosable = props.maskClosable, confirmLoading = props.confirmLoading, mountOnEnter = props.mountOnEnter, unmountOnExit = props.unmountOnExit, afterOpen = props.afterOpen, afterClose = props.afterClose, getPopupContainer = props.getPopupContainer, escToExit = props.escToExit, propGetChildrenPopupContainer = props.getChildrenPopupContainer, focusLock = props.focusLock, autoFocus = props.autoFocus, okButtonProps = props.okButtonProps, cancelButtonProps = props.cancelButtonProps;
    var drawerWrapperRef = useRef(null);
    var contentWrapperRef = useRef(null);
    var _d = __read(useState(false), 2), shouldReComputeFixed = _d[0], setShouldReComputeFixed = _d[1];
    var _e = __read(useState(), 2), popupZIndex = _e[0], setPopupZIndex = _e[1];
    var prefixCls = getPrefixCls('drawer');
    // Record whether is exiting, to prevent `onCancel` being unnecessarily triggered when mask is clicked during the period.
    var inExit = useRef(false);
    // Record whether it's opened to avoid element shaking during animation caused by focus lock.
    var _f = __read(useState(false), 2), isOpened = _f[0], setIsOpened = _f[1];
    var getContainer = useCallback(function () {
        var container = getPopupContainer && getPopupContainer();
        return (findDOMNode(container) || document.body);
    }, [getPopupContainer]);
    var isFixed = useMemo(function () {
        return !isServerRendering && getContainer() === document.body;
    }, [shouldReComputeFixed, getContainer]);
    useOverflowHidden(getContainer, { hidden: visible && mask });
    useImperativeHandle(ref, function () { return drawerWrapperRef.current; });
    useEffect(function () {
        // ????????????????????????????????? getPopupContainer ???????????????????????????????????? isFixed ???????????????????????? getPopupContainer ???????????????????????????????????? isFixed ???true?????????????????????????????????
        if (visible && props.getPopupContainer) {
            // Recompute `isFixed` to avoid style error resulting from truthy `isFixed` value due to the custom container dom is not mounted yet.
            setShouldReComputeFixed(true);
        }
    }, []);
    useEffect(function () {
        var _a;
        if (visible && popupZIndex === undefined) {
            if (drawerWrapperRef.current) {
                // Set zIndex for nested drawer components based on zIndex of wrapper
                var zIndex = +((_a = window.getComputedStyle(drawerWrapperRef.current, null)) === null || _a === void 0 ? void 0 : _a.zIndex);
                if (!isNaN(zIndex)) {
                    setPopupZIndex(zIndex + 1);
                }
            }
        }
    }, [visible, popupZIndex]);
    useEffect(function () {
        var onKeyDown = function (e) {
            if (escToExit && e && e.key === Esc.key && props.onCancel) {
                props.onCancel(e);
            }
        };
        if (visible) {
            on(document, 'keydown', onKeyDown);
        }
        return function () {
            off(document, 'keydown', onKeyDown);
        };
    }, [visible, escToExit]);
    var element = (React.createElement("div", { className: prefixCls + "-scroll" },
        title !== null && (React.createElement("div", { className: prefixCls + "-header", style: headerStyle },
            React.createElement("div", { className: prefixCls + "-header-title" }, title))),
        closable && (React.createElement(IconHover, { onClick: props.onCancel, className: prefixCls + "-close-icon" },
            React.createElement(IconClose, null))),
        React.createElement("div", { ref: contentWrapperRef, style: bodyStyle, className: cs(prefixCls + "-content", (_a = {},
                _a[prefixCls + "-content-nofooter"] = footer === null,
                _a[prefixCls + "-content-noheader"] = title === null,
                _a)) },
            React.createElement(ConfigProvider, __assign({}, context, { zIndex: popupZIndex || 1050, getPopupContainer: function (node) {
                    return typeof propGetChildrenPopupContainer === 'function'
                        ? propGetChildrenPopupContainer(node)
                        : contentWrapperRef.current;
                } }), children)),
        footer !== null &&
            (footer ? (React.createElement("div", { className: prefixCls + "-footer" }, footer)) : (React.createElement("div", { className: prefixCls + "-footer" },
                React.createElement(Button, __assign({ onClick: props.onCancel }, cancelButtonProps), cancelText || locale.Drawer.cancelText),
                React.createElement(Button, __assign({ type: "primary", loading: confirmLoading, onClick: props.onOk }, okButtonProps), okText || locale.Drawer.okText))))));
    var globalFocusLockConfig = context.focusLock.drawer;
    var globalFocusLock = !!globalFocusLockConfig;
    var globalAutoFocus = isObject(globalFocusLockConfig) && globalFocusLockConfig.autoFocus;
    var innerFocusLock = focusLock !== undefined ? focusLock : globalFocusLock;
    var innerAutoFocus = autoFocus !== undefined ? autoFocus : globalAutoFocus;
    // Only enable FocusLock when drawer is fully opened, to avoid element shaking.
    var dom = innerFocusLock ? (React.createElement(FocusLock, { as: "span", disabled: !isOpened, autoFocus: innerAutoFocus }, element)) : (element);
    return (React.createElement(Portal, { forceRender: !mountOnEnter, visible: visible, getContainer: getPopupContainer },
        React.createElement("div", { ref: drawerWrapperRef, className: cs(prefixCls + "-wrapper", (_b = {},
                _b[prefixCls + "-no-mask"] = !mask,
                _b[prefixCls + "-wrapper-hide"] = !visible,
                _b), wrapClassName), style: isFixed ? { position: 'fixed' } : { zIndex: 'inherit', position: 'absolute' } },
            mask ? (React.createElement(CSSTransition, { in: visible, appear: true, timeout: 300, classNames: "fadeInStandard", mountOnEnter: mountOnEnter, unmountOnExit: unmountOnExit },
                React.createElement("div", { className: prefixCls + "-mask", style: maskStyle, onClick: function (e) {
                        if (!inExit.current && maskClosable) {
                            props.onCancel && props.onCancel(e);
                        }
                    } }))) : null,
            React.createElement(CSSTransition, { in: visible, appear: true, timeout: 300, classNames: {
                    top: 'slideTop',
                    bottom: 'slideBottom',
                    left: 'slideLeft',
                    right: 'slideRight',
                }[placement], mountOnEnter: mountOnEnter, unmountOnExit: unmountOnExit, onEnter: function (e) {
                    e.parentNode.style.display = 'block';
                }, onEntered: function () {
                    setIsOpened(true);
                    afterOpen && afterOpen();
                }, onExit: function () {
                    setIsOpened(false);
                    inExit.current = true;
                }, onExited: function (e) {
                    inExit.current = false;
                    e.parentNode.style.display = ''; // don't set display='none'
                    afterClose && afterClose();
                } },
                React.createElement("div", { className: cs(prefixCls, className), style: Object.assign(placement === 'left' || placement === 'right' ? { width: width } : { height: height }, (_c = {}, _c[placement] = 0, _c), style) },
                    React.createElement("div", { className: prefixCls + "-inner" },
                        React.createElement(ConfigProvider, __assign({}, context, { zIndex: popupZIndex || 1050 }), dom)))))));
}
var DrawerComponent = React.forwardRef(Drawer);
DrawerComponent.displayName = 'Drawer';
export default DrawerComponent;
