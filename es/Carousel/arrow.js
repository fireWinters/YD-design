import React, { useContext } from 'react';
import IconLeft from '../../icon/react-icon/IconLeft';
import IconRight from '../../icon/react-icon/IconRight';
import IconUp from '../../icon/react-icon/IconUp';
import IconDown from '../../icon/react-icon/IconDown';
import cs from '../_util/classNames';
import { ConfigContext } from '../ConfigProvider';
function CarouselArrow(props, ref) {
    var _a;
    var className = props.className, direction = props.direction, showArrow = props.showArrow, prev = props.prev, next = props.next, icons = props.icons;
    var getPrefixCls = useContext(ConfigContext).getPrefixCls;
    var prefixCls = getPrefixCls('carousel');
    var arrowClass = cs(prefixCls + "-arrow", (_a = {},
        _a[prefixCls + "-arrow-hover"] = showArrow === 'hover',
        _a), className);
    var iconPrev = icons && icons.hasOwnProperty('prev') ? (icons.prev) : direction === 'horizontal' ? (React.createElement(IconLeft, null)) : (React.createElement(IconUp, null));
    var iconNext = icons && icons.hasOwnProperty('next') ? (icons.next) : direction === 'horizontal' ? (React.createElement(IconRight, null)) : (React.createElement(IconDown, null));
    return (React.createElement("div", { ref: ref, className: arrowClass },
        React.createElement("div", { className: prefixCls + "-arrow-" + (direction === 'vertical' ? 'top' : 'left'), onClick: prev }, iconPrev),
        React.createElement("div", { className: prefixCls + "-arrow-" + (direction === 'vertical' ? 'bottom' : 'right'), onClick: next }, iconNext)));
}
var CarouselArrowComponent = React.forwardRef(CarouselArrow);
CarouselArrowComponent.defaultProps = {
    direction: 'horizontal',
    showArrow: 'always',
};
export default CarouselArrowComponent;
