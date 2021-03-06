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
import { plus, times } from 'number-precision';
import { isArray, isNumber, isUndefined, isObject, isEmptyObject } from '../../_util/is';
import { getPrecision } from '../utils';
export default function useLegalValue(props) {
    var isRange = props.isRange, min = props.min, max = props.max, onlyMarkValue = props.onlyMarkValue, intervalConfigs = props.intervalConfigs, marks = props.marks;
    function getPrecisionValue(val) {
        var _a = intervalConfigs.find(function (config) {
            return val >= config.begin && val <= config.end;
        }), begin = _a.begin, step = _a.step;
        var offsetVal = val - begin;
        var stepNum = Math.round(offsetVal / step);
        var precision = getPrecision(step);
        var currentIntervalPrecision = parseFloat(times(step, stepNum).toFixed(precision));
        return plus(begin, currentIntervalPrecision);
    }
    // 在只允许选择 marks 中的值的时候，找到离value最接近的值
    function getMarkValue(val) {
        if (!isObject(marks) || isEmptyObject(marks)) {
            console.warn('marks must be an object when onlyMarkValue is true');
            return min;
        }
        if (marks[val]) {
            return val;
        }
        var keys = Object.keys(marks);
        var diffs = keys.map(function (x) { return Math.abs(val - parseFloat(x)); });
        var minIndex = diffs.indexOf(Math.min.apply(null, diffs));
        return parseFloat(keys[minIndex]);
    }
    // 判断值是否在[min, max]区间内，并且满足步长或是标签值
    function getLegalValue(val) {
        if (isUndefined(val))
            return min;
        if (val <= min)
            return min;
        if (val >= max)
            return max;
        if (onlyMarkValue)
            return getMarkValue(val);
        return getPrecisionValue(val);
    }
    function isLegalValue(val) {
        return getLegalValue(val) === val;
    }
    // 获取合法的 range value
    function getLegalRangeValue(val) {
        var _a = __read([min, min], 2), beginVal = _a[0], endVal = _a[1];
        if (isRange) {
            if (isArray(val)) {
                beginVal = getLegalValue(val[0]);
                endVal = getLegalValue(val[1]);
            }
            else {
                console.error('value must be an array when range is true');
            }
        }
        else if (isNumber(val)) {
            endVal = getLegalValue(val);
        }
        else {
            console.error('value must be a number when range is false');
        }
        return [beginVal, endVal];
    }
    return {
        getLegalRangeValue: getLegalRangeValue,
        getLegalValue: getLegalValue,
        isLegalValue: isLegalValue,
    };
}
