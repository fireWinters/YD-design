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
import React, { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useRef, } from 'react';
import throttle from 'lodash/throttle';
import compute from 'compute-scroll-into-view';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import { isFunction, isNumber, isWindow } from '../_util/is';
import { on, off } from '../_util/dom';
import cs from '../_util/classNames';
import useIsFirstRender from '../_util/hooks/useIsFirstRender';
import Affix from '../Affix';
import { ConfigContext } from '../ConfigProvider';
import AnchorContext from './context';
import { findNode, slide, getContainer, getContainerElement } from './utils';
import useStateWithPromise from '../_util/hooks/useStateWithPromise';
import Link from './link';
import useMergeProps from '../_util/hooks/useMergeProps';
var defaultProps = {
    animation: true,
    affix: true,
    hash: true,
    boundary: 'start',
};
function Anchor(baseProps, ref) {
    var _a;
    var _b = useContext(ConfigContext), getPrefixCls = _b.getPrefixCls, componentConfig = _b.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Anchor);
    var className = props.className, style = props.style, propScrollContainer = props.scrollContainer, _c = props.animation, animation = _c === void 0 ? true : _c, lineless = props.lineless, _d = props.affix, affix = _d === void 0 ? true : _d, affixStyle = props.affixStyle, offsetBottom = props.offsetBottom, offsetTop = props.offsetTop, _e = props.hash, willChangeHash = _e === void 0 ? true : _e, _f = props.boundary, boundary = _f === void 0 ? 'start' : _f, targetOffset = props.targetOffset, children = props.children, onSelect = props.onSelect, onChange = props.onChange;
    var prefixCls = getPrefixCls('anchor');
    var classNames = cs(prefixCls, className, (_a = {},
        _a[prefixCls + "-lineless"] = lineless,
        _a));
    var wrapperRef = useRef(null);
    var sliderLineRef = useRef(null);
    var linkMap = useRef(new Map());
    var isScrolling = useRef(false);
    var _g = __read(useStateWithPromise(''), 2), currentLink = _g[0], setCurrentLink = _g[1];
    var isFirstRender = useIsFirstRender();
    var scrollContainer = useRef(null);
    useEffect(function () {
        var container = getContainer(propScrollContainer);
        scrollContainer.current = container;
    }, [propScrollContainer]);
    var getAffixTarget = useCallback(function () {
        return getContainer(propScrollContainer);
    }, [propScrollContainer]);
    useImperativeHandle(ref, function () { return ({
        dom: wrapperRef.current,
    }); }, []);
    function addLink(hash, element) {
        if (hash) {
            linkMap.current.set(hash, element);
        }
    }
    function removeLink(hash) {
        linkMap.current.delete(hash);
    }
    var setActiveLink = useCallback(function (hash) {
        if (!hash || !wrapperRef.current)
            return;
        // Try to add when there is no corresponding link
        if (!linkMap.current.has(hash)) {
            var node_1 = findNode(wrapperRef.current, "a[data-href='" + hash + "']");
            node_1 && addLink(hash, node_1);
        }
        var node = linkMap.current.get(hash);
        if (node && hash !== currentLink) {
            scrollIntoViewIfNeeded(node, {
                behavior: 'instant',
                block: 'nearest',
                scrollMode: 'if-needed',
                boundary: wrapperRef.current,
            });
            setCurrentLink(hash).then(function () {
                isFunction(onChange) && onChange(hash, currentLink);
            });
        }
    }, [currentLink, onChange]);
    var getEleInViewport = useCallback(function () {
        var result;
        var startTop = isNumber(boundary) ? boundary : 0;
        var container = scrollContainer.current;
        var containerElement = getContainerElement(container);
        var containerRect = containerElement.getBoundingClientRect();
        var documentHeight = document.documentElement.clientHeight;
        __spreadArray([], __read(linkMap.current.keys()), false).some(function (hash) {
            var element = findNode(document, hash);
            var inView = false;
            if (element) {
                var top_1 = element.getBoundingClientRect().top;
                if (isWindow(container)) {
                    inView = top_1 >= startTop && top_1 <= (targetOffset !== null && targetOffset !== void 0 ? targetOffset : documentHeight / 2);
                }
                else {
                    var offsetTop_1 = top_1 - containerRect.top - startTop;
                    inView = offsetTop_1 >= 0 && offsetTop_1 <= (targetOffset !== null && targetOffset !== void 0 ? targetOffset : containerRect.height / 2);
                }
                if (inView) {
                    result = element;
                }
            }
            return inView;
        });
        return result;
    }, [boundary, targetOffset]);
    var onScroll = useCallback(throttle(function () {
        if (isScrolling.current)
            return;
        var element = getEleInViewport();
        if (element && element.id) {
            var hash = "#" + element.id;
            setActiveLink(hash);
        }
    }, 30, { trailing: true }), [getEleInViewport, setActiveLink]);
    function scrollIntoView(hash) {
        if (!hash)
            return;
        try {
            var element = findNode(document, hash);
            if (!element)
                return;
            var block = isNumber(boundary) ? 'start' : boundary;
            var offset_1 = isNumber(boundary) ? boundary : 0;
            var actions = compute(element, { block: block });
            if (!actions.length)
                return;
            var stopScroll_1 = false;
            var promises = actions.map(function (_a) {
                var el = _a.el, top = _a.top;
                return new Promise(function (resolve) {
                    if (!stopScroll_1) {
                        if (el === scrollContainer.current) {
                            stopScroll_1 = true;
                        }
                        var targetTop = top - offset_1;
                        if (!animation) {
                            // Manually trigger scrolling as browser's default action is prevented when `props.hash` is false
                            if (!willChangeHash) {
                                el.scrollTop = targetTop;
                            }
                            return resolve(null);
                        }
                        return slide(el, targetTop, resolve);
                    }
                    resolve(null);
                });
            });
            isScrolling.current = true;
            Promise.all(promises).then(function () {
                isScrolling.current = false;
            });
        }
        catch (e) {
            console.error(e);
        }
    }
    function onLinkClick(e, hash) {
        if (!willChangeHash) {
            e.preventDefault();
        }
        setActiveLink(hash);
        scrollIntoView(hash);
        isFunction(onSelect) && onSelect(hash, currentLink);
    }
    useEffect(function () {
        var hash = decodeURIComponent(location.hash);
        if (hash) {
            setActiveLink(hash);
            scrollIntoView(hash);
        }
        else {
            // compute current active anchor
            onScroll();
        }
    }, []);
    useEffect(function () {
        if (!isFirstRender) {
            onScroll();
        }
        on(scrollContainer.current, 'scroll', onScroll);
        return function () {
            off(scrollContainer.current, 'scroll', onScroll);
        };
    }, [propScrollContainer, onScroll]);
    useEffect(function () {
        var link = linkMap.current.get(currentLink);
        if (link && !lineless && sliderLineRef.current) {
            sliderLineRef.current.style.top = link.offsetTop + "px";
        }
    }, [currentLink, lineless]);
    var content = (React.createElement("div", { className: classNames, style: style, ref: wrapperRef },
        !lineless && currentLink && (React.createElement("div", { className: prefixCls + "-line-slider", ref: sliderLineRef })),
        React.createElement(AnchorContext.Provider, { value: {
                currentLink: currentLink,
                addLink: addLink,
                removeLink: removeLink,
                onLinkClick: onLinkClick,
            } },
            React.createElement("div", { className: prefixCls + "-list" }, children))));
    return affix ? (React.createElement(Affix, { offsetTop: offsetTop, offsetBottom: offsetBottom, style: affixStyle, target: getAffixTarget }, content)) : (content);
}
var ForwardRefAnchor = forwardRef(Anchor);
var AnchorComponent = ForwardRefAnchor;
AnchorComponent.displayName = 'Anchor';
AnchorComponent.Link = Link;
export default AnchorComponent;
