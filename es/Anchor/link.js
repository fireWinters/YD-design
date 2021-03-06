import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, isValidElement, } from 'react';
import AnchorContext from './context';
import { ConfigContext } from '../ConfigProvider';
import cs from '../_util/classNames';
import { isString, isObject, isUndefined, isNull } from '../_util/is';
import useMergeProps from '../_util/hooks/useMergeProps';
var DISPLAY_NAME = 'AnchorLink';
var defaultProps = {
    href: '#',
};
function isNamedComponent(type) {
    return isObject(type) && type.hasOwnProperty('displayName');
}
function Link(baseProps, ref) {
    var _a;
    var _b = useContext(ConfigContext), getPrefixCls = _b.getPrefixCls, componentConfig = _b.componentConfig;
    var _c = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig['Anchor.Link']), className = _c.className, style = _c.style, href = _c.href, title = _c.title, children = _c.children;
    var anchorContext = useContext(AnchorContext);
    var currentLink = anchorContext.currentLink, addLink = anchorContext.addLink, removeLink = anchorContext.removeLink, onLinkClick = anchorContext.onLinkClick;
    var prefixCls = getPrefixCls('anchor-link');
    var classNames = cs(prefixCls, (_a = {},
        _a[prefixCls + "-active"] = currentLink === href,
        _a), className);
    var linkRef = useRef(null);
    useImperativeHandle(ref, function () { return linkRef.current; }, []);
    useEffect(function () {
        addLink && addLink(href, linkRef.current);
        return function () {
            removeLink && removeLink(href);
        };
    }, [href]);
    return (React.createElement("div", { className: classNames, style: style, ref: linkRef },
        !isUndefined(title) && !isNull(title) && (React.createElement("a", { className: prefixCls + "-title", title: isString(title) ? title : '', href: href, "data-href": href, onClick: function (e) {
                onLinkClick && onLinkClick(e, href);
            } }, title)),
        children &&
            React.Children.map(children, function (item) {
                return (isValidElement(item) &&
                    isNamedComponent(item.type) &&
                    item.type.displayName === DISPLAY_NAME &&
                    item);
            })));
}
var AnchorLinkComponent = forwardRef(Link);
AnchorLinkComponent.displayName = DISPLAY_NAME;
export default AnchorLinkComponent;
