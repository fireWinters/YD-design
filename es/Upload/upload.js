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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
import React, { forwardRef, useContext, useRef, useState, useImperativeHandle, } from 'react';
import cs from '../_util/classNames';
import UploadList from './list/index';
import Uploader from './uploader';
import { isFunction, isArray, isNumber } from '../_util/is';
import { STATUS } from './interface';
import { ConfigContext } from '../ConfigProvider';
import omit from '../_util/omit';
import useMergeProps from '../_util/hooks/useMergeProps';
var processFile = function (fileList) {
    var res = {};
    if (!isArray(fileList)) {
        return res;
    }
    fileList.forEach(function (file, index) {
        if (file.uid) {
            res[file.uid] = __assign({ status: STATUS.success, percent: 100 }, file);
        }
        else {
            var uid = "" + String(+new Date()) + index;
            res[uid] = __assign(__assign({}, file), { uid: uid, status: STATUS.success, percent: 100 });
        }
    });
    return res;
};
var getFileList = function (uploadState) {
    return Object.keys(uploadState).map(function (x) { return uploadState[x]; });
};
var defaultProps = {
    listType: 'text',
    autoUpload: true,
    showUploadList: true,
    beforeUpload: function () { return true; },
};
var Upload = function (baseProps, ref) {
    var _a;
    var _b = useContext(ConfigContext), getPrefixCls = _b.getPrefixCls, componentConfig = _b.componentConfig;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Upload);
    var prefixCls = getPrefixCls('upload');
    var uploaderRef = useRef();
    var uploadState = useRef({});
    var _c = __read(useState('fileList' in props
        ? processFile(props.fileList)
        : 'defaultFileList' in props
            ? processFile(props.defaultFileList)
            : {}), 2), innerUploadState = _c[0], setInnerUploadState = _c[1];
    uploadState.current = 'fileList' in props ? processFile(props.fileList) : innerUploadState;
    var deleteUpload = function (file) {
        var obj = __assign({}, uploadState.current);
        delete obj[file.uid];
        if (!('fileList' in props)) {
            setInnerUploadState(obj);
        }
        props.onChange && props.onChange(getFileList(obj), file);
    };
    var uploadFile = function (file) {
        file &&
            setTimeout(function () {
                uploaderRef.current && uploaderRef.current.upload(file);
            }, 0);
    };
    // ????????????
    var reuploadFile = function (file) {
        uploaderRef.current && uploaderRef.current.reupload(file);
        props.onReupload && props.onReupload(file);
    };
    // ????????????????????????????????????????????????
    var removeFile = function (file) {
        if (file) {
            var onRemove = props.onRemove;
            Promise.resolve(isFunction(onRemove) ? onRemove(file) : onRemove)
                .then(function (val) {
                if (val !== false) {
                    uploaderRef.current && uploaderRef.current.abort(file);
                    deleteUpload(file);
                }
            })
                .catch(function (e) {
                console.error(e);
            });
        }
    };
    // ??????????????????
    var abortFile = function (file) {
        if (file) {
            uploaderRef.current && uploaderRef.current.abort(file);
        }
    };
    useImperativeHandle(ref, function () {
        return {
            submit: function (file) {
                var list = [];
                if (file) {
                    list = [file];
                }
                else {
                    list = getFileList(uploadState.current).filter(function (x) { return x.status === STATUS.init; });
                }
                list.forEach(function (x) {
                    uploadFile(x);
                });
            },
            // file: fileList??????file??????
            abort: function (file) {
                abortFile(file);
            },
            // file: fileList??????file??????
            reupload: function (file) {
                reuploadFile(file);
            },
        };
    });
    var listType = props.listType, className = props.className, style = props.style, renderUploadItem = props.renderUploadItem, showUploadList = props.showUploadList, renderUploadList = props.renderUploadList, progressProps = props.progressProps, rest = __rest(props, ["listType", "className", "style", "renderUploadItem", "showUploadList", "renderUploadList", "progressProps"]);
    var fileList = getFileList(uploadState.current);
    var limit = isNumber(props.limit)
        ? { hideOnExceedLimit: true, maxCount: props.limit }
        : __assign({ hideOnExceedLimit: true }, props.limit);
    var exceedLimit = limit.maxCount && limit.maxCount <= fileList.length;
    var disabledUploadDom = 'disabled' in props ? props.disabled : !limit.hideOnExceedLimit && exceedLimit;
    var uploadDom = (React.createElement("div", __assign({}, omit(rest, [
        'disabled',
        'directory',
        'onReupload',
        'defaultFileList',
        'fileList',
        'autoUpload',
        'error',
        'action',
        'multiple',
        'name',
        'accept',
        'customRequest',
        'children',
        'autoUpload',
        'limit',
        'drag',
        'tip',
        'headers',
        'data',
        'withCredentials',
        'onChange',
        'onPreview',
        'onRemove',
        'onProgress',
        'onExceedLimit',
        'beforeUpload',
    ]), { className: cs(prefixCls, (_a = {},
            _a[prefixCls + "-type-" + listType] = listType,
            _a[prefixCls + "-drag"] = props.drag,
            _a[prefixCls + "-disabled"] = disabledUploadDom,
            _a[prefixCls + "-hide"] = limit.hideOnExceedLimit && exceedLimit,
            _a), className), style: style }),
        React.createElement(Uploader, __assign({ ref: uploaderRef }, props, { limit: limit.maxCount, hide: limit.hideOnExceedLimit && exceedLimit, disabled: disabledUploadDom, prefixCls: prefixCls, fileList: fileList, onProgress: function (file, e) {
                if (file) {
                    if (!('fileList' in props)) {
                        setInnerUploadState(function (v) {
                            var _a;
                            return __assign(__assign({}, v), (_a = {}, _a[file.uid] = file, _a));
                        });
                    }
                    props.onProgress && props.onProgress(file, e);
                }
            }, onFileStatusChange: function (file) {
                var _a;
                if (!('fileList' in props)) {
                    setInnerUploadState(function (v) {
                        var _a;
                        return __assign(__assign({}, v), (_a = {}, _a[file.uid] = file, _a));
                    });
                }
                props.onChange &&
                    props.onChange(getFileList(__assign(__assign({}, uploadState.current), (_a = {}, _a[file.uid] = file, _a))), file);
            } }))));
    return (React.createElement(React.Fragment, null,
        listType !== 'picture-card' && uploadDom,
        showUploadList && (React.createElement(UploadList, { progressProps: progressProps, showUploadList: showUploadList, disabled: props.disabled, listType: listType, fileList: fileList, renderUploadItem: renderUploadItem, renderUploadList: renderUploadList, onUpload: uploadFile, onAbort: abortFile, onRemove: removeFile, onReupload: reuploadFile, onPreview: props.onPreview, prefixCls: prefixCls })),
        listType === 'picture-card' && uploadDom,
        props.tip && listType === 'picture-card' && (React.createElement("div", { className: prefixCls + "-trigger-tip" }, props.tip))));
};
var UploadRef = forwardRef(Upload);
UploadRef.displayName = 'Upload';
export default UploadRef;
