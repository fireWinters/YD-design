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
import get from 'lodash/get';
import setWith from 'lodash/setWith';
import has from 'lodash/has';
import omit from 'lodash/omit';
import { cloneDeep, set, iterativelyGetKeys } from './utils';
import { isArray, isObject, isString } from '../_util/is';
import promisify from './promisify';
var Store = /** @class */ (function () {
    function Store() {
        var _this = this;
        this.registerFields = [];
        this.registerWatchers = [];
        // 和formControl 的 touched属性不一样。 只要被改过的字段，这里就会存储。并且不会跟随formControl被卸载而清除。
        // reset 的时候清除
        this.touchedFields = {};
        this.store = {};
        this.initialValues = {};
        this.callbacks = {};
        this.innerSetCallbacks = function (values) {
            _this.callbacks = values;
        };
        this.registerWatcher = function (item) {
            _this.registerWatchers.push(item);
            return function () {
                _this.registerWatchers = _this.registerWatchers.filter(function (x) { return x !== item; });
            };
        };
        // 收集所有control字段，并在组件卸载时移除
        this.registerField = function (item) {
            _this.registerFields.push(item);
            _this.notifyWatchers();
            return function () {
                _this.registerFields = _this.registerFields.filter(function (x) { return x !== item; });
                _this.notifyWatchers();
            };
        };
        // hasField为true时，只返回传入field属性的control实例
        this.getRegisteredFields = function (hasField) {
            if (hasField) {
                return _this.registerFields.filter(function (control) { var _a; return control.hasFieldProps() && !((_a = control.props) === null || _a === void 0 ? void 0 : _a.isFormList); });
            }
            return _this.registerFields;
        };
        // 获取props.field === field 的control组件。
        this.getRegisteredField = function (field) {
            return _this.registerFields.filter(function (x) { return x.props.field === field; })[0];
        };
        // 通知所有的FormItem进行更新。
        // setFieldValue: 外部调用setFieldsValue (setFieldValue等)方法触发更新
        // innerSetValue: 控件例如Input，通过onChange事件触发的更新
        // reset：重置
        this.notify = function (type, info) {
            if (type === 'setFieldValue' || (type === 'innerSetValue' && !info.ignore)) {
                // type = reset时，在reset函数里处理
                // if info.field is a[0], get a.0
                _this._pushTouchField(info.changeValues
                    ? iterativelyGetKeys(info.changeValues)
                    : _this._getIterativelyKeysByField(info.field));
            }
            _this.registerFields.forEach(function (item) {
                item.onStoreChange &&
                    item.onStoreChange(type, __assign(__assign({}, info), { current: _this.store }));
            });
        };
        this.innerSetInitialValues = function (values) {
            if (!values)
                return;
            _this.initialValues = cloneDeep(values);
            Object.keys(values).forEach(function (field) {
                set(_this.store, field, values[field]);
            });
        };
        this.innerSetInitialValue = function (field, value) {
            if (!field)
                return;
            _this.initialValues[field] = value;
            // 组件在创建的时候，需要判断store里存的对应field的值是否生效。只要没有被操作过（touchedFields里不存在），就生效
            if (!_this._inTouchFields(field)) {
                set(_this.store, field, get(_this.initialValues, field));
            }
        };
        /**
         *
         * 内部使用，更新value，会同时触发onChange 和 onValuesChange
         * @options.isFormList  强制更新field对应的组件包括其子组件,form
         */
        this.innerSetFieldValue = function (field, value, options) {
            var _a, _b, _c;
            if (!field)
                return;
            var prev = cloneDeep(_this.store);
            set(_this.store, field, value);
            _this.triggerValuesChange((_a = {}, _a[field] = value, _a));
            _this.triggerTouchChange((_b = {}, _b[field] = value, _b));
            _this.notify('innerSetValue', __assign(__assign({ prev: prev, field: field }, options), { changeValues: (_c = {}, _c[field] = value, _c) }));
        };
        // 内部使用
        this.innerGetStore = function () {
            return _this.store;
        };
        // 获取所有被操作过的字段
        this.getTouchedFields = function () {
            return _this.getRegisteredFields(true)
                .filter(function (item) {
                return item.isTouched();
            })
                .map(function (x) { return x.props.field; });
        };
        // 外部调用设置表单字段值
        this.setFieldValue = function (field, value) {
            var _a;
            if (!field)
                return;
            _this.setFields((_a = {},
                _a[field] = { value: value },
                _a));
        };
        // 外部调用，设置多个表单控件的值
        this.setFieldsValue = function (values) {
            if (isObject(values)) {
                var fields = Object.keys(values);
                var obj_1 = {};
                fields.forEach(function (field) {
                    obj_1[field] = {
                        value: values[field],
                    };
                });
                _this.setFields(obj_1);
            }
        };
        // 外部调用，设置多个表单控件的值，以及 error，touch 信息。
        this.setFields = function (obj) {
            var fields = Object.keys(obj);
            var changeValues = {};
            fields.forEach(function (field) {
                var _a;
                var item = obj[field];
                var prev = cloneDeep(_this.store);
                if (item) {
                    var info = {};
                    if ('error' in item) {
                        info.errors = item.error;
                    }
                    if ('warning' in item) {
                        info.warnings = item.warning;
                    }
                    if ('touched' in item) {
                        info.touched = item.touched;
                    }
                    if ('value' in item) {
                        set(_this.store, field, item.value);
                        changeValues[field] = item.value;
                    }
                    _this.notify('setFieldValue', {
                        data: info,
                        prev: prev,
                        field: field,
                        changeValues: (_a = {}, _a[field] = item.value, _a),
                    });
                }
            });
            _this.triggerValuesChange(changeValues);
        };
        this.getFieldValue = function (field) {
            return cloneDeep(get(_this.store, field));
        };
        // 获取单个字段的错误信息。
        this.getFieldError = function (field) {
            var item = _this.getRegisteredField(field);
            return item ? item.getErrors() : null;
        };
        // 获取传入字段/全部的错误信息
        this.getFieldsError = function (fields) {
            var errors = {};
            if (isArray(fields)) {
                fields.map(function (field) {
                    var error = _this.getFieldError(field);
                    if (error) {
                        errors[field] = error;
                    }
                });
            }
            else {
                _this.getRegisteredFields(true).forEach(function (item) {
                    if (item.getErrors()) {
                        errors[item.props.field] = item.getErrors();
                    }
                });
            }
            return errors;
        };
        this.getFields = function () {
            return cloneDeep(_this.store);
        };
        this.getFieldsValue = function (fields) {
            var values = {};
            if (isArray(fields)) {
                fields.forEach(function (key) {
                    set(values, key, _this.getFieldValue(key));
                });
                return values;
            }
            _this.getRegisteredFields(true).forEach(function (_a) {
                var field = _a.props.field;
                var value = get(_this.store, field);
                set(values, field, value);
            });
            return values;
        };
        this.resetFields = function (fieldKeys) {
            var prev = cloneDeep(_this.store);
            var fields = isString(fieldKeys) ? [fieldKeys] : fieldKeys;
            if (fields && isArray(fields)) {
                var changeValues_1 = {};
                fields.forEach(function (field) {
                    set(_this.store, field, _this.initialValues[field]);
                    changeValues_1[field] = get(_this.store, field);
                });
                _this.triggerValuesChange(changeValues_1);
                _this.notify('reset', { prev: prev, field: fields });
                _this._popTouchField(fields);
            }
            else {
                var newValues_1 = {};
                var changeValues_2 = cloneDeep(_this.store);
                Object.keys(_this.initialValues).forEach(function (field) {
                    set(newValues_1, field, _this.initialValues[field]);
                });
                _this.store = newValues_1;
                _this.getRegisteredFields(true).forEach(function (item) {
                    var key = item.props.field;
                    set(changeValues_2, key, get(_this.store, key));
                });
                _this.triggerValuesChange(changeValues_2);
                _this._popTouchField();
                _this.notify('reset', { prev: prev, field: Object.keys(changeValues_2) });
            }
        };
        this.validate = promisify(function (fieldsOrCallback, cb) {
            var callback = function () { };
            var controlItems = _this.getRegisteredFields(true);
            if (isArray(fieldsOrCallback) && fieldsOrCallback.length > 0) {
                controlItems = controlItems.filter(function (x) { return fieldsOrCallback.indexOf(x.props.field) > -1; });
                callback = cb || callback;
            }
            else if (typeof fieldsOrCallback === 'function') {
                callback = fieldsOrCallback;
            }
            var promises = controlItems.map(function (x) { return x.validateField(); });
            Promise.all(promises).then(function (result) {
                var errors = {};
                var values = {};
                result.map(function (x) {
                    if (x.error) {
                        errors = __assign(__assign({}, errors), x.error);
                    }
                    set(values, x.field, x.value);
                });
                if (Object.keys(errors).length) {
                    var onValidateFail = _this.callbacks.onValidateFail;
                    onValidateFail && onValidateFail(errors);
                    callback && callback(errors, cloneDeep(values));
                }
                else {
                    callback && callback(null, cloneDeep(values));
                }
            });
        });
        this.submit = function () {
            _this.validate(function (errors, values) {
                if (!errors) {
                    var onSubmit = _this.callbacks.onSubmit;
                    onSubmit && onSubmit(values);
                }
                else {
                    var onSubmitFailed = _this.callbacks.onSubmitFailed;
                    onSubmitFailed && onSubmitFailed(errors);
                }
            });
        };
        this.clearFields = function (fieldKeys) {
            var prev = cloneDeep(_this.store);
            var fields = isString(fieldKeys) ? [fieldKeys] : fieldKeys;
            if (fields && isArray(fields)) {
                var changeValues_3 = {};
                fields.forEach(function (field) {
                    set(_this.store, field, undefined);
                    changeValues_3[field] = get(_this.store, field);
                });
                _this.triggerValuesChange(changeValues_3);
                _this.notify('setFieldValue', { prev: prev, field: fields });
                _this._popTouchField(fields);
            }
            else {
                var changeValues_4 = {};
                _this.store = {};
                _this.getRegisteredFields(true).forEach(function (item) {
                    var key = item.props.field;
                    set(changeValues_4, key, undefined);
                });
                _this.triggerValuesChange(changeValues_4);
                _this._popTouchField();
                _this.notify('setFieldValue', { prev: prev, field: Object.keys(changeValues_4) });
            }
        };
    }
    Store.prototype.notifyWatchers = function () {
        this.registerWatchers.forEach(function (item) {
            item();
        });
    };
    Store.prototype.triggerValuesChange = function (value) {
        if (value && Object.keys(value).length) {
            var onValuesChange = this.callbacks.onValuesChange;
            onValuesChange && onValuesChange(value, this.getFields());
        }
        this.notifyWatchers();
    };
    Store.prototype.triggerTouchChange = function (value) {
        if (value && Object.keys(value).length) {
            var onChange = this.callbacks.onChange;
            onChange && onChange(value, this.getFields());
        }
    };
    Store.prototype._getIterativelyKeysByField = function (field) {
        if (!field) {
            return [];
        }
        var fields = [].concat(field);
        var keys = fields
            .map(function (item) { return iterativelyGetKeys(set({}, item, undefined)); })
            .reduce(function (total, next) {
            return total.concat(next);
        }, []);
        return __spreadArray([field], __read(keys), false);
    };
    Store.prototype._inTouchFields = function (field) {
        var _this = this;
        var keys = this._getIterativelyKeysByField(field);
        // return fields.some((item) => has(fieldObj, item));
        return keys.some(function (item) { return has(_this.touchedFields, item); });
    };
    Store.prototype._popTouchField = function (field) {
        if (field === undefined) {
            this.touchedFields = {};
        }
        var keys = this._getIterativelyKeysByField(field);
        this.touchedFields = omit(this.touchedFields, keys);
    };
    Store.prototype._pushTouchField = function (field) {
        var _this = this;
        [].concat(field).forEach(function (key) {
            setWith(_this.touchedFields, key, undefined, Object);
        });
    };
    return Store;
}());
export default Store;
