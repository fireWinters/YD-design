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
import { isArray } from '../_util/is';
export function getScrollBarHeight(ele) {
    return ele ? ele.offsetHeight - ele.clientHeight : 0;
}
export function getScrollBarWidth(ele) {
    return ele ? ele.offsetWidth - ele.clientWidth : 0;
}
export function isChildrenNotEmpty(record, field) {
    return isArray(record[field]) && record[field].length;
}
export function getSelectedKeys(record, checked, checkedRowKeys, _indeterminateKeys, getRowKey, childrenColumnName, checkConnected) {
    if (checkedRowKeys === void 0) { checkedRowKeys = []; }
    if (_indeterminateKeys === void 0) { _indeterminateKeys = []; }
    var selectedRowKeys = new Set(checkedRowKeys);
    var indeterminateKeys = new Set(_indeterminateKeys);
    function loop(record) {
        if (checked) {
            selectedRowKeys.add(getRowKey(record));
            indeterminateKeys.delete(getRowKey(record));
        }
        else {
            selectedRowKeys.delete(getRowKey(record));
        }
        if (isArray(record[childrenColumnName])) {
            record[childrenColumnName].forEach(function (child) {
                loop(child);
            });
        }
    }
    if (!checkConnected) {
        if (checked) {
            selectedRowKeys.add(getRowKey(record));
        }
        else {
            selectedRowKeys.delete(getRowKey(record));
        }
    }
    else {
        loop(record);
        updateParent(record, selectedRowKeys, indeterminateKeys, getRowKey, childrenColumnName);
    }
    return {
        selectedRowKeys: __spreadArray([], __read(selectedRowKeys), false),
        indeterminateKeys: __spreadArray([], __read(indeterminateKeys), false),
    };
}
export function getSelectedKeysByData(flattenData, checkedKeys, getRowKey, childrenColumnName, checkConnected) {
    if (checkedKeys === void 0) { checkedKeys = []; }
    if (!checkConnected) {
        return {
            selectedRowKeys: checkedKeys,
            indeterminateKeys: [],
        };
    }
    var selectedRowKeys = new Set(checkedKeys);
    var indeterminateKeys = new Set([]);
    function loop(record) {
        selectedRowKeys.add(getRowKey(record));
        indeterminateKeys.delete(getRowKey(record));
        if (isArray(record[childrenColumnName])) {
            record[childrenColumnName].forEach(function (child) {
                loop(child);
            });
        }
    }
    checkedKeys.forEach(function (key) {
        var record = flattenData.find(function (d) { return getRowKey(d) === key; });
        loop(record);
        updateParent(record, selectedRowKeys, indeterminateKeys, getRowKey, childrenColumnName);
    });
    return {
        selectedRowKeys: __spreadArray([], __read(selectedRowKeys), false),
        indeterminateKeys: __spreadArray([], __read(indeterminateKeys), false),
    };
}
function updateParent(record, selectedKeys, indeterminateKeys, getRowKey, childrenColumnName) {
    if (record.parent) {
        var parentKey_1 = getRowKey(record.parent);
        if (isArray(record.parent[childrenColumnName])) {
            var total = record.parent[childrenColumnName].length;
            var len_1 = 0;
            var flag_1 = false;
            record.parent[childrenColumnName].forEach(function (c) {
                if (selectedKeys.has(getRowKey(c))) {
                    len_1 += 1;
                }
                if (indeterminateKeys.has(getRowKey(c))) {
                    indeterminateKeys.add(parentKey_1);
                    flag_1 = true;
                }
            });
            if (total === len_1) {
                selectedKeys.add(parentKey_1);
                indeterminateKeys.delete(parentKey_1);
            }
            else if (len_1 > 0 && total > len_1) {
                selectedKeys.delete(parentKey_1);
                indeterminateKeys.add(parentKey_1);
            }
            else if (len_1 === 0) {
                selectedKeys.delete(parentKey_1);
                if (!flag_1) {
                    indeterminateKeys.delete(parentKey_1);
                }
            }
        }
        updateParent(record.parent, selectedKeys, indeterminateKeys, getRowKey, childrenColumnName);
    }
}
