import React from 'react';
import IconLeft from '../../../icon/react-icon/IconLeft';
import IconRight from '../../../icon/react-icon/IconRight';
import IconUp from '../../../icon/react-icon/IconUp';
import IconDown from '../../../icon/react-icon/IconDown';
import IconHover from '../../_class/icon-hover';
import cs from '../../_util/classNames';
var TabNavIcon = function (props) {
    var _a, _b, _c, _d;
    var direction = props.direction, headerSize = props.headerSize, headerWrapperSize = props.headerWrapperSize, prefixCls = props.prefixCls, iconPos = props.iconPos, curOffset = props.currentOffset, align = props.align;
    var wrapHeight = headerWrapperSize.height, wrapWidth = headerWrapperSize.width;
    var headerHeight = headerSize.height, headerWidth = headerSize.width;
    var maxHeightOffset = headerHeight - wrapHeight;
    var maxWidthOffset = headerWidth - wrapWidth;
    var onChange = function (offset) {
        if (offset !== props.currentOffset) {
            props.onChange && props.onChange(offset);
        }
    };
    var handleHozClick = function (e, pos) {
        e.preventDefault();
        var nextOffset;
        if (align === 'left') {
            nextOffset = pos === 'left' ? curOffset - wrapWidth : curOffset + wrapWidth;
        }
        else {
            nextOffset = pos === 'left' ? curOffset + wrapWidth : curOffset - wrapWidth;
        }
        onChange(nextOffset);
    };
    var handleVerticalClick = function (e, pos) {
        e.preventDefault();
        var nextOffset;
        if (pos === 'up') {
            nextOffset = curOffset - wrapHeight;
        }
        else {
            nextOffset = curOffset + wrapHeight;
            if (nextOffset >= headerHeight)
                return;
        }
        onChange(nextOffset);
    };
    var disabledPrev = false;
    var disabledNext = false;
    if (align === 'left') {
        disabledPrev = curOffset <= 0;
        disabledNext =
            direction === 'vertical' ? curOffset >= maxHeightOffset : curOffset >= maxWidthOffset;
    }
    else {
        disabledPrev =
            direction === 'vertical' ? curOffset >= maxHeightOffset : curOffset >= maxWidthOffset;
        disabledNext = curOffset <= 0;
    }
    return direction === 'vertical' ? (iconPos === 'prev' ? (React.createElement(IconHover, { disabled: disabledPrev, prefix: prefixCls, className: cs(prefixCls + "-up-icon", (_a = {},
            _a[prefixCls + "-nav-icon-disabled"] = disabledPrev,
            _a)), onClick: function (e) {
            handleVerticalClick(e, 'up');
        } },
        React.createElement(IconUp, null))) : (React.createElement(IconHover, { prefix: prefixCls, className: cs(prefixCls + "-down-icon", (_b = {},
            _b[prefixCls + "-nav-icon-disabled"] = disabledNext,
            _b)), disabled: disabledNext, onClick: function (e) {
            handleVerticalClick(e, 'down');
        } },
        React.createElement(IconDown, null)))) : iconPos === 'prev' ? (React.createElement(IconHover, { prefix: prefixCls, disabled: disabledPrev, className: cs(prefixCls + "-left-icon", (_c = {},
            _c[prefixCls + "-nav-icon-disabled"] = disabledPrev,
            _c)), onClick: function (e) {
            handleHozClick(e, 'left');
        } },
        React.createElement(IconLeft, null))) : (React.createElement(IconHover, { prefix: prefixCls, className: cs(prefixCls + "-right-icon", (_d = {},
            _d[prefixCls + "-nav-icon-disabled"] = disabledNext,
            _d)), disabled: disabledNext, onClick: function (e) {
            handleHozClick(e, 'right');
        } },
        React.createElement(IconRight, null)));
};
export default TabNavIcon;
