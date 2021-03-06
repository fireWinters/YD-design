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
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, } from 'react';
import useIsFirstRender from '../_util/hooks/useIsFirstRender';
import useMergeValue from '../_util/hooks/useMergeValue';
import ImagePreview from './image-preview';
import { PreviewGroupContext } from './previewGroupContext';
function PreviewGroup(props, ref) {
    var children = props.children, srcList = props.srcList, infinite = props.infinite, propCurrentIndex = props.current, defaultCurrent = props.defaultCurrent, onChange = props.onChange, propVisible = props.visible, defaultVisible = props.defaultVisible, onVisibleChange = props.onVisibleChange, restProps = __rest(props, ["children", "srcList", "infinite", "current", "defaultCurrent", "onChange", "visible", "defaultVisible", "onVisibleChange"]);
    var _a = __read(useMergeValue(false, {
        value: propVisible,
        defaultValue: defaultVisible,
    }), 2), visible = _a[0], setVisible = _a[1];
    var propPreviewUrlMap = useMemo(function () { return (srcList ? new Map(srcList.map(function (url, index) { return [index, { url: url, preview: true }]; })) : null); }, [srcList]);
    var isFirstRender = useIsFirstRender();
    var getPreviewUrlMap = function () { return (propPreviewUrlMap ? new Map(propPreviewUrlMap) : new Map()); };
    var _b = __read(useState(getPreviewUrlMap()), 2), previewUrlMap = _b[0], setPreviewUrlMap = _b[1];
    useEffect(function () {
        if (isFirstRender)
            return;
        setPreviewUrlMap(getPreviewUrlMap());
    }, [propPreviewUrlMap]);
    var canPreviewUrlMap = new Map(Array.from(previewUrlMap)
        .filter(function (_a) {
        var _b = __read(_a, 2), preview = _b[1].preview;
        return preview;
    })
        .map(function (_a) {
        var _b = __read(_a, 2), id = _b[0], url = _b[1].url;
        return [id, url];
    }));
    var _c = __read(useMergeValue(0, {
        value: propCurrentIndex,
        defaultValue: defaultCurrent,
    }), 2), currentIndex = _c[0], setCurrentIndex = _c[1];
    function registerPreviewUrl(id, url, preview) {
        if (!propPreviewUrlMap) {
            setPreviewUrlMap(function (pre) {
                return new Map(pre).set(id, {
                    url: url,
                    preview: preview,
                });
            });
        }
        return function unRegisterPreviewUrl() {
            if (!propPreviewUrlMap) {
                setPreviewUrlMap(function (pre) {
                    var cloneMap = new Map(pre);
                    var hasDelete = cloneMap.delete(id);
                    return hasDelete ? cloneMap : pre;
                });
            }
        };
    }
    var refPreview = useRef();
    useImperativeHandle(ref, function () { return ({
        reset: function () {
            refPreview.current && refPreview.current.reset();
        },
    }); });
    var handleVisibleChange = function (visible, preVisible) {
        setVisible(visible);
        onVisibleChange && onVisibleChange(visible, preVisible);
    };
    var handleSwitch = function (index) {
        onChange && onChange(index);
        setCurrentIndex(index);
    };
    var loopImageIndex = function (children) {
        var index = 0;
        var loop = function (children) {
            return React.Children.map(children, function (child) {
                if (child && child.props && child.type) {
                    var displayName = child.type.displayName;
                    if (displayName === 'Image') {
                        return React.cloneElement(child, { _index: index++ });
                    }
                }
                if (child && child.props && child.props.children) {
                    return React.cloneElement(child, {
                        children: loop(child.props.children),
                    });
                }
                return child;
            });
        };
        return loop(children);
    };
    return (React.createElement(PreviewGroupContext.Provider, { value: {
            previewGroup: true,
            previewUrlMap: canPreviewUrlMap,
            infinite: infinite,
            currentIndex: currentIndex,
            setCurrentIndex: handleSwitch,
            setPreviewUrlMap: setPreviewUrlMap,
            registerPreviewUrl: registerPreviewUrl,
            visible: visible,
            setVisible: setVisible,
        } },
        loopImageIndex(children),
        React.createElement(ImagePreview, __assign({ ref: refPreview, src: "", visible: visible, onVisibleChange: handleVisibleChange }, restProps))));
}
var PreviewGroupComponent = forwardRef(PreviewGroup);
PreviewGroupComponent.displayName = 'ImagePreviewGroup';
export default PreviewGroupComponent;
