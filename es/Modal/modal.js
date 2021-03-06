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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
import { findDOMNode } from 'react-dom';
import React, { useState, forwardRef, useContext, useRef, useEffect, useCallback, } from 'react';
import { CSSTransition } from 'react-transition-group';
import FocusLock from 'react-focus-lock';
import IconClose from '../../icon/react-icon/IconClose';
import cs from '../_util/classNames';
import { isServerRendering } from '../_util/dom';
import { Esc } from '../_util/keycode';
import Button from '../Button';
import Portal from '../Portal';
import confirm from './confirm';
import ConfigProvider, { ConfigContext } from '../ConfigProvider';
import IconHover from '../_class/icon-hover';
import { setModalConfig, destroyList } from './config';
import { isFunction, isObject } from '../_util/is';
import omit from '../_util/omit';
import useOverflowHidden from '../_util/hooks/useOverflowHidden';
import useModal from './useModal';
import useMergeValue from '../_util/hooks/useMergeValue';
import useMergeProps from '../_util/hooks/useMergeProps';
var cursorPosition = null;
var globalDialogIndex = 0;
if (!isServerRendering) {
    document.documentElement.addEventListener('click', function (e) {
        cursorPosition = {
            left: e.clientX,
            top: e.clientY,
        };
        // ????????????????????????????????????????????????????????????????????????????????? UI ??????????????????????????????????????????
        setTimeout(function () {
            cursorPosition = null;
        }, 100);
    }, true);
}
var defaultProps = {
    mask: true,
    maskClosable: true,
    mountOnEnter: true,
    escToExit: true,
    getPopupContainer: function () { return document.body; },
    alignCenter: true,
};
function Modal(baseProps, ref) {
    var _a, _b;
    var _c;
    var context = useContext(ConfigContext);
    var props = useMergeProps(baseProps, defaultProps, (_c = context.componentConfig) === null || _c === void 0 ? void 0 : _c.Modal);
    var className = props.className, style = props.style, visible = props.visible, simple = props.simple, title = props.title, children = props.children, cancelText = props.cancelText, okText = props.okText, okButtonProps = props.okButtonProps, cancelButtonProps = props.cancelButtonProps, _d = props.getPopupContainer, getPopupContainer = _d === void 0 ? function () { return document.body; } : _d, footer = props.footer, afterClose = props.afterClose, confirmLoading = props.confirmLoading, mountOnEnter = props.mountOnEnter, unmountOnExit = props.unmountOnExit, afterOpen = props.afterOpen, hideCancel = props.hideCancel, autoFocus = props.autoFocus, focusLock = props.focusLock, maskClosable = props.maskClosable, mask = props.mask, alignCenter = props.alignCenter, getChildrenPopupContainer = props.getChildrenPopupContainer, wrapClassName = props.wrapClassName, escToExit = props.escToExit, modalRender = props.modalRender, maskStyle = props.maskStyle, wrapStyle = props.wrapStyle, closeIcon = props.closeIcon, rest = __rest(props, ["className", "style", "visible", "simple", "title", "children", "cancelText", "okText", "okButtonProps", "cancelButtonProps", "getPopupContainer", "footer", "afterClose", "confirmLoading", "mountOnEnter", "unmountOnExit", "afterOpen", "hideCancel", "autoFocus", "focusLock", "maskClosable", "mask", "alignCenter", "getChildrenPopupContainer", "wrapClassName", "escToExit", "modalRender", "maskStyle", "wrapStyle", "closeIcon"]);
    var modalWrapperRef = useRef(null);
    var contentWrapper = useRef(null);
    var _e = __read(useState(visible), 2), wrapperVisible = _e[0], setWrapperVisible = _e[1];
    var _f = __read(useState(), 2), popupZIndex = _f[0], setPopupZIndex = _f[1];
    var cursorPositionRef = useRef(null);
    var haveOriginTransformOrigin = useRef(false);
    var maskClickRef = useRef(false);
    var dialogIndex = useRef();
    if (!dialogIndex.current) {
        dialogIndex.current = globalDialogIndex++;
    }
    var _g = __read(useMergeValue(false, {
        defaultValue: false,
        value: confirmLoading,
    }), 2), loading = _g[0], setLoading = _g[1];
    var prefixCls = context.getPrefixCls('modal', props.prefixCls);
    var locale = context.locale;
    // ??????????????????????????????????????????
    var defaultClosable = !simple;
    var closable = 'closable' in props ? props.closable : defaultClosable;
    var getContainer = useCallback(function () {
        return findDOMNode(getPopupContainer());
    }, [getPopupContainer]);
    useOverflowHidden(getContainer, { hidden: visible && mask });
    var onCancel = function () {
        props.onCancel && props.onCancel();
    };
    var onEscExit = function (event) {
        if (escToExit && visible && event.key === Esc.key) {
            event.stopPropagation();
            onCancel();
        }
    };
    var inExit = useRef(false);
    var onClickMask = function (e) {
        if (!maskClickRef.current)
            return;
        maskClickRef.current = false;
        if (!inExit.current && maskClosable && mask && e.target === e.currentTarget) {
            setTimeout(function () {
                onCancel();
            }, 100);
        }
    };
    var onConfirmModal = function (e) {
        var onConfirm = props.onConfirm, onOk = props.onOk;
        var _onConfirm = onOk || onConfirm;
        var ret;
        if (_onConfirm) {
            ret = _onConfirm(e);
        }
        if (ret && ret.then) {
            setLoading(true);
            ret.then(function () {
                setLoading(false);
            }, function (e) {
                setLoading(false);
                console.error(e);
            });
        }
    };
    useEffect(function () {
        var timer = null;
        if (escToExit) {
            timer = setTimeout(function () {
                var _a;
                (_a = modalWrapperRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            });
        }
        return function () {
            timer && clearTimeout(timer);
        };
    }, [visible, escToExit]);
    useEffect(function () {
        var _a;
        if (visible && popupZIndex === undefined) {
            if (modalWrapperRef.current) {
                // ??????wrapper???zindex???????????????????????????????????????zindex???
                var zIndex = +((_a = window.getComputedStyle(modalWrapperRef.current, null)) === null || _a === void 0 ? void 0 : _a.zIndex);
                if (!isNaN(zIndex)) {
                    setPopupZIndex(zIndex + 1);
                }
            }
        }
    }, [visible, popupZIndex]);
    var renderFooter = function () {
        if (footer === null)
            return;
        var cancelButtonNode = (React.createElement(Button, __assign({ onClick: onCancel }, cancelButtonProps), cancelText || locale.Modal.cancelText));
        var okButtonNode = (React.createElement(Button, __assign({ loading: loading, onClick: onConfirmModal, type: "primary" }, okButtonProps), okText || locale.Modal.okText));
        var footerContent = footer || (React.createElement(React.Fragment, null,
            !hideCancel && cancelButtonNode,
            okButtonNode));
        if (isFunction(footer)) {
            footerContent = footer(cancelButtonNode, okButtonNode);
        }
        return React.createElement("div", { className: prefixCls + "-footer" }, footerContent);
    };
    var globalFocusLockConfig = context.focusLock.modal;
    var globalFocusLock = !!globalFocusLockConfig;
    var globalAutoFocus = isObject(globalFocusLockConfig) && globalFocusLockConfig.autoFocus;
    var innerFocusLock = focusLock !== undefined ? focusLock : globalFocusLock;
    var innerAutoFocus = autoFocus !== undefined ? autoFocus : globalAutoFocus;
    var element = (React.createElement(ConfigProvider, __assign({}, context, { prefixCls: props.prefixCls || context.prefixCls, locale: locale, zIndex: popupZIndex || 1050, getPopupContainer: function (node) {
            return typeof getChildrenPopupContainer === 'function'
                ? getChildrenPopupContainer(node)
                : contentWrapper.current;
        } }),
        title && (React.createElement("div", { className: prefixCls + "-header" },
            React.createElement("div", { className: prefixCls + "-title", id: "arco-dialog-" + dialogIndex.current }, title))),
        React.createElement("div", { ref: contentWrapper, className: prefixCls + "-content" }, children),
        renderFooter(),
        closable &&
            (closeIcon !== undefined ? (React.createElement("span", { onClick: onCancel, className: prefixCls + "-close-icon" }, closeIcon)) : (React.createElement(IconHover, { tabIndex: -1, onClick: onCancel, className: prefixCls + "-close-icon", role: "button", "aria-label": "Close" },
                React.createElement(IconClose, null))))));
    var ariaProps = title ? { 'aria-labelledby': "arco-dialog-" + dialogIndex.current } : {};
    var modalDom = (React.createElement("div", __assign({ role: "dialog" }, ariaProps, { className: cs(prefixCls, (_a = {},
            _a[prefixCls + "-simple"] = simple,
            _a), className), style: style }), innerFocusLock ? (React.createElement(FocusLock, { disabled: !visible, autoFocus: innerAutoFocus, lockProps: {
            tabIndex: -1,
            onKeyDown: onEscExit,
        } }, element)) : (element)));
    var setTransformOrigin = function (e) {
        if (haveOriginTransformOrigin.current)
            return;
        var transformOrigin = '';
        if (cursorPositionRef.current) {
            var eRect = e.getBoundingClientRect();
            var _a = cursorPositionRef.current, left = _a.left, top_1 = _a.top;
            transformOrigin = left - eRect.left + "px " + (top_1 - eRect.top) + "px";
        }
        e.style.transformOrigin = transformOrigin;
    };
    return (React.createElement(Portal, { visible: visible, forceRender: !mountOnEnter, getContainer: getPopupContainer },
        React.createElement("div", { ref: ref },
            mask ? (React.createElement(CSSTransition, { in: visible, timeout: 400, appear: true, mountOnEnter: mountOnEnter, classNames: "fadeModal", unmountOnExit: unmountOnExit, onEnter: function (e) {
                    e.style.display = 'block';
                }, onExited: function (e) {
                    e.style.display = 'none';
                } },
                React.createElement("div", { "aria-hidden": true, className: prefixCls + "-mask", style: maskStyle }))) : null,
            React.createElement("div", __assign({}, omit(rest, [
                'content',
                'icon',
                'showIcon',
                'isNotice',
                'noticeType',
                'onCancel',
                'onOk',
                'onConfirm',
                'closable',
                'prefixCls',
            ]), { tabIndex: !innerFocusLock || !innerAutoFocus ? -1 : null, ref: modalWrapperRef, className: cs(prefixCls + "-wrapper", (_b = {},
                    _b[prefixCls + "-wrapper-no-mask"] = !mask,
                    _b[prefixCls + "-wrapper-align-center"] = alignCenter,
                    _b), wrapClassName), style: __assign(__assign({}, (wrapStyle || {})), { 
                    // ?????? visible=false???????????????display:none?????????modal??????react-monaco-editor?????????????????????????????????
                    display: visible || wrapperVisible ? 'block' : 'none', overflow: !visible && wrapperVisible ? 'hidden' : '' }), 
                // ?????? autoFocus ??? false ????????? modal ???????????? onKeyDown, ???????????? FocusLock ????????? onKeyDown ????????????
                onKeyDown: !innerFocusLock || !innerAutoFocus ? onEscExit : null, onMouseDown: function (e) {
                    maskClickRef.current = e.target === e.currentTarget;
                }, onClick: onClickMask }),
                React.createElement(CSSTransition, { in: visible, timeout: 400, appear: true, classNames: "zoomModal", unmountOnExit: unmountOnExit, mountOnEnter: mountOnEnter, onEnter: function (e) {
                        setWrapperVisible(true);
                        cursorPositionRef.current = cursorPosition;
                        haveOriginTransformOrigin.current = !!e.style.transformOrigin;
                        setTransformOrigin(e);
                    }, onEntered: function (e) {
                        setTransformOrigin(e);
                        cursorPositionRef.current = null;
                        afterOpen && afterOpen();
                    }, onExit: function () {
                        inExit.current = true;
                    }, onExited: function (e) {
                        setWrapperVisible(false);
                        setTransformOrigin(e);
                        afterClose && afterClose();
                        inExit.current = false;
                    } }, React.cloneElement((isFunction(modalRender) ? modalRender(modalDom) : modalDom), {
                    onMouseDown: function () {
                        maskClickRef.current = false;
                    },
                    onMouseUp: function () {
                        maskClickRef.current = false;
                    },
                }))))));
}
var ExportedModalComponent = forwardRef(Modal);
ExportedModalComponent.displayName = 'Modal';
ExportedModalComponent.config = setModalConfig;
ExportedModalComponent.confirm = function (props) {
    return confirm(props);
};
ExportedModalComponent.useModal = useModal;
['info', 'success', 'warning', 'error'].forEach(function (type) {
    ExportedModalComponent[type] = function (props) {
        return confirm(__assign(__assign({}, props), { isNotice: true, noticeType: type }));
    };
});
ExportedModalComponent.destroyAll = function () {
    while (destroyList.length) {
        var close_1 = destroyList.pop();
        if (close_1) {
            close_1();
        }
    }
};
export default ExportedModalComponent;
