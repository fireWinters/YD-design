var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import { on, off, contains, getScrollElements } from '../_util/dom';
import { isFunction } from '../_util/is';
import { Esc } from '../_util/keycode';
import Portal from './portal';
import ResizeObserver from '../_util/resizeObserver';
import cs from '../_util/classNames';
import { ConfigContext } from '../ConfigProvider';
import getStyle from './getPopupStyle';
import throttleByRaf from '../_util/throttleByRaf';
import { raf, caf } from '../_util/raf';
import mergeProps from '../_util/mergeProps';
function getDOMPos(dom) {
    if (!dom) {
        return {};
    }
    var _a = dom.getBoundingClientRect(), width = _a.width, height = _a.height, left = _a.left, right = _a.right;
    return {
        width: width,
        height: height,
        left: left,
        right: right,
    };
}
export var EventsByTriggerNeed = [
    'onClick',
    'onMouseEnter',
    'onMouseLeave',
    'onMouseMove',
    'onFocus',
    'onBlur',
    'onContextMenu',
    'onKeyDown',
];
function splitChildrenStyle(obj, keys) {
    var picked = {};
    var omitted = __assign({}, obj);
    keys.forEach(function (key) {
        if (obj && key in obj) {
            picked[key] = obj[key];
            delete omitted[key];
        }
    });
    return { picked: picked, omitted: omitted };
}
var defaultProps = {
    blurToHide: true,
    clickToClose: true,
    classNames: 'fadeIn',
    trigger: 'hover',
    position: 'bottom',
    duration: 200,
    unmountOnExit: true,
    popupAlign: {},
    popupHoverStay: true,
    clickOutsideToClose: true,
    escToClose: false,
    mouseLeaveToClose: true,
    containerScrollToClose: false,
    getDocument: function () { return window.document; },
    autoFixPosition: true,
    mouseEnterDelay: 100,
    mouseLeaveDelay: 100,
    autoFitPosition: true,
};
var Trigger = /** @class */ (function (_super) {
    __extends(Trigger, _super);
    function Trigger(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.delayTimer = null;
        _this.updatePositionTimer = null;
        // is popup open?
        _this.popupOpen = false;
        // if mousedown to hide popup, ignore onFocus
        _this.mousedownToHide = false;
        _this.hasPopupMouseDown = false;
        _this.unmount = false;
        // ?????????????????????
        _this.mouseLocation = {
            clientX: 0,
            clientY: 0,
        };
        // ???????????????mount container dom??????
        _this.observerContainer = null;
        // ????????????????????? popupContainer ????????????????????????
        _this.scrollElements = null;
        // container ?????? resize?????????
        _this.resizeObserver = new ResizeObserverPolyfill(function () {
            _this.handleUpdatePosition();
        });
        _this.childrenDom = null;
        // ??????children?????????????????? ?????????????????????????????????????????????????????????????????????????????????
        _this.childrenDomSize = {};
        _this.getMergedProps = function (baseProps) {
            var componentConfig = _this.context.componentConfig;
            var props = mergeProps(baseProps || _this.props, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Trigger);
            return props;
        };
        _this.getRootElement = function () {
            return findDOMNode(_this);
        };
        _this.isDidMount = false;
        _this.offScrollListeners = function () {
            (_this.scrollElements || []).forEach(function (item) {
                off(item, 'scroll', _this.handleScroll);
            });
            _this.scrollElements = null;
        };
        _this.offWindowResize = function () {
            _this.handleWindowResize = false;
            off(window, 'resize', _this.handleUpdatePosition);
        };
        _this.offContainerResize = function () {
            if (_this.resizeObserver && _this.observerContainer) {
                _this.resizeObserver.unobserve(_this.observerContainer);
                _this.observerContainer = null;
            }
        };
        _this.handleScroll = function () {
            var currentProps = _this.getMergedProps();
            if (currentProps.containerScrollToClose) {
                _this.setPopupVisible(false);
            }
            else if (currentProps.updateOnScroll) {
                _this.handleUpdatePosition();
            }
        };
        _this.onContainersScroll = function () {
            var _a;
            if (_this.scrollElements) {
                return;
            }
            _this.scrollElements = getScrollElements(_this.childrenDom, (_a = _this.popupContainer) === null || _a === void 0 ? void 0 : _a.parentNode);
            _this.scrollElements.forEach(function (item) {
                on(item, 'scroll', _this.handleScroll);
            });
        };
        _this.onContainerResize = function () {
            var _a;
            // containerParent ??????????????????getPopupContainer???????????????
            // ?????? this.popupContainer ???????????????getPopupContainer??????????????????
            var containerParent = (_a = _this.popupContainer) === null || _a === void 0 ? void 0 : _a.parentNode;
            if (_this.resizeObserver && _this.observerContainer !== containerParent) {
                // ??????containerParent?????????????????????????????????????????????container
                _this.offContainerResize();
                containerParent && _this.resizeObserver.observe(containerParent);
                _this.observerContainer = containerParent;
            }
        };
        // getPopupContainer ??????????????????
        _this.handleUpdatePosition = throttleByRaf(function () {
            _this.updatePopupPosition();
        });
        _this.isClickTrigger = function () {
            var trigger = _this.getMergedProps().trigger;
            return [].concat(trigger).indexOf('click') > -1;
        };
        _this.isFocusTrigger = function () {
            var trigger = _this.getMergedProps().trigger;
            return [].concat(trigger).indexOf('focus') > -1;
        };
        _this.isHoverTrigger = function () {
            var trigger = _this.getMergedProps().trigger;
            return [].concat(trigger).indexOf('hover') > -1;
        };
        _this.isContextMenuTrigger = function () {
            var trigger = _this.getMergedProps().trigger;
            return [].concat(trigger).indexOf('contextMenu') > -1;
        };
        // ????????????????????????????????????popup????????????????????????
        _this.isMouseLeaveToClose = function () {
            return _this.isHoverTrigger() && _this.getMergedProps().mouseLeaveToClose;
        };
        // ??????????????????popup????????????????????????
        _this.isPopupHoverHide = function () {
            return _this.isHoverTrigger() && !_this.getMergedProps().popupHoverStay;
        };
        _this.isClickToHide = function () {
            return ((_this.isClickTrigger() || _this.isContextMenuTrigger()) && _this.getMergedProps().clickToClose);
        };
        _this.isBlurToHide = function () {
            return _this.isFocusTrigger() && _this.getMergedProps().blurToHide;
        };
        _this.clearTimer = function () {
            if (_this.updatePositionTimer) {
                if (_this.updatePositionTimer.cancel) {
                    _this.updatePositionTimer.cancel();
                }
                else {
                    clearTimeout(_this.updatePositionTimer);
                    _this.updatePositionTimer = null;
                }
            }
            if (_this.delayTimer) {
                clearTimeout(_this.delayTimer);
                _this.delayTimer = null;
            }
            if (_this.mouseDownTimeout) {
                clearTimeout(_this.mouseDownTimeout);
                _this.mouseDownTimeout = null;
            }
        };
        _this.offClickOutside = function () {
            if (_this.handleClickOutside) {
                var getDocument = _this.getMergedProps().getDocument;
                var root = isFunction(getDocument) && getDocument();
                off(root, 'mousedown', _this.onClickOutside);
                _this.handleClickOutside = false;
            }
        };
        _this.getTransformOrigin = function (position) {
            var _a, _b;
            var content = findDOMNode(_this.triggerRef);
            if (!content)
                return {};
            var _c = _this.getMergedProps(), showArrow = _c.showArrow, classNames = _c.classNames;
            var top = (showArrow && ((_a = _this.arrowStyle) === null || _a === void 0 ? void 0 : _a.top)) || 0;
            var left = (showArrow && ((_b = _this.arrowStyle) === null || _b === void 0 ? void 0 : _b.left)) || 0;
            top = top ? top + "px" : '';
            left = left ? left + "px" : '';
            var transformOrigin = {
                top: (left || '50%') + " 100% 0",
                tl: (left || '15px') + " 100% 0",
                tr: (left || content.clientWidth - 15 + "px") + " 100% 0",
                bottom: (left || '50%') + " 0 0",
                bl: (left || '15px') + " 0 0",
                br: (left || content.clientWidth - 15 + "px") + " 0 0",
                left: "100% " + (top || '50%') + " 0",
                lt: "100% " + (top || '15px') + " 0",
                lb: "100% " + (top || content.clientHeight - 15 + "px") + " 0",
                right: "0 " + (top || '50%') + " 0",
                rt: "0 " + (top || '15px') + " 0",
                rb: "0 " + (top || content.clientHeight - 15 + "px") + " 0",
            };
            // tooltip popover popconfirm
            if (classNames && classNames.indexOf('zoom') > -1) {
                return {
                    transformOrigin: transformOrigin[position],
                };
            }
            if (classNames === 'slideDynamicOrigin') {
                var origin_1 = '0% 0%';
                if (['top', 'tl', 'tr'].indexOf(position) > -1) {
                    origin_1 = '100% 100%';
                }
                return {
                    transformOrigin: origin_1,
                };
            }
            return {};
        };
        // ?????????????????????translateY/translateX??????????????????????????????????????????
        _this.getTransformTranslate = function () {
            if (_this.getMergedProps().classNames !== 'slideDynamicOrigin') {
                return '';
            }
            switch (_this.realPosition) {
                case 'bottom':
                case 'bl':
                case 'br':
                    return 'scaleY(0.9) translateY(-4px)';
                case 'top':
                case 'tl':
                case 'tr':
                    return 'scaleY(0.9) translateY(4px)';
                default:
                    return '';
            }
        };
        _this.getPopupStyle = function () {
            if (_this.unmount || !_this.popupContainer) {
                return;
            }
            var mountContainer = _this.popupContainer;
            var content = findDOMNode(_this.triggerRef);
            var child = findDOMNode(_this);
            var _a = getStyle(_this.getMergedProps(), content, child, mountContainer, _this.mouseLocation), style = _a.style, arrowStyle = _a.arrowStyle, realPosition = _a.realPosition;
            _this.realPosition = realPosition || _this.getMergedProps().position;
            _this.arrowStyle = arrowStyle || {};
            return __assign(__assign({}, style), _this.getTransformOrigin(_this.realPosition));
        };
        _this.showPopup = function (callback) {
            if (callback === void 0) { callback = function () { }; }
            var popupStyle = _this.getPopupStyle();
            _this.setState({
                popupStyle: popupStyle,
            }, callback);
        };
        _this.update = throttleByRaf(function (callback) {
            if (_this.unmount || !_this.state.popupVisible) {
                return;
            }
            var popupStyle = _this.getPopupStyle();
            _this.setState({
                popupStyle: popupStyle,
            }, function () {
                callback && callback();
            });
        });
        _this.updatePopupPosition = function (delay, callback) {
            if (delay === void 0) { delay = 0; }
            var currentVisible = _this.state.popupVisible;
            if (!currentVisible) {
                return;
            }
            if (delay < 4) {
                _this.updatePositionTimer = _this.update(callback);
                return;
            }
            _this.updatePositionTimer = setTimeout(function () {
                var popupStyle = _this.getPopupStyle();
                _this.setState({
                    popupStyle: popupStyle,
                }, function () {
                    callback && callback();
                });
            }, delay);
        };
        _this.setPopupVisible = function (visible, delay, callback) {
            if (delay === void 0) { delay = 0; }
            var mergedProps = _this.getMergedProps();
            var onVisibleChange = mergedProps.onVisibleChange;
            var currentVisible = _this.state.popupVisible;
            if (visible !== currentVisible) {
                _this.delayToDo(delay, function () {
                    onVisibleChange && onVisibleChange(visible);
                    if (!('popupVisible' in mergedProps)) {
                        if (visible) {
                            _this.setState({
                                popupVisible: true,
                            }, function () {
                                _this.showPopup(callback);
                            });
                        }
                        else {
                            _this.setState({
                                popupVisible: false,
                            }, function () {
                                callback && callback();
                            });
                        }
                    }
                    else {
                        callback && callback();
                    }
                });
            }
            else {
                callback && callback();
            }
        };
        _this.delayToDo = function (delay, callback) {
            if (delay) {
                _this.clearDelayTimer();
                _this.delayTimer = setTimeout(function () {
                    callback();
                    _this.clearDelayTimer();
                }, delay);
            }
            else {
                callback();
            }
        };
        // ?????????popup????????????children????????????????????????clickoutside ??????
        _this.onClickOutside = function (e) {
            var _a = _this.getMergedProps(), onClickOutside = _a.onClickOutside, clickOutsideToClose = _a.clickOutsideToClose;
            var triggerNode = findDOMNode(_this.triggerRef);
            var childrenDom = findDOMNode(_this);
            if (!contains(triggerNode, e.target) &&
                !contains(childrenDom, e.target) &&
                !_this.hasPopupMouseDown) {
                onClickOutside && onClickOutside();
                if (clickOutsideToClose) {
                    // ????????????????????????onVisibleChange????????????
                    // blurToHide ???true???????????????????????????onBlur????????????setPopupVisible
                    // hover ?????????????????????????????????????????????mouseLeave????????????setPopupVisible
                    if (!_this.isBlurToHide() && !_this.isHoverTrigger()) {
                        _this.setPopupVisible(false);
                    }
                }
            }
        };
        _this.onKeyDown = function (e) {
            var keyCode = e.keyCode || e.which;
            _this.triggerPropsEvent('onKeyDown', e);
            if (keyCode === Esc.code) {
                _this.onPressEsc(e);
            }
        };
        _this.onPressEsc = function (e) {
            var escToClose = _this.getMergedProps().escToClose;
            if (escToClose && e && e.key === Esc.key && _this.state.popupVisible) {
                _this.setPopupVisible(false);
            }
        };
        _this.onMouseEnter = function (e) {
            var mouseEnterDelay = _this.getMergedProps().mouseEnterDelay;
            _this.triggerPropsEvent('onMouseEnter', e);
            _this.clearDelayTimer();
            _this.setPopupVisible(true, mouseEnterDelay || 0);
        };
        _this.onMouseMove = function (e) {
            _this.triggerPropsEvent('onMouseMove', e);
            _this.setMouseLocation(e);
            if (_this.state.popupVisible) {
                _this.update();
            }
        };
        _this.onMouseLeave = function (e) {
            var mouseLeaveDelay = _this.getMergedProps().mouseLeaveDelay;
            _this.clearDelayTimer();
            _this.triggerPropsEvent('onMouseLeave', e);
            if (_this.isMouseLeaveToClose()) {
                if (_this.state.popupVisible) {
                    _this.setPopupVisible(false, mouseLeaveDelay || 0);
                }
            }
        };
        _this.onPopupMouseEnter = function () {
            _this.clearDelayTimer();
        };
        _this.onPopupMouseLeave = function (e) {
            _this.onMouseLeave(e);
        };
        _this.setMouseLocation = function (e) {
            if (_this.getMergedProps().alignPoint) {
                _this.mouseLocation = {
                    clientX: e.clientX,
                    clientY: e.clientY,
                };
            }
        };
        _this.onContextMenu = function (e) {
            e.preventDefault();
            _this.triggerPropsEvent('onContextMenu', e);
            _this.setMouseLocation(e);
            if (!_this.state.popupVisible) {
                _this.setPopupVisible(true, 0);
            }
            else {
                // ????????????
                _this.getMergedProps().alignPoint && _this.update();
            }
        };
        _this.hideContextMenu = function (e) {
            var popupVisible = _this.state.popupVisible;
            if (popupVisible) {
                _this.mousedownToHide = true;
            }
            _this.triggerPropsEvent('onClick', e);
            if (_this.isClickToHide() && popupVisible) {
                _this.setPopupVisible(!popupVisible, 0);
            }
        };
        _this.onClick = function (e) {
            var popupVisible = _this.state.popupVisible;
            if (popupVisible) {
                _this.mousedownToHide = true;
            }
            _this.triggerPropsEvent('onClick', e);
            _this.setMouseLocation(e);
            if (!_this.isClickToHide() && popupVisible) {
                return;
            }
            _this.setPopupVisible(!popupVisible, 0);
        };
        _this.onFocus = function (e) {
            var focusDelay = _this.getMergedProps().focusDelay;
            var onFocus = function () {
                _this.triggerPropsEvent('onFocus', e);
            };
            _this.clearDelayTimer();
            if (!_this.mousedownToHide) {
                if (_this.state.popupVisible) {
                    onFocus && onFocus();
                }
                else {
                    _this.setPopupVisible(true, focusDelay || 0, onFocus);
                }
            }
            _this.mousedownToHide = false;
        };
        _this.onBlur = function (e) {
            _this.setPopupVisible(false, 200, function () { return _this.triggerPropsEvent('onBlur', e); });
        };
        _this.onResize = function () {
            if (_this.getMergedProps().autoFixPosition && _this.state.popupVisible) {
                _this.updatePopupPosition();
            }
        };
        _this.onPopupMouseDown = function () {
            _this.hasPopupMouseDown = true;
            clearTimeout(_this.mouseDownTimeout);
            _this.mouseDownTimeout = setTimeout(function () {
                _this.hasPopupMouseDown = false;
            }, 0);
        };
        // ??? children ???????????? disabled ???????????????????????? hover ????????????????????????????????????
        // ????????? disabled ???????????????????????? span??????????????????????????????
        _this.getChild = function () {
            var children = _this.props.children;
            var element = children;
            var elementType = (element && typeof element !== 'string' && element.type);
            var child = children;
            if (['string', 'number'].indexOf(typeof children) > -1 || React.Children.count(children) > 1) {
                child = React.createElement("span", null, children);
            }
            else if (element &&
                elementType &&
                (elementType.__BYTE_BUTTON === true ||
                    elementType.__BYTE_CHECKBOX === true ||
                    elementType.__BYTE_SWITCH === true ||
                    elementType.__BYTE_RADIO === true ||
                    elementType === 'button') &&
                element.props.disabled) {
                // ???????????????????????????????????????????????? span ????????????
                var _a = splitChildrenStyle(element.props.style, [
                    'position',
                    'left',
                    'right',
                    'top',
                    'bottom',
                    'float',
                    'display',
                    'zIndex',
                ]), picked = _a.picked, omitted = _a.omitted;
                child = (React.createElement("span", { className: element.props.className, style: __assign(__assign({ display: 'inline-block' }, picked), { cursor: 'not-allowed' }) }, React.cloneElement(element, {
                    style: __assign(__assign({}, omitted), { pointerEvents: 'none' }),
                    className: undefined,
                })));
            }
            // ??????????????????
            return child || React.createElement("span", null);
        };
        // ?????????dom????????????getPopupContainer???
        _this.appendToContainer = function (node) {
            caf(_this.rafId);
            if (_this.isDidMount) {
                var getGlobalPopupContainer = _this.context.getPopupContainer;
                var getPopupContainer = _this.getMergedProps().getPopupContainer;
                var gpc = getPopupContainer || getGlobalPopupContainer;
                var rootElement = _this.getRootElement();
                var parent_1 = gpc(rootElement);
                if (parent_1) {
                    parent_1.appendChild(node);
                    return;
                }
            }
            _this.rafId = raf(function () {
                _this.appendToContainer(node);
            });
        };
        _this.getContainer = function () {
            var popupContainer = document.createElement('div');
            popupContainer.style.width = '100%';
            popupContainer.style.position = 'absolute';
            popupContainer.style.top = '0';
            popupContainer.style.left = '0';
            _this.popupContainer = popupContainer;
            _this.appendToContainer(popupContainer);
            return popupContainer;
        };
        // 1. ????????????????????? Trigger ????????????????????????Trigger????????????Trigger?????????
        // 2. ??????children???????????????????????????
        _this.triggerPropsEvent = function (eventName, e) {
            var child = _this.getChild();
            var childHandler = child && child.props && child.props[eventName];
            var props = _this.getMergedProps();
            if (isFunction(childHandler)) {
                childHandler(e);
            }
            if (isFunction(props[eventName])) {
                props[eventName](e);
            }
        };
        // ?????? children/ trigger ???????????????????????????
        _this.triggerOriginEvent = function (eventName) {
            var child = _this.getChild();
            var childHandler = child && child.props && child.props[eventName];
            var propsHandler = _this.getMergedProps()[eventName];
            if (isFunction(propsHandler) && isFunction(childHandler)) {
                return function (e) {
                    childHandler(e);
                    propsHandler(e);
                };
            }
            return childHandler || propsHandler;
        };
        var mergedProps = _this.getMergedProps(props);
        var popupVisible = 'popupVisible' in mergedProps ? mergedProps.popupVisible : mergedProps.defaultPopupVisible;
        _this.popupOpen = !!popupVisible;
        _this.state = {
            popupVisible: !!popupVisible,
            popupStyle: {},
        };
        return _this;
    }
    Trigger.getDerivedStateFromProps = function (nextProps, state) {
        if ('popupVisible' in nextProps && nextProps.popupVisible !== state.popupVisible) {
            return {
                popupVisible: nextProps.popupVisible,
            };
        }
        return null;
    };
    Trigger.prototype.componentDidMount = function () {
        this.componentDidUpdate(this.getMergedProps());
        this.isDidMount = true;
        this.childrenDom = findDOMNode(this);
        if (this.state.popupVisible) {
            this.childrenDomSize = getDOMPos(this.childrenDom);
        }
    };
    Trigger.prototype.componentDidUpdate = function (_prevProps) {
        var prevProps = this.getMergedProps(_prevProps);
        var currentProps = this.getMergedProps();
        if (!prevProps.popupVisible && currentProps.popupVisible) {
            this.update();
        }
        var popupVisible = this.state.popupVisible;
        this.popupOpen = popupVisible;
        var getDocument = currentProps.getDocument;
        if (!popupVisible) {
            this.offClickOutside();
            this.offContainerResize();
            this.offWindowResize();
            this.offScrollListeners();
            return;
        }
        var rect = getDOMPos(this.childrenDom);
        // children???????????????????????????????????????children ??????scale????????????????????????????????????????????????popup ??????????????????
        if (JSON.stringify(rect) !== JSON.stringify(this.childrenDomSize)) {
            this.updatePopupPosition();
            this.childrenDomSize = rect;
        }
        // popupVisible???true
        this.onContainerResize();
        if (currentProps.updateOnScroll || currentProps.containerScrollToClose) {
            this.onContainersScroll();
        }
        if (!this.handleWindowResize) {
            on(window, 'resize', this.handleUpdatePosition);
            this.handleWindowResize = true;
        }
        if (!this.handleClickOutside) {
            var root = isFunction(getDocument) && getDocument();
            if (root) {
                // clickOutside ????????????mousedown???
                // 1. ???????????????????????????click???????????????document.onclick???????????????????????????????????????????????????clickOutside???????????????popup???
                // 2. ??????label????????????????????????input????????????????????????????????????clickOutside?????????popup???
                on(root, 'mousedown', this.onClickOutside);
                this.handleClickOutside = true;
            }
        }
    };
    Trigger.prototype.componentWillUnmount = function () {
        this.unmount = true;
        this.offClickOutside();
        this.clearTimer();
        this.offWindowResize();
        this.offScrollListeners();
        this.offContainerResize();
        caf(this.rafId);
    };
    Trigger.prototype.clearDelayTimer = function () {
        if (this.delayTimer) {
            clearTimeout(this.delayTimer);
            this.delayTimer = null;
        }
    };
    Trigger.prototype.render = function () {
        var _a, _b;
        var _this = this;
        var _c;
        var _d = this.getMergedProps(), children = _d.children, style = _d.style, className = _d.className, arrowProps = _d.arrowProps, disabled = _d.disabled, popup = _d.popup, classNames = _d.classNames, duration = _d.duration, unmountOnExit = _d.unmountOnExit, alignPoint = _d.alignPoint, autoAlignPopupWidth = _d.autoAlignPopupWidth, position = _d.position, childrenPrefix = _d.childrenPrefix, showArrow = _d.showArrow, dropdownPopupStyle = _d.popupStyle;
        var isExistChildren = children || children === 0;
        var _e = this.context, getPrefixCls = _e.getPrefixCls, zIndex = _e.zIndex;
        var _f = this.state, popupVisible = _f.popupVisible, popupStyle = _f.popupStyle;
        if (!popup) {
            return null;
        }
        var mergeProps = {};
        var popupEventProps = {
            onMouseDown: this.onPopupMouseDown,
        };
        if (this.isHoverTrigger() && !disabled) {
            mergeProps.onMouseEnter = this.onMouseEnter;
            mergeProps.onMouseLeave = this.onMouseLeave;
            if (alignPoint) {
                mergeProps.onMouseMove = this.onMouseMove;
            }
            if (!this.isPopupHoverHide()) {
                popupEventProps.onMouseEnter = this.onPopupMouseEnter;
                popupEventProps.onMouseLeave = this.onPopupMouseLeave;
            }
        }
        else {
            mergeProps.onMouseEnter = this.triggerOriginEvent('onMouseEnter');
            mergeProps.onMouseLeave = this.triggerOriginEvent('onMouseLeave');
        }
        if (this.isContextMenuTrigger() && !disabled) {
            mergeProps.onContextMenu = this.onContextMenu;
            mergeProps.onClick = this.hideContextMenu;
        }
        else {
            mergeProps.onContextMenu = this.triggerOriginEvent('onContextMenu');
        }
        if (this.isClickTrigger() && !disabled) {
            mergeProps.onClick = this.onClick;
        }
        else {
            mergeProps.onClick = mergeProps.onClick || this.triggerOriginEvent('onClick');
        }
        if (this.isFocusTrigger() && !disabled) {
            mergeProps.onFocus = this.onFocus;
            if (this.isBlurToHide()) {
                mergeProps.onBlur = this.onBlur;
            }
        }
        else {
            mergeProps.onFocus = this.triggerOriginEvent('onFocus');
            mergeProps.onBlur = this.triggerOriginEvent('onBlur');
        }
        if (!disabled) {
            mergeProps.onKeyDown = this.onKeyDown;
        }
        else {
            mergeProps.onKeyDown = this.triggerOriginEvent('onKeyDown');
        }
        var child = this.getChild();
        var popupChildren = React.Children.only(popup());
        if (child.props.className) {
            mergeProps.className = child.props.className;
        }
        if (childrenPrefix && popupVisible) {
            mergeProps.className = mergeProps.className
                ? mergeProps.className + " " + childrenPrefix + "-open"
                : childrenPrefix + "-open";
        }
        // ?????????focus??????????????????tabIndex?????????tab???????????????focus????????????????????????
        if (this.isFocusTrigger()) {
            mergeProps.tabIndex = disabled ? -1 : 0;
        }
        var prefixCls = getPrefixCls('trigger');
        var popupClassName = cs(prefixCls, childrenPrefix, prefixCls + "-position-" + position, className);
        var childrenComponent = isExistChildren && (React.createElement(ResizeObserver, { onResize: this.onResize }, React.cloneElement(child, __assign({}, mergeProps))));
        var portalContent = (React.createElement(CSSTransition, { in: !!popupVisible, timeout: duration, classNames: classNames, unmountOnExit: unmountOnExit, appear: true, mountOnEnter: true, onEnter: function (e) {
                e.style.display = 'initial';
                e.style.pointerEvents = 'none';
                if (classNames === 'slideDynamicOrigin') {
                    // ????????????
                    e.style.transform = _this.getTransformTranslate();
                }
            }, onEntering: function (e) {
                if (classNames === 'slideDynamicOrigin') {
                    // ????????????
                    e.style.transform = '';
                }
            }, onEntered: function (e) {
                e.style.pointerEvents = 'auto';
                _this.forceUpdate();
            }, onExit: function (e) {
                // ??????????????????????????????????????????????????????????????????
                e.style.pointerEvents = 'none';
            }, onExited: function (e) {
                e.style.display = 'none';
                // ?????????????????????null????????????setState popupStyle????????????????????????????????? Portal????????????????????????????????????
                // ?????????????????????????????? triggerRef ????????????null???????????????forceUpdate???????????????Portal???unmount???
                if (unmountOnExit) {
                    _this.triggerRef = null;
                }
                _this.setState({ popupStyle: {} });
            } },
            React.createElement(ResizeObserver, { onResize: this.onResize },
                React.createElement("span", __assign({ ref: function (node) { return (_this.triggerRef = node); }, "trigger-placement": this.realPosition, style: __assign(__assign(__assign({ width: autoAlignPopupWidth && (style === null || style === void 0 ? void 0 : style.width) === undefined
                            ? (_c = this.childrenDomSize) === null || _c === void 0 ? void 0 : _c.width
                            : '' }, popupStyle), { position: 'absolute', zIndex: zIndex || '' }), style) }, popupEventProps, { className: popupClassName }),
                    React.createElement(popupChildren.type, __assign({ ref: popupChildren.ref }, popupChildren.props, { style: __assign(__assign({}, popupChildren.props.style), dropdownPopupStyle) })),
                    (showArrow || arrowProps) && (React.createElement("div", { className: cs(prefixCls + "-arrow-container", (_a = {},
                            _a[childrenPrefix + "-arrow-container"] = childrenPrefix,
                            _a)) },
                        React.createElement("div", __assign({}, arrowProps, { className: cs(prefixCls + "-arrow", (_b = {},
                                _b[childrenPrefix + "-arrow"] = childrenPrefix,
                                _b), arrowProps === null || arrowProps === void 0 ? void 0 : arrowProps.className), style: __assign(__assign({}, this.arrowStyle), arrowProps === null || arrowProps === void 0 ? void 0 : arrowProps.style) }))))))));
        // ?????? triggerRef ?????????????????????????????????????????????????????????portal???
        var portal = popupVisible || this.triggerRef ? (React.createElement(Portal, { getContainer: this.getContainer }, portalContent)) : null;
        return isExistChildren ? (React.createElement(React.Fragment, null,
            childrenComponent,
            portal)) : (portal);
    };
    Trigger.displayName = 'Trigger';
    Trigger.contextType = ConfigContext;
    return Trigger;
}(PureComponent));
export default Trigger;
