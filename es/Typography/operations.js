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
import React, { useState, useRef, useEffect } from 'react';
import Tooltip from '../Tooltip';
import { isObject, isArray } from '../_util/is';
import copy from '../_util/clipboard';
import IconCopy from '../../icon/react-icon/IconCopy';
import IconCheckCircleFill from '../../icon/react-icon/IconCheckCircleFill';
import IconEdit from '../../icon/react-icon/IconEdit';
import mergedToString from '../_util/mergedToString';
export default function Operations(props) {
    var children = props.children, copyable = props.copyable, editable = props.editable, ellipsis = props.ellipsis, expanding = props.expanding, setEditing = props.setEditing, onClickExpand = props.onClickExpand, forceShowExpand = props.forceShowExpand, isEllipsis = props.isEllipsis, _a = props.currentContext, currentContext = _a === void 0 ? {} : _a;
    var getPrefixCls = currentContext.getPrefixCls, locale = currentContext.locale;
    var prefixCls = getPrefixCls('typography');
    var _b = __read(useState(false), 2), isCopied = _b[0], setCopied = _b[1];
    var copyTimer = useRef(null);
    var copyConfig = isObject(copyable) ? copyable : {};
    var ellipsisConfig = isObject(ellipsis) ? ellipsis : {};
    var editableConfig = isObject(editable) ? editable : {};
    var expandNodes = isArray(ellipsisConfig.expandNodes)
        ? ellipsisConfig.expandNodes
        : [locale.Typography.fold, locale.Typography.unfold];
    useEffect(function () {
        return function () {
            clearTimeout(copyTimer.current);
            copyTimer.current = null;
        };
    }, []);
    function onClickCopy(e) {
        if (isCopied)
            return;
        var text = copyConfig.text !== undefined ? copyConfig.text : mergedToString(children);
        copy(text);
        setCopied(true);
        copyConfig.onCopy && copyConfig.onCopy(text, e);
        copyTimer.current = setTimeout(function () {
            setCopied(false);
        }, 3000);
    }
    var tooltips = copyConfig.tooltips || [locale.Typography.copy, locale.Typography.copied];
    var copyElement = copyable && (React.createElement(Tooltip, { content: isCopied ? tooltips[1] : tooltips[0] },
        React.createElement("span", { className: isCopied ? prefixCls + "-operation-copied" : prefixCls + "-operation-copy", onClick: onClickCopy }, isCopied ? React.createElement(IconCheckCircleFill, null) : copyConfig.icon || React.createElement(IconCopy, null))));
    var editElement = editable && (React.createElement(Tooltip, { content: locale.Typography.edit },
        React.createElement("span", { className: prefixCls + "-operation-edit", onClick: function (e) {
                editableConfig.onStart && editableConfig.onStart(mergedToString(children), e);
                setEditing(true);
            } },
            React.createElement(IconEdit, null))));
    var ellipsisElement = forceShowExpand || (ellipsisConfig.expandable && isEllipsis) ? (React.createElement("a", { className: prefixCls + "-operation-expand", onClick: onClickExpand }, expanding ? expandNodes[0] : expandNodes[1])) : null;
    return (React.createElement(React.Fragment, null,
        ellipsisElement,
        editElement,
        copyElement));
}
