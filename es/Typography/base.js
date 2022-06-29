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
import React, { useState, useContext, useRef } from 'react';
import useIsomorphicLayoutEffect from '../_util/hooks/useIsomorphicLayoutEffect';
import { ConfigContext } from '../ConfigProvider';
import Operations from './operations';
import cs from '../_util/classNames';
import EditContent from './edit-content';
import { isObject } from '../_util/is';
import useResizeObserver from '../_util/hooks/useResizeObserver';
import { measure } from './utils';
import Tooltip from '../Tooltip';
import Popover from '../Popover';
import { raf, caf } from '../_util/raf';
import omit from '../_util/omit';
import useUpdateEffect from '../_util/hooks/useUpdate';
import mergedToString from '../_util/mergedToString';
import useMergeValue from '../_util/hooks/useMergeValue';
function getClassNameAndComponentName(props, prefixCls) {
    var type = props.type, bold = props.bold, disabled = props.disabled, mark = props.mark, underline = props.underline, propDelete = props.delete, code = props.code;
    var component = [];
    var className = [];
    if (type) {
        className.push(prefixCls + "-" + type);
    }
    if (disabled) {
        className.push(prefixCls + "-disabled");
    }
    if (bold) {
        component.push('b');
    }
    if (underline) {
        component.push('u');
    }
    if (propDelete) {
        component.push('del');
    }
    if (code) {
        component.push('code');
    }
    if (mark) {
        component.push('mark');
    }
    return {
        component: component,
        className: className,
    };
}
function Base(props) {
    var componentType = props.componentType, style = props.style, className = props.className, children = props.children, editable = props.editable, ellipsis = props.ellipsis, heading = props.heading, blockquote = props.blockquote, copyable = props.copyable, rest = __rest(props, ["componentType", "style", "className", "children", "editable", "ellipsis", "heading", "blockquote", "copyable"]);
    var configContext = useContext(ConfigContext);
    var getPrefixCls = configContext.getPrefixCls;
    var prefixCls = getPrefixCls('typography');
    var rafId = useRef();
    var _a = getClassNameAndComponentName(props, prefixCls), component = _a.component, componentClassName = _a.className;
    var _b = __read(useState(false), 2), editing = _b[0], setEditing = _b[1];
    var _c = __read(useState(false), 2), isEllipsis = _c[0], setEllipsis = _c[1];
    var _d = __read(useState(''), 2), ellipsisText = _d[0], setEllipsisText = _d[1];
    var _e = __read(useState(false), 2), measuring = _e[0], setMeasuring = _e[1];
    var componentRef = useRef(null);
    var textWrapperRef = useRef(null);
    var editableConfig = isObject(editable) ? editable : {};
    var mergedEditing = 'editing' in editableConfig ? editableConfig.editing : editing;
    var ellipsisConfig = ellipsis
        ? __assign({ rows: 1, ellipsisStr: '...', cssEllipsis: true }, (isObject(ellipsis) ? ellipsis : {})) : {};
    function canSimpleEllipsis() {
        var rows = ellipsisConfig.rows, ellipsisStr = ellipsisConfig.ellipsisStr, suffix = ellipsisConfig.suffix, onEllipsis = ellipsisConfig.onEllipsis, expandable = ellipsisConfig.expandable, cssEllipsis = ellipsisConfig.cssEllipsis;
        if (!cssEllipsis) {
            return;
        }
        if (suffix || ellipsisStr !== '...')
            return;
        if (onEllipsis || expandable || onEllipsis)
            return;
        if (editable || copyable)
            return;
        return rows === 1;
    }
    var simpleEllipsis = canSimpleEllipsis();
    var _f = __read(useMergeValue(false, {
        defaultValue: ellipsisConfig.defaultExpanded,
        value: ellipsisConfig.expanded,
    }), 2), expanding = _f[0], setExpanding = _f[1];
    function renderOperations(forceShowExpand) {
        return (React.createElement(React.Fragment, null,
            React.createElement(Operations, __assign({}, props, { setEditing: setEditing, onClickExpand: onClickExpand, expanding: expanding, isEllipsis: isEllipsis, forceShowExpand: forceShowExpand, 
                // 如果是镜像dom的话，渲染在最外层，无法从context中拿到最新config
                currentContext: configContext }))));
    }
    function onClickExpand(e) {
        setExpanding(!expanding);
        props.onClickExpand && props.onClickExpand(e);
        ellipsisConfig.onExpand && ellipsisConfig.onExpand(!expanding, e);
    }
    var resizeOnNextFrame = function () {
        caf(rafId.current);
        rafId.current = raf(function () {
            calcEllipsis();
        });
    };
    var _g = useResizeObserver(resizeOnNextFrame), cor = _g.cor, dor = _g.dor;
    useUpdateEffect(function () {
        ellipsisConfig.onEllipsis && ellipsisConfig.onEllipsis(isEllipsis);
    }, [isEllipsis]);
    useIsomorphicLayoutEffect(function () {
        if (componentRef.current) {
            cor(componentRef.current);
        }
        return function () {
            dor();
            caf(rafId.current);
        };
    }, [
        children,
        expanding,
        editing,
        ellipsisConfig.suffix,
        ellipsisConfig.ellipsisStr,
        ellipsisConfig.expandable,
        ellipsisConfig.expandNodes,
        ellipsisConfig.rows,
        ellipsisConfig.cssEllipsis,
    ]);
    function calcEllipsis() {
        if (editing) {
            return;
        }
        if (ellipsisConfig.rows) {
            setMeasuring(true);
            var _a = measure(textWrapperRef.current || componentRef.current, ellipsisConfig, renderOperations(!!ellipsisConfig.expandable), children, 
            // expanding 情况下只需要判断原空间是否足够，不用计算折叠临界值，
            simpleEllipsis || expanding), ellipsis_1 = _a.ellipsis, text = _a.text;
            setMeasuring(false);
            if (ellipsis_1 && text) {
                setEllipsisText(text);
            }
            setEllipsis(ellipsis_1);
        }
        else {
            var isEllipsis_1 = !!ellipsisConfig.rows;
            setEllipsis(isEllipsis_1);
        }
    }
    function wrap(content, component, props) {
        var currentContent = content;
        // 折叠计算前把行内元素改为块级元素。
        var ellipsisStyle = ellipsisConfig.rows && !simpleEllipsis ? { display: 'block' } : {};
        component.forEach(function (c, index) {
            var _props = isObject(props.mark) && props.mark.color
                ? { style: __assign({ backgroundColor: props.mark.color }, ellipsisStyle) }
                : { style: ellipsisStyle };
            // The parent node of the text will affect the style of the mirror dom
            var _ref = index === 0 ? { ref: textWrapperRef } : {};
            currentContent = React.createElement(c, __assign(__assign({}, _props), _ref), currentContent);
        });
        return currentContent;
    }
    function renderContent() {
        var _a;
        var fullText = mergedToString(React.Children.toArray(children));
        var ellipsisStr = ellipsisConfig.ellipsisStr !== undefined ? ellipsisConfig.ellipsisStr : '...';
        var suffix = ellipsisConfig.suffix !== undefined && ellipsisConfig.suffix;
        var showTooltip = ellipsisConfig.showTooltip;
        var tooltipType = isObject(ellipsisConfig.showTooltip)
            ? ellipsisConfig.showTooltip.type === 'popover'
                ? 'popover'
                : 'tooltip'
            : 'tooltip';
        var tooltipProps = isObject(ellipsisConfig.showTooltip)
            ? ellipsisConfig.showTooltip.props || {}
            : {};
        var TooltipComponent = (tooltipType === 'popover' ? Popover : Tooltip);
        var titleProps = isEllipsis && !showTooltip && !expanding ? { title: fullText } : {};
        var baseProps = __assign({ ref: componentRef, style: style }, titleProps);
        var addTooltip = isEllipsis && showTooltip && !expanding;
        function renderInnerContent() {
            var text = isEllipsis && !expanding ? ellipsisText : children;
            var innerText = component.length ? wrap(text, component, props) : text;
            if (ellipsisConfig.rows && !simpleEllipsis && component.length) {
                var node_1 = (React.createElement(React.Fragment, null,
                    addTooltip ? React.createElement("span", null, text) : text,
                    measuring || (isEllipsis && !expanding && !simpleEllipsis) ? ellipsisStr : null,
                    suffix,
                    renderOperations(measuring ? !!ellipsisConfig.expandable : undefined)));
                return wrap(node_1, component, props);
            }
            return (React.createElement(React.Fragment, null,
                addTooltip ? React.createElement("span", null, innerText) : innerText,
                measuring || (isEllipsis && !expanding && !simpleEllipsis) ? ellipsisStr : null,
                suffix,
                renderOperations(measuring ? !!ellipsisConfig.expandable : undefined)));
        }
        var TextComponent;
        if (componentType === 'Paragraph') {
            TextComponent = blockquote ? 'blockquote' : 'div';
        }
        else if (componentType === 'Title') {
            TextComponent = "h" + heading;
        }
        else if (componentType === 'Text') {
            TextComponent = ellipsis ? 'div' : 'span';
        }
        var node = (React.createElement(TextComponent, __assign({ className: cs(prefixCls, (_a = {}, _a[prefixCls + "-simple-ellipsis"] = simpleEllipsis && !expanding, _a), componentClassName, className) }, baseProps, omit(rest, [
            'spacing',
            'type',
            'close',
            'bold',
            'disabled',
            'mark',
            'underline',
            'delete',
            'code',
            'copyable',
            'isEllipsis',
            'expanding',
            'onClickExpand',
            'setEditing',
            'forceShowExpand',
        ])), renderInnerContent()));
        if (addTooltip) {
            return (React.createElement(TooltipComponent, __assign({ content: fullText }, tooltipProps), node));
        }
        return node;
    }
    return mergedEditing ? (React.createElement(EditContent, __assign({}, props, { prefixCls: prefixCls, setEditing: setEditing, editableConfig: editableConfig }))) : (renderContent());
}
export default Base;
