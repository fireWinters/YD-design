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
import { useState, useContext, useEffect, useRef } from 'react';
import get from 'lodash/get';
import { FormContext } from '../context';
import warn from '../../_util/warning';
var useWatch = function (field, form) {
    var formCtx = useContext(FormContext);
    var formInstance = form || formCtx.store;
    var _a = __read(useState(formInstance === null || formInstance === void 0 ? void 0 : formInstance.getFieldValue(field)), 2), value = _a[0], setValue = _a[1];
    var valueRef = useRef(JSON.stringify(value));
    useEffect(function () {
        if (!formInstance) {
            warn(true, 'formInstance is not available');
            return;
        }
        var registerWatcher = (formInstance === null || formInstance === void 0 ? void 0 : formInstance.getInnerMethods(true)).registerWatcher;
        var updateValue = function () {
            var newValue = get(formInstance.getFieldsValue(), field);
            var newValueString = JSON.stringify(newValue);
            if (valueRef.current !== newValueString) {
                setValue(newValue);
                valueRef.current = newValueString;
            }
        };
        updateValue();
        var cancelWatch = registerWatcher && registerWatcher(updateValue);
        return function () {
            cancelWatch && cancelWatch();
        };
    }, []);
    return value;
};
export default useWatch;
