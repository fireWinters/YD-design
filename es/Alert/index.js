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
import React, { useState, useContext, forwardRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import IconCheckCircleFill from '../../icon/react-icon/IconCheckCircleFill';
import IconCloseCircleFill from '../../icon/react-icon/IconCloseCircleFill';
import IconInfoCircleFill from '../../icon/react-icon/IconInfoCircleFill';
import IconExclamationCircleFill from '../../icon/react-icon/IconExclamationCircleFill';
import IconClose from '../../icon/react-icon/IconClose';
import cs from '../_util/classNames';
import { ConfigContext } from '../ConfigProvider';
import useMergeProps from '../_util/hooks/useMergeProps';
var defaultProps = {
    showIcon: true,
    type: 'info',
};
function Alert(baseProps, ref) {
    var _a;
    var _b = useContext(ConfigContext), getPrefixCls = _b.getPrefixCls, componentConfig = _b.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Alert);
    var style = props.style, className = props.className, action = props.action, _c = props.type, type = _c === void 0 ? 'info' : _c, title = props.title, content = props.content, icon = props.icon, showIcon = props.showIcon, closable = props.closable, closeable = props.closeable, afterClose = props.afterClose, onClose = props.onClose, closeElement = props.closeElement, banner = props.banner;
    var prefixCls = getPrefixCls('alert');
    var _d = __read(useState(true), 2), visible = _d[0], setVisible = _d[1];
    function renderIcon(type) {
        if (icon) {
            return icon;
        }
        switch (type) {
            case 'info':
                return React.createElement(IconInfoCircleFill, null);
            case 'success':
                return React.createElement(IconCheckCircleFill, null);
            case 'warning':
                return React.createElement(IconExclamationCircleFill, null);
            case 'error':
                return React.createElement(IconCloseCircleFill, null);
            default:
                return null;
        }
    }
    function onHandleClose(e) {
        setVisible(false);
        onClose && onClose(e);
    }
    var classNames = cs(prefixCls, prefixCls + "-" + type, (_a = {},
        _a[prefixCls + "-with-title"] = title,
        _a[prefixCls + "-banner"] = banner,
        _a), className);
    var _closable = 'closeable' in props ? closeable : closable;
    return (React.createElement(CSSTransition, { in: visible, timeout: 300, classNames: "zoomInTop", unmountOnExit: true, onExited: function () {
            afterClose && afterClose();
        } },
        React.createElement("div", { ref: ref, style: style, className: classNames, role: "alert" },
            showIcon && React.createElement("div", { className: prefixCls + "-icon-wrapper" }, renderIcon(type)),
            React.createElement("div", { className: prefixCls + "-content-wrapper" },
                title && React.createElement("div", { className: prefixCls + "-title" }, title),
                content && React.createElement("div", { className: prefixCls + "-content" }, content)),
            action && React.createElement("div", { className: prefixCls + "-action" }, action),
            _closable && (React.createElement("button", { onClick: onHandleClose, className: prefixCls + "-close-btn" }, closeElement || React.createElement(IconClose, null))))));
}
var AlertComponent = forwardRef(Alert);
AlertComponent.displayName = 'Alert';
export default AlertComponent;
