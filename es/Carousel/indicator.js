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
import React, { useContext } from 'react';
import cs from '../_util/classNames';
import { ConfigContext } from '../ConfigProvider';
function CarouselIndicator(props, ref) {
    var _a, _b;
    var getPrefixCls = useContext(ConfigContext).getPrefixCls;
    var className = props.className, _c = props.type, type = _c === void 0 ? 'line' : _c, _d = props.count, count = _d === void 0 ? 2 : _d, _e = props.activeIndex, activeIndex = _e === void 0 ? 0 : _e, _f = props.position, position = _f === void 0 ? 'bottom' : _f, _g = props.trigger, trigger = _g === void 0 ? 'click' : _g, onSelectIndex = props.onSelectIndex;
    var prefixCls = getPrefixCls('carousel-indicator');
    var indicatorContent = [];
    if (type === 'slider') {
        var step = 100 / count;
        indicatorContent.push(React.createElement("span", { key: 0, style: { width: step + "%", left: activeIndex * step + "%" }, className: cs(prefixCls + "-item", prefixCls + "-item-active") }));
    }
    else {
        for (var i = 0; i < count; i++) {
            indicatorContent.push(React.createElement("span", { key: i, "data-index": i, className: cs(prefixCls + "-item", (_a = {},
                    _a[prefixCls + "-item-active"] = i === activeIndex,
                    _a)) }));
        }
    }
    var wrapperProps = (_b = {
            ref: ref,
            className: cs(prefixCls, prefixCls + "-" + type, prefixCls + "-" + position, className)
        },
        _b[trigger === 'click' ? 'onClick' : 'onMouseEnter'] = function (event) {
            event.preventDefault();
            if (type === 'slider') {
                var x = event.nativeEvent.offsetX;
                var width = event.currentTarget.clientWidth;
                // clear up effect from event bubbling
                if (event.target === event.currentTarget) {
                    var index = ~~((x / width) * count);
                    index !== activeIndex && onSelectIndex(index);
                }
            }
            else {
                var index = +event.target.getAttribute('data-index');
                !isNaN(index) && index !== activeIndex && onSelectIndex(index);
            }
        },
        _b);
    return React.createElement("div", __assign({}, wrapperProps), indicatorContent);
}
var CarouselIndicatorComponent = React.forwardRef(CarouselIndicator);
export default CarouselIndicatorComponent;
