import React from 'react';
import IconLeft from '../../../icon/react-icon/IconLeft';
import IconRight from '../../../icon/react-icon/IconRight';
import IconDoubleLeft from '../../../icon/react-icon/IconDoubleLeft';
import IconDoubleRight from '../../../icon/react-icon/IconDoubleRight';
import cs from '../../_util/classNames';
function Header(props) {
    var prefixCls = props.prefixCls, title = props.title, onPrev = props.onPrev, onNext = props.onNext, onSuperPrev = props.onSuperPrev, onSuperNext = props.onSuperNext, mode = props.mode, value = props.value, onChangePanel = props.onChangePanel, _a = props.icons, icons = _a === void 0 ? {} : _a;
    var showPrev = typeof onPrev === 'function';
    var showSuperPrev = typeof onSuperPrev === 'function';
    var showNext = typeof onNext === 'function';
    var showSuperNext = typeof onSuperNext === 'function';
    var getIconClassName = function (isShow) {
        var _a;
        return cs(prefixCls + "-header-icon", (_a = {}, _a[prefixCls + "-header-icon-hidden"] = !isShow, _a));
    };
    function renderHeaderLabel() {
        if (title) {
            return title;
        }
        if (mode === 'date' || mode === 'week') {
            return (React.createElement(React.Fragment, null,
                React.createElement("span", { className: prefixCls + "-header-label", onClick: function () { return onChangePanel('year'); } }, value.format('YYYY')),
                "-",
                React.createElement("span", { className: prefixCls + "-header-label", onClick: function () { return onChangePanel('month'); } }, value.format('MM'))));
        }
        if (mode === 'month' || mode === 'quarter') {
            return (React.createElement("span", { className: prefixCls + "-header-label", onClick: function () { return onChangePanel('year'); } }, value.format('YYYY')));
        }
    }
    var prevDoubleNull = icons.prevDouble === null;
    var prevNull = icons.prev === null;
    var nextNull = icons.next === null;
    var nextDoubleNull = icons.nextDouble === null;
    return (React.createElement("div", { className: prefixCls + "-header" },
        !prevDoubleNull && (React.createElement("div", { className: getIconClassName(showSuperPrev), onClick: onSuperPrev }, showSuperPrev && (prevDoubleNull ? null : icons.prevDouble || React.createElement(IconDoubleLeft, null)))),
        !prevNull && (React.createElement("div", { className: getIconClassName(showPrev), onClick: onPrev }, showPrev && (prevNull ? null : icons.prev || React.createElement(IconLeft, null)))),
        React.createElement("div", { className: prefixCls + "-header-value" }, renderHeaderLabel()),
        !nextNull && (React.createElement("div", { className: getIconClassName(showNext), onClick: onNext }, showNext && (nextNull ? null : icons.next || React.createElement(IconRight, null)))),
        !nextDoubleNull && (React.createElement("div", { className: getIconClassName(showSuperNext), onClick: onSuperNext }, showSuperNext && (nextDoubleNull ? null : icons.nextDouble || React.createElement(IconDoubleRight, null))))));
}
export default Header;
