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
import { useContext, useEffect, useState } from 'react';
import MenuContext from './context';
import useIsFirstRender from '../_util/hooks/useIsFirstRender';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Enter, Esc } from '../_util/keycode';
var INITIAL_HOTKEY_INFO = {
    type: null,
    update: false,
    activeKeyPath: [],
};
export var useHotkeyListener = function (_a) {
    var menuInfoMap = _a.menuInfoMap, openKeys = _a.openKeys, selectedKeys = _a.selectedKeys, needPause = _a.needPause;
    var _b = __read(useState(INITIAL_HOTKEY_INFO), 2), hotkeyInfo = _b[0], setHokeyInfo = _b[1];
    return {
        reset: function (activeKey) {
            var _a;
            var keyPath = activeKey && ((_a = menuInfoMap[activeKey]) === null || _a === void 0 ? void 0 : _a.keyPath);
            setHokeyInfo(__assign(__assign({}, INITIAL_HOTKEY_INFO), { activeKeyPath: keyPath || [] }));
        },
        hotkeyInfo: hotkeyInfo,
        listener: function (event) {
            if (typeof needPause === 'function' && needPause()) {
                return;
            }
            var keyCode = event.keyCode || event.which;
            var activeKey = hotkeyInfo.activeKeyPath[0] || (selectedKeys && selectedKeys[0]);
            // ???????????????????????????????????????
            if (keyCode === ArrowUp.code || keyCode === ArrowDown.code) {
                event.preventDefault();
            }
            // ?????? active ???????????????????????????
            if (!menuInfoMap[activeKey]) {
                if ([ArrowUp.code, ArrowDown.code, ArrowLeft.code, ArrowRight.code].indexOf(keyCode) > -1) {
                    var activeKey_1 = Object.keys(menuInfoMap)[0];
                    setHokeyInfo(__assign(__assign({}, hotkeyInfo), { update: false, activeKeyPath: menuInfoMap[activeKey_1].keyPath }));
                }
                return;
            }
            var walkSiblings = function (reverse) {
                var getKeyNext = function (base) {
                    var _a = menuInfoMap[base], firstChild = _a.firstChild, next = _a.next, keyPath = _a.keyPath;
                    var getParentNext = function (keyPath) {
                        var parent = keyPath[1] && menuInfoMap[keyPath[1]];
                        if (parent) {
                            return parent.next || getParentNext(parent.keyPath);
                        }
                    };
                    return firstChild && openKeys.indexOf(base) > -1
                        ? firstChild
                        : next || getParentNext(keyPath);
                };
                var getKeyPrev = function (base) {
                    var result = null;
                    var _a = menuInfoMap[base], prev = _a.prev, keyPath = _a.keyPath;
                    if (prev) {
                        result = prev;
                        var info = menuInfoMap[prev];
                        while (info.lastChild && openKeys.indexOf(result) > -1) {
                            result = info.lastChild;
                            info = menuInfoMap[info.lastChild];
                        }
                    }
                    else {
                        result = keyPath[1];
                    }
                    return result;
                };
                var getNewActiveKey = reverse ? getKeyPrev : getKeyNext;
                var newActiveKey = getNewActiveKey(activeKey);
                var newActiveItemInfo = menuInfoMap[newActiveKey];
                while (newActiveItemInfo && newActiveItemInfo.disabled) {
                    newActiveKey = getNewActiveKey(newActiveKey);
                    newActiveItemInfo = menuInfoMap[newActiveKey];
                }
                if (newActiveItemInfo) {
                    setHokeyInfo({
                        type: 'sibling',
                        update: false,
                        activeKeyPath: newActiveItemInfo.keyPath,
                    });
                }
            };
            var walkGenerations = function (reverse) {
                var activeItemInfo = menuInfoMap[activeKey];
                if (activeItemInfo) {
                    var newActiveKey = reverse ? activeItemInfo.keyPath[1] : activeItemInfo.firstChild;
                    var newActiveItemInfo = menuInfoMap[newActiveKey];
                    if (newActiveItemInfo) {
                        setHokeyInfo({
                            type: 'generation',
                            update: true,
                            activeKeyPath: newActiveItemInfo.keyPath,
                        });
                    }
                }
            };
            switch (keyCode) {
                case ArrowUp.code:
                    walkSiblings(true);
                    break;
                case ArrowDown.code:
                    walkSiblings();
                    break;
                case ArrowLeft.code:
                    walkGenerations(true);
                    break;
                case ArrowRight.code:
                    walkGenerations();
                    break;
                case Enter.code:
                    setHokeyInfo(__assign(__assign({}, hotkeyInfo), { type: 'enter', update: true }));
                    break;
                case Esc.code:
                    setHokeyInfo(INITIAL_HOTKEY_INFO);
                    break;
                default:
            }
        },
    };
};
export var useHotkeyHandler = function (key, handler) {
    var hotkeyInfo = useContext(MenuContext).hotkeyInfo;
    var isFirstRender = useIsFirstRender();
    var isActive = key && key === hotkeyInfo.activeKeyPath[0];
    useEffect(function () {
        if (!isFirstRender && hotkeyInfo.update) {
            handler(isActive, hotkeyInfo.type);
        }
    }, [hotkeyInfo]);
    return isActive;
};
