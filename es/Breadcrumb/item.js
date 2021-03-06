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
import React, { useState } from 'react';
import cs from '../_util/classNames';
import Dropdown from '../Dropdown';
import IconDown from '../../icon/react-icon/IconDown';
import omit from '../_util/omit';
function Item(props) {
    var _a, _b;
    var children = props.children, style = props.style, className = props.className, prefixCls = props.prefixCls, droplist = props.droplist, dropdownProps = props.dropdownProps;
    var _c = __read(useState(false), 2), dropdownVisible = _c[0], setDropdownVisible = _c[1];
    var dom = (React.createElement("div", { role: "listitem", style: style, className: cs(prefixCls + "-item", (_a = {},
            _a[prefixCls + "-item-with-dropdown"] = droplist,
            _a), className) },
        children,
        droplist && (React.createElement("span", { "aria-hidden": true, className: cs(prefixCls + "-item-dropdown-icon", (_b = {},
                _b[prefixCls + "-item-dropdown-icon-active"] = dropdownVisible,
                _b)) },
            React.createElement(IconDown, null)))));
    return droplist ? (React.createElement(Dropdown, __assign({ droplist: droplist, onVisibleChange: function (visible) {
            setDropdownVisible(visible);
            dropdownProps && dropdownProps.onVisibleChange && dropdownProps.onVisibleChange(visible);
        } }, omit(dropdownProps, ['onVisibleChange'])), dom)) : (dom);
}
Item.displayName = 'BreadcrumbItem';
export default Item;
