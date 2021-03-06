import React from 'react';
import Checkbox from '../../Checkbox';
import IconRight from '../../../icon/react-icon/IconRight';
import IconLoading from '../../../icon/react-icon/IconLoading';
import IconCheck from '../../../icon/react-icon/IconCheck';
var Option = function (props) {
    var prefixCls = props.prefixCls, multiple = props.multiple, option = props.option, renderOption = props.renderOption, selected = props.selected;
    var checkboxDisabled = option.disabled || (multiple && option.disableCheckbox);
    return (React.createElement(React.Fragment, null,
        multiple ? (React.createElement(Checkbox, { disabled: checkboxDisabled, checked: option._checked, indeterminate: option._halfChecked, onChange: props.onMultipleChecked, value: option.value })) : (''),
        React.createElement("div", { className: prefixCls + "-list-item-label", onClick: option.disabled ? undefined : props.onClickOption, onMouseEnter: props.onMouseEnter, onDoubleClick: checkboxDisabled ? undefined : props.onDoubleClickOption },
            renderOption ? renderOption() : option.label,
            option.isLeaf ? (selected && React.createElement(IconCheck, null)) : option.loading ? (React.createElement(IconLoading, null)) : (React.createElement(IconRight, null)))));
};
export default Option;
