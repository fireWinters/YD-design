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
import React, { useRef } from 'react';
import isEqualWith from 'lodash/isEqualWith';
import get from 'lodash/get';
import FormItem from './form-item';
import { isFunction, isUndefined } from '../_util/is';
import { isSyntheticEvent } from './utils';
import warning from '../_util/warning';
var isIndexLegal = function (index, value) {
    return !isUndefined(index) && index >= 0 && index < value.length;
};
var List = function (props) {
    var field = props.field, children = props.children, initialValue = props.initialValue;
    var keysRef = useRef({
        id: 0,
        keys: [],
    });
    var extra = 'initialValue' in props ? { initialValue: initialValue } : {};
    var currentKeys = keysRef.current.keys;
    return (React.createElement(FormItem, __assign({ field: field }, extra, { isFormList: true, noStyle: true, shouldUpdate: function (prev, current, info) {
            if (info && info.isInner && !info.isFormList && info.field !== field) {
                // ??????????????????????????????value??????????????????????????????????????????formList???
                // info.field !== field ??????????????????????????????????????????formList?????????field?????????????????? ??????rerender????????????formList??????formList
                return false;
            }
            return !isEqualWith(get(prev, field), get(current, field));
        } }), function (_, methods) {
        var getFieldValue = methods.getFieldValue, getInnerMethods = methods.getInnerMethods;
        var innerSetFieldValue = getInnerMethods(true).innerSetFieldValue;
        var values = getFieldValue(field) || [];
        var add = function (defaultValue, index) {
            if (isSyntheticEvent(defaultValue)) {
                warning(true, 'Form.List: The event object cannot be used as a parameter of the add method');
                return;
            }
            var key = keysRef.current.id;
            keysRef.current.id += 1;
            var oldValue = getFieldValue(field) || [];
            var newValue = oldValue;
            if (index !== undefined && index >= 0 && index <= oldValue.length) {
                currentKeys.splice(index, 0, key);
                newValue = __spreadArray(__spreadArray(__spreadArray([], __read(oldValue.slice(0, index)), false), [defaultValue], false), __read(oldValue.slice(index)), false);
            }
            else {
                currentKeys.push(key);
                newValue = __spreadArray(__spreadArray([], __read(oldValue), false), [defaultValue], false);
            }
            // defaultValue = undefined ???????????????????????????????????????
            innerSetFieldValue(field, newValue, {
                isFormList: true,
                ignore: defaultValue === undefined,
            });
        };
        var remove = function (index) {
            var value = getFieldValue(field) || [];
            var newValue = value.filter(function (_, i) { return i !== index; });
            currentKeys.splice(index, 1);
            innerSetFieldValue(field, __spreadArray([], __read(newValue), false), { isFormList: true });
        };
        var move = function (fromIndex, toIndex) {
            var value = getFieldValue(field) || [];
            if (fromIndex === toIndex ||
                !isIndexLegal(fromIndex, value) ||
                !isIndexLegal(toIndex, value)) {
                return;
            }
            var fromId = currentKeys[fromIndex];
            currentKeys.splice(fromIndex, 1);
            currentKeys.splice(toIndex, 0, fromId);
            var fromItem = value[fromIndex];
            var newValue = __spreadArray([], __read(value), false);
            newValue.splice(fromIndex, 1);
            newValue.splice(toIndex, 0, fromItem);
            innerSetFieldValue(field, newValue, { isFormList: true });
        };
        return (isFunction(children) &&
            children(values.map(function (_, index) {
                var key = currentKeys[index];
                if (key === undefined) {
                    key = keysRef.current.id;
                    currentKeys.push(key);
                    keysRef.current.id += 1;
                }
                return {
                    field: field + "[" + index + "]",
                    key: key,
                };
            }), {
                add: add,
                remove: remove,
                move: move,
            }));
    }));
};
List.displayName = 'FormList';
export default List;
