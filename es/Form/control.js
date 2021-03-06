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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { Component } from 'react';
import isEqualWith from 'lodash/isEqualWith';
import has from 'lodash/has';
import set from 'lodash/set';
import get from 'lodash/get';
import setWith from 'lodash/setWith';
import { FormItemContext } from './context';
import { isArray, isFunction, isNullOrUndefined } from '../_util/is';
import warn from '../_util/warning';
import IconExclamationCircleFill from '../../icon/react-icon/IconExclamationCircleFill';
import IconCloseCircleFill from '../../icon/react-icon/IconCloseCircleFill';
import IconCheckCircleFill from '../../icon/react-icon/IconCheckCircleFill';
import IconLoading from '../../icon/react-icon/IconLoading';
import classNames from '../_util/classNames';
import { isSyntheticEvent, schemaValidate, ID_SUFFIX } from './utils';
function isFieldMath(field, fields) {
    var fieldObj = setWith({}, field, undefined, Object);
    return fields.some(function (item) { return has(fieldObj, item); });
}
var Control = /** @class */ (function (_super) {
    __extends(Control, _super);
    function Control(props, context) {
        var _this = _super.call(this, props) || this;
        _this.errors = null;
        _this.warnings = null;
        _this.isDestroyed = false;
        _this.getErrors = function () {
            return _this.errors;
        };
        _this.isTouched = function () {
            return _this.touched;
        };
        _this.hasFieldProps = function () {
            return !!_this.props.field;
        };
        _this.updateFormItem = function () {
            if (_this.isDestroyed)
                return;
            _this.forceUpdate();
            var updateFormItem = _this.context.updateFormItem;
            updateFormItem &&
                updateFormItem(_this.props.field, {
                    errors: _this.errors,
                    warnings: _this.warnings,
                });
        };
        _this.onStoreChange = function (type, info) {
            var fields = isArray(info.field) ? info.field : [info.field];
            var _a = _this.props, field = _a.field, shouldUpdate = _a.shouldUpdate;
            // isInner: the value is changed by innerSetValue
            var shouldUpdateItem = function (extra) {
                if (shouldUpdate) {
                    var shouldRender = false;
                    if (isFunction(shouldUpdate)) {
                        shouldRender = shouldUpdate(info.prev, info.current, __assign({ field: info.field }, extra));
                    }
                    else {
                        shouldRender = !isEqualWith(info.prev, info.current);
                    }
                    if (shouldRender) {
                        _this.updateFormItem();
                    }
                }
            };
            switch (type) {
                case 'reset':
                    _this.touched = false;
                    _this.errors = null;
                    _this.warnings = null;
                    _this.updateFormItem();
                    break;
                case 'innerSetValue':
                    if (isFieldMath(field, fields)) {
                        _this.touched = true;
                        _this.updateFormItem();
                        return;
                    }
                    shouldUpdateItem({
                        isInner: true,
                        isFormList: info.isFormList,
                    });
                    break;
                case 'setFieldValue':
                    if (isFieldMath(field, fields)) {
                        _this.touched = true;
                        if (info.data && 'touched' in info.data) {
                            _this.touched = info.data.touched;
                        }
                        if (info.data && 'warnings' in info.data) {
                            _this.warnings = isNullOrUndefined(info.data.warnings)
                                ? []
                                : [].concat(info.data.warnings);
                        }
                        if (info.data && 'errors' in info.data) {
                            _this.errors = info.data.errors;
                        }
                        else if (!isEqualWith(get(info.prev, field), get(info.current, field))) {
                            _this.errors = null;
                        }
                        _this.updateFormItem();
                        return;
                    }
                    shouldUpdateItem();
                    break;
                default:
                    break;
            }
        };
        _this.innerSetFieldValue = function (field, value) {
            if (!field)
                return;
            var store = _this.context.store;
            var methods = store.getInnerMethods(true);
            methods.innerSetFieldValue(field, value);
            var changedValue = {};
            set(changedValue, field, value);
            _this.props.onValuesChange &&
                _this.props.onValuesChange(changedValue, __assign({}, store.getFieldsValue()));
        };
        _this.getTriggerHandler = function (children) {
            return function (_value) {
                var _a;
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var store = _this.context.store;
                var _b = _this.props, field = _b.field, trigger = _b.trigger, normalize = _b.normalize, getValueFromEvent = _b.getValueFromEvent;
                var value = isFunction(getValueFromEvent) ? getValueFromEvent.apply(void 0, __spreadArray([_value], __read(args), false)) : _value;
                var normalizeValue = value;
                // break if value is instance of SyntheticEvent, 'cos value is missing
                if (isSyntheticEvent(value)) {
                    warn(true, 'changed value missed, please check whether extra elements is outta input/select controled by Form.Item');
                    value.stopPropagation();
                    return;
                }
                if (typeof normalize === 'function') {
                    normalizeValue = normalize(value, store.getFieldValue(field), __assign({}, store.getFieldsValue()));
                }
                _this.touched = true;
                _this.innerSetFieldValue(field, normalizeValue);
                _this.validateField(trigger);
                if (children && children.props && children.props[trigger]) {
                    (_a = children.props)[trigger].apply(_a, __spreadArray([normalizeValue], __read(args), false));
                }
            };
        };
        /**
         *
         * @param triggerType the value of validateTrigger.
         * @returns
         */
        _this.validateField = function (triggerType) {
            var _a = _this.context, store = _a.store, ctxValidateTrigger = _a.validateTrigger, validateMessages = _a.validateMessages;
            var _b = _this.props, field = _b.field, rules = _b.rules, validateTrigger = _b.validateTrigger;
            var value = store.getFieldValue(field);
            var _rules = !triggerType
                ? rules
                : (rules || []).filter(function (rule) {
                    var triggers = [].concat(rule.validateTrigger || validateTrigger || ctxValidateTrigger);
                    return triggers.indexOf(triggerType) > -1;
                });
            if (_rules && _rules.length && field) {
                return schemaValidate(field, value, _rules, validateMessages).then(function (_a) {
                    var error = _a.error, warning = _a.warning;
                    _this.errors = error ? error[field] : null;
                    _this.warnings = warning || null;
                    _this.updateFormItem();
                    return Promise.resolve({ error: error, value: value, field: field });
                });
            }
            if (_this.errors) {
                _this.errors = null;
                _this.warnings = null;
                _this.updateFormItem();
            }
            return Promise.resolve({ error: null, value: value, field: field });
        };
        _this.getChild = function () {
            var children = _this.props.children;
            var store = _this.context.store;
            if (isFunction(children)) {
                return children(store.getFields(), __assign({}, store));
            }
            return children;
        };
        if ('initialValue' in props && _this.hasFieldProps()) {
            var innerMethods = context.store.getInnerMethods(true);
            innerMethods.innerSetInitialValue(props.field, props.initialValue);
        }
        return _this;
    }
    Control.prototype.componentDidMount = function () {
        var store = this.context.store;
        if (store) {
            var innerMethods = store.getInnerMethods(true);
            this.removeRegisterField = innerMethods.registerField(this);
        }
        this.isDestroyed = false;
    };
    Control.prototype.componentWillUnmount = function () {
        this.removeRegisterField && this.removeRegisterField();
        this.removeRegisterField = null;
        // destroy errors
        var updateFormItem = this.context.updateFormItem;
        updateFormItem && updateFormItem(this.props.field, { errors: null, warnings: null });
        this.isDestroyed = true;
    };
    /**
     * ??????rules??????validateTrigger??????
     */
    Control.prototype.getValidateTrigger = function () {
        var _validateTrigger = this.props.validateTrigger || this.context.validateTrigger || 'onChange';
        var rules = this.props.rules || [];
        var result = [];
        rules.map(function (item) {
            result = result.concat(item.validateTrigger || _validateTrigger);
        });
        return Array.from(new Set(result));
    };
    Control.prototype.renderControl = function (children, id) {
        var _a;
        var _this = this;
        var _b;
        var _c = this.props, field = _c.field, _d = _c.trigger, trigger = _d === void 0 ? 'onChange' : _d, _e = _c.triggerPropName, triggerPropName = _e === void 0 ? 'value' : _e, validateStatus = _c.validateStatus, formatter = _c.formatter;
        var _f = this.context, store = _f.store, ctxDisabled = _f.disabled;
        var disabled = 'disabled' in this.props ? this.props.disabled : ctxDisabled;
        var child = React.Children.only(children);
        var childProps = {
            // used by label
            id: classNames(((_b = child.props) === null || _b === void 0 ? void 0 : _b.id) || (_a = {}, _a["" + id + ID_SUFFIX] = id, _a)),
        };
        this.getValidateTrigger().forEach(function (vt) {
            childProps[vt] = function (e) {
                _this.validateField(vt);
                child.props[vt] && child.props[vt](e);
            };
        });
        childProps[trigger] = this.getTriggerHandler(child);
        if (disabled !== undefined) {
            childProps.disabled = disabled;
        }
        var _value = store.getFieldValue(field);
        if (isFunction(formatter)) {
            _value = formatter(_value);
        }
        childProps[triggerPropName] = _value;
        if (!validateStatus && this.errors) {
            childProps.error = true;
        }
        return React.cloneElement(child, childProps);
    };
    Control.prototype.render = function () {
        var _a = this.props, noStyle = _a.noStyle, field = _a.field, isFormList = _a.isFormList, hasFeedback = _a.hasFeedback;
        var validateStatus = this.props.validateStatus || (this.errors ? 'error' : '');
        var _b = this.context, prefixCls = _b.prefixCls, getFormElementId = _b.getFormElementId;
        var child = this.getChild();
        var id = this.hasFieldProps() ? getFormElementId(field) : undefined;
        if (this.hasFieldProps() && !isFormList && React.Children.count(child) === 1) {
            child = this.renderControl(child, id);
        }
        if (noStyle) {
            return child;
        }
        return (React.createElement("div", { className: prefixCls + "-item-control-wrapper" },
            React.createElement("div", { className: prefixCls + "-item-control", id: id },
                React.createElement("div", { className: prefixCls + "-item-control-children" },
                    child,
                    validateStatus && hasFeedback && (React.createElement("div", { className: prefixCls + "-item-feedback" },
                        validateStatus === 'warning' && React.createElement(IconExclamationCircleFill, null),
                        validateStatus === 'success' && React.createElement(IconCheckCircleFill, null),
                        validateStatus === 'error' && React.createElement(IconCloseCircleFill, null),
                        validateStatus === 'validating' && React.createElement(IconLoading, null)))))));
    };
    Control.defaultProps = {
        trigger: 'onChange',
        triggerPropName: 'value',
    };
    Control.isFormControl = true;
    Control.contextType = FormItemContext;
    return Control;
}(Component));
export default Control;
