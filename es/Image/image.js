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
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import cs from '../_util/classNames';
import { ConfigContext } from '../ConfigProvider';
import IconLoading from '../../icon/react-icon/IconLoading';
import IconImageClose from '../../icon/react-icon/IconImageClose';
import { ImageFooter } from './image-footer';
import ImagePreview from './image-preview';
import ImagePreviewGroup from './image-preview-group';
import useShowFooter from './utils/hooks/useShowFooter';
import useImageStatus from './utils/hooks/useImageStatus';
import useMergeValue from '../_util/hooks/useMergeValue';
import omit from '../_util/omit';
import { isNumber } from '../_util/is';
import { PreviewGroupContext } from './previewGroupContext';
import { isServerRendering } from '../_util/dom';
import useMergeProps from '../_util/hooks/useMergeProps';
var uuid = 0;
var defaultProps = {
    footerPosition: 'inner',
    preview: true,
};
function Image(baseProps, ref) {
    var _a;
    var _b = useContext(ConfigContext), getPrefixCls = _b.getPrefixCls, componentConfig = _b.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Image);
    var style = props.style, className = props.className, src = props.src, width = props.width, height = props.height, title = props.title, description = props.description, actions = props.actions, footerPosition = props.footerPosition, simple = props.simple, loader = props.loader, loaderClassName = props.loaderClassName, error = props.error, preview = props.preview, _c = props.previewProps, previewProps = _c === void 0 ? {} : _c, alt = props.alt, onClick = props.onClick, index = props.index, _index = props._index, restProps = __rest(props, ["style", "className", "src", "width", "height", "title", "description", "actions", "footerPosition", "simple", "loader", "loaderClassName", "error", "preview", "previewProps", "alt", "onClick", "index", "_index"]);
    var _d = useContext(PreviewGroupContext), previewGroup = _d.previewGroup, setGroupPreviewVisible = _d.setVisible, registerPreviewUrl = _d.registerPreviewUrl, setCurrentIndex = _d.setCurrentIndex;
    var previewSrc = previewProps.src || src;
    var id = useMemo(function () {
        if (isNumber(index) || isNumber(_index)) {
            uuid = isNumber(index) ? index : _index;
            return uuid;
        }
        return uuid++;
    }, []);
    var _e = __read(useShowFooter({ title: title, description: description, actions: actions }), 1), showFooter = _e[0];
    var _f = useImageStatus('beforeLoad'), isLoading = _f.isLoading, isError = _f.isError, isLoaded = _f.isLoaded, setStatus = _f.setStatus;
    var _g = __read(useMergeValue(false, {
        defaultValue: previewProps.defaultVisible,
        value: previewProps.visible,
    }), 2), previewVisible = _g[0], setPreviewVisible = _g[1];
    // Props passed directly into Preivew component
    var availablePreviewProps = omit(previewProps, [
        'visible',
        'defaultVisible',
        'src',
        'onVisibleChange',
    ]);
    var prefixCls = getPrefixCls('image');
    var classNames = cs(prefixCls, (_a = {},
        _a[prefixCls + "-simple"] = simple,
        _a[prefixCls + "-loading"] = isLoading,
        _a[prefixCls + "-loading-error"] = isError,
        _a[prefixCls + "-with-footer-inner"] = isLoaded && showFooter && footerPosition === 'inner',
        _a[prefixCls + "-with-footer-outer"] = isLoaded && showFooter && footerPosition === 'outer',
        _a), className);
    var refImg = useRef();
    function onImgLoaded() {
        setStatus('loaded');
    }
    function onImgLoadError() {
        setStatus('error');
    }
    function onImgClick(e) {
        if (preview && previewGroup) {
            setCurrentIndex(id);
            setGroupPreviewVisible(true);
        }
        else if (preview) {
            togglePreviewVisible(true);
        }
        onClick && onClick(e);
    }
    function onPreviewVisibleChange(visible) {
        togglePreviewVisible(visible);
    }
    function togglePreviewVisible(newVisible) {
        previewProps.onVisibleChange && previewProps.onVisibleChange(newVisible, previewVisible);
        setPreviewVisible(newVisible);
    }
    useEffect(function () {
        if (isServerRendering || !refImg.current)
            return;
        refImg.current.src = src;
        setStatus('loading');
    }, [src]);
    useEffect(function () {
        if (!previewGroup)
            return;
        var unRegister = registerPreviewUrl(id, previewSrc, preview);
        return function () {
            unRegister(id);
        };
    }, [previewGroup]);
    useEffect(function () {
        if (!previewGroup)
            return;
        registerPreviewUrl(id, previewSrc, preview);
    }, [previewSrc, preview, previewGroup]);
    var defaultError = (React.createElement("div", { className: prefixCls + "-error" },
        React.createElement("div", { className: prefixCls + "-error-icon" },
            React.createElement(IconImageClose, null)),
        alt && React.createElement("div", { className: prefixCls + "-error-alt" }, alt)));
    var defaultLoader = (React.createElement("div", { className: prefixCls + "-loader" },
        React.createElement("div", { className: prefixCls + "-loader-spin" },
            React.createElement(IconLoading, null),
            React.createElement("div", { className: prefixCls + "-loader-spin-text" }, "Loading"))));
    var renderLoader = function () {
        if (loader === true)
            return defaultLoader;
        if (loaderClassName)
            return React.createElement("div", { className: cs(prefixCls + "-loader", loaderClassName) });
        return loader || null;
    };
    return (React.createElement("div", { className: classNames, style: Object.assign({ width: width, height: height }, style), ref: ref },
        React.createElement("img", __assign({ ref: refImg, className: prefixCls + "-img" }, restProps, { title: title, width: width, height: height, onLoad: onImgLoaded, onError: onImgLoadError, onClick: onImgClick, alt: alt })),
        !isLoaded && (React.createElement("div", { className: prefixCls + "-overlay" },
            isError && (error || defaultError),
            isLoading && renderLoader())),
        isLoaded && showFooter && (React.createElement(ImageFooter, { title: title, description: description, actions: actions, prefixCls: prefixCls, simple: simple })),
        isLoaded && preview && (React.createElement(ImagePreview, __assign({ visible: previewVisible, src: previewSrc }, availablePreviewProps, { onVisibleChange: onPreviewVisibleChange })))));
}
var RefImageComponent = React.forwardRef(Image);
var ImageComponent = RefImageComponent;
ImageComponent.Preview = ImagePreview;
ImageComponent.PreviewGroup = ImagePreviewGroup;
ImageComponent.displayName = 'Image';
export default ImageComponent;
