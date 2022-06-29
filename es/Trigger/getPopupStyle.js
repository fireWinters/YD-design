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
import { isServerRendering } from '../_util/dom';
import { isArray } from '../_util/is';
// get element's position relative to root element
function getElementPosition(element, elementRect, root) {
    if (!root || !element || isServerRendering) {
        return { left: 0, width: 0, height: 0, top: 0 };
    }
    // safari and chrome
    var bodyScroll = function (direction) { return document.documentElement[direction] || document.body[direction]; };
    var pageScrollTop = root === document.body ? bodyScroll('scrollTop') : root.scrollTop;
    var pageScrollLeft = root === document.body ? bodyScroll('scrollLeft') : root.scrollLeft;
    var left = elementRect.left, top = elementRect.top, width = elementRect.width, height = elementRect.height;
    // custom container
    var rootLeft = root === document.body ? 0 : root.getBoundingClientRect().left;
    var rootTop = root === document.body ? 0 : root.getBoundingClientRect().top;
    var pTop = top + pageScrollTop - rootTop;
    var pLeft = left + pageScrollLeft - rootLeft;
    return {
        left: pLeft,
        top: pTop,
        width: width,
        height: height,
    };
}
var getInsideValue = function (min, max, value) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
};
var getPopupAlign = function (propsPopupAlign, showArrow) {
    var horizontalOffset = 0;
    var verticalOffset = 0;
    var resultPopupAlign = {};
    if (!showArrow) {
        resultPopupAlign = __assign({}, propsPopupAlign);
    }
    else {
        resultPopupAlign = __assign({ left: 12, right: 12, top: 12, bottom: 12 }, propsPopupAlign);
    }
    for (var key in resultPopupAlign) {
        if (isArray(resultPopupAlign[key])) {
            var index = 0;
            // top,bottom 时候，第二个参数是纵向偏移量
            if (['top', 'bottom'].indexOf(key) > -1) {
                index = 1;
                horizontalOffset = resultPopupAlign[key][0];
            }
            else {
                verticalOffset = resultPopupAlign[key][1];
            }
            resultPopupAlign[key] = resultPopupAlign[key][index];
        }
    }
    return __assign(__assign({}, resultPopupAlign), { horizontalOffset: horizontalOffset, verticalOffset: verticalOffset });
};
var getChildRect = function (child, mouseLocation) {
    return mouseLocation
        ? {
            left: mouseLocation.clientX,
            top: mouseLocation.clientY,
            width: 0,
            height: 0,
            right: mouseLocation.clientX,
            bottom: mouseLocation.clientY,
        }
        : child.getBoundingClientRect();
};
export default (function (props, content, child, mountContainer, mouseLocation) {
    var autoAlignPopupWidth = props.autoAlignPopupWidth, autoAlignPopupMinWidth = props.autoAlignPopupMinWidth, alignPoint = props.alignPoint, propsStyle = props.style;
    if (!child || !content || !mountContainer) {
        return {};
    }
    var style = {};
    // 如果跟随鼠标，相当于鼠标位置作为 child
    var childRect = getChildRect(child, alignPoint && mouseLocation);
    var _a = getElementPosition(child, childRect, mountContainer), left = _a.left, top = _a.top, width = _a.width, height = _a.height;
    var popupAlign = getPopupAlign(props.popupAlign, props.showArrow);
    var alignLeft = popupAlign.left || 0;
    var alignRight = popupAlign.right || 0;
    var alignTop = popupAlign.top || 0;
    var alignBottom = popupAlign.bottom || 0;
    // 通过props.style 传递的width优先级更高
    if (autoAlignPopupWidth && (propsStyle === null || propsStyle === void 0 ? void 0 : propsStyle.width) === undefined) {
        content.style.width = child.offsetWidth + "px";
    }
    if (autoAlignPopupMinWidth) {
        content.style.minWidth = child.offsetWidth + "px";
    }
    var realPosition = props.position;
    var arrowStyle = {};
    var autoPosition = function (direction) {
        var _a, _b;
        if (!props.autoFitPosition) {
            return;
        }
        // document.documentElement?.clientHeight 是为了排除横向滚动条的高度影响。
        var windowHeight = ((_a = document.documentElement) === null || _a === void 0 ? void 0 : _a.clientHeight) || window.innerHeight;
        var windowWidth = ((_b = document.documentElement) === null || _b === void 0 ? void 0 : _b.clientWidth) || window.innerWidth;
        var result = false; // 是否进行了位置调整
        // 视口左侧/顶部到 popupcontainer 的距离
        var boundnary = {
            left: left - childRect.left,
            top: top - childRect.top,
        };
        var _c = style.top, styleTop = _c === void 0 ? 0 : _c, _d = style.left, styleLeft = _d === void 0 ? 0 : _d;
        // 水平方向微调
        if (direction === 'top' || direction === 'bottom') {
            if (boundnary.left > styleLeft && childRect.right > 12) {
                // 左边被遮挡
                style.left = Math.max(boundnary.left, left - content.clientWidth);
                style.left = Math.max(style.left, left - content.clientWidth + 24);
            }
            else if (styleLeft - boundnary.left + content.clientWidth > windowWidth &&
                windowWidth - childRect.left > 12) {
                // 右侧被遮挡，右侧贴边。如果child在可视区内的宽度小于12，不进行位置调整
                style.left = Math.max(boundnary.left, boundnary.left + windowWidth - content.clientWidth);
                style.left = Math.max(style.left, left - content.clientWidth + 24);
            }
        }
        // 垂直方向微调
        if (direction === 'left' || direction === 'right') {
            if (boundnary.top > styleTop && childRect.bottom > 12) {
                // 上面
                style.top = boundnary.top;
                style.top = Math.max(style.top, top - content.clientHeight + childRect.height / 2);
            }
            else if (styleTop - boundnary.top + content.clientHeight > windowHeight &&
                windowHeight - childRect.top > 12) {
                // 向上微调位置，如果child在可视区内的高度小于12，不进行位置调整
                style.top = Math.max(boundnary.top, boundnary.top + windowHeight - content.clientHeight);
                style.top = Math.max(style.top, top - content.clientHeight + childRect.height / 2);
            }
        }
        if (direction === 'top' && boundnary.top > styleTop) {
            // 上面被遮挡
            if (childRect.top < windowHeight - childRect.bottom) {
                // 放到下面
                style.top = Math.min(top + height + (alignTop || 0), boundnary.top + windowHeight - content.clientHeight);
                result = true;
            }
            else {
                // 贴顶部边界
                style.top = boundnary.top;
            }
        }
        if (direction === 'bottom' && styleTop - boundnary.top + content.clientHeight > windowHeight) {
            // 下部分被遮挡
            if (windowHeight - childRect.bottom < childRect.top) {
                // 放到上面
                style.top = Math.max(top - content.clientHeight - (alignBottom || 0), boundnary.top);
                result = true;
            }
            else {
                // 贴底边界
                style.top = boundnary.top + windowHeight - content.clientHeight;
            }
        }
        if (direction === 'left' && boundnary.left > styleLeft) {
            // 左边被遮挡
            if (childRect.left < windowWidth - childRect.right) {
                // 放到右边
                style.left = Math.min(width + left + alignRight, boundnary.left + windowWidth - content.clientWidth);
                result = true;
            }
            else {
                style.left = boundnary.left;
            }
        }
        if (direction === 'right' && styleLeft - boundnary.left + content.clientWidth > windowWidth) {
            // 右边被遮挡
            if (windowWidth - childRect.right < childRect.left) {
                // 放到左边
                style.left = Math.max(left - content.clientWidth - alignLeft, boundnary.left);
                result = true;
            }
            else {
                // 贴左边界
                style.left = boundnary.left + windowWidth - content.clientWidth;
            }
        }
        // 限制在popupContainer中，左侧最小为 0px
        if (style.left < 0) {
            style.left = 0;
        }
        else {
            // 限制在popupContainer中，左侧最大为 mountContainer.scrollWidth - content.clientWidth，保证弹出层在container内部
            var maxLeft = mountContainer.scrollWidth - content.clientWidth;
            style.left = Math.min(maxLeft, style.left);
        }
        return result;
    };
    var horizontalOffset = popupAlign.horizontalOffset || 0;
    var verticalOffset = popupAlign.verticalOffset || 0;
    switch (props.position) {
        case 'top': {
            style.top = top - content.clientHeight - alignTop;
            style.left = left + width / 2 - content.clientWidth / 2;
            autoPosition('top') && (realPosition = 'bottom');
            style.left += horizontalOffset;
            var arrowLeft_1 = left - Number(style.left) + width / 2;
            arrowStyle.left = getInsideValue(12, content.clientWidth - 12, arrowLeft_1);
            break;
        }
        case 'tl':
            style.top = top - content.clientHeight - alignTop;
            style.left = left;
            autoPosition('top') && (realPosition = 'bl');
            style.left += horizontalOffset;
            var arrowLeft = left - Number(style.left) + Math.min(width / 2, 50);
            arrowStyle.left = getInsideValue(12, content.clientWidth - 12, arrowLeft);
            break;
        case 'tr':
            style.top = -content.clientHeight + top - alignTop;
            style.left = left + width - content.clientWidth;
            autoPosition('top') && (realPosition = 'br');
            style.left += horizontalOffset;
            arrowLeft = left - Number(style.left) + Math.max(width / 2, width - 50);
            arrowStyle.left = getInsideValue(12, content.clientWidth - 12, arrowLeft);
            break;
        case 'bottom': {
            style.top = height + top + alignBottom;
            style.left = left + width / 2 - content.clientWidth / 2;
            autoPosition('bottom') && (realPosition = 'top');
            style.left += horizontalOffset;
            var arrowLeft_2 = left - Number(style.left) + width / 2;
            arrowStyle.left = getInsideValue(12, content.clientWidth - 12, arrowLeft_2);
            break;
        }
        case 'bl':
            style.top = height + top + alignBottom;
            style.left = left;
            autoPosition('bottom') && (realPosition = 'tl');
            style.left += horizontalOffset;
            arrowLeft = left - Number(style.left) + Math.min(width / 2, 50);
            arrowStyle.left = getInsideValue(12, content.clientWidth - 12, arrowLeft);
            break;
        case 'br':
            style.top = height + top + alignBottom;
            style.left = left + width - content.clientWidth;
            autoPosition('bottom') && (realPosition = 'tr');
            style.left += horizontalOffset;
            arrowLeft = left - Number(style.left) + Math.max(width / 2, width - 50);
            arrowStyle.left = getInsideValue(12, content.clientWidth - 12, arrowLeft);
            break;
        case 'left': {
            style.top = top + height / 2 - content.clientHeight / 2;
            style.left = left - content.clientWidth - alignLeft;
            autoPosition('left') && (realPosition = 'right');
            style.top += verticalOffset;
            var arrowTop_1 = top - Number(style.top) + height / 2;
            arrowStyle.top = getInsideValue(12, content.clientHeight - 12, arrowTop_1);
            break;
        }
        case 'lt':
            style.top = top;
            style.left = left - content.clientWidth - alignLeft;
            autoPosition('left') && (realPosition = 'rt');
            style.top += verticalOffset;
            var arrowTop = top - Number(style.top) + Math.min(height / 2, 50);
            arrowStyle.top = getInsideValue(12, content.clientHeight - 12, arrowTop);
            break;
        case 'lb':
            style.top = top + height - content.clientHeight;
            style.left = left - content.clientWidth - alignLeft;
            autoPosition('left') && (realPosition = 'rb');
            style.top += verticalOffset;
            arrowTop = top - Number(style.top) + Math.max(height / 2, height - 50);
            arrowStyle.top = getInsideValue(12, content.clientHeight - 12, arrowTop);
            break;
        case 'right': {
            style.top = top + height / 2 - content.clientHeight / 2;
            style.left = width + left + alignRight;
            autoPosition('right') && (realPosition = 'left');
            style.top += verticalOffset;
            var arrowTop_2 = top - Number(style.top) + height / 2;
            arrowStyle.top = getInsideValue(12, content.clientHeight - 12, arrowTop_2);
            break;
        }
        case 'rt':
            style.top = top;
            style.left = width + left + alignRight;
            autoPosition('right') && (realPosition = 'lt');
            style.top += verticalOffset;
            arrowTop = top - Number(style.top) + Math.min(height / 2, 50);
            arrowStyle.top = getInsideValue(12, content.clientHeight - 12, arrowTop);
            break;
        case 'rb':
            style.top = top + height - content.clientHeight;
            style.left = width + left + alignRight;
            autoPosition('right') && (realPosition = 'lb');
            style.top += verticalOffset;
            arrowTop = top - Number(style.top) + Math.max(height / 2, height - 50);
            arrowStyle.top = getInsideValue(12, content.clientHeight - 12, arrowTop);
            break;
        default:
            break;
    }
    return {
        style: style,
        arrowStyle: arrowStyle,
        realPosition: realPosition,
    };
});
