import { isArray } from '../_util/is';
export var isAcceptFile = function (file, accept) {
    if (accept && file) {
        var accepts = isArray(accept)
            ? accept
            : accept
                .split(',')
                .map(function (x) { return x.trim(); })
                .filter(function (x) { return x; });
        var fileExtension_1 = file.name.indexOf('.') > -1 ? file.name.split('.').pop() : '';
        return accepts.some(function (type) {
            var text = type && type.toLowerCase();
            var fileType = (file.type || '').toLowerCase();
            if (text === fileType) {
                // 类似excel文件这种
                // 比如application/vnd.ms-excel和application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
                // 本身就带有.字符的，不能走下面的.jpg等文件扩展名判断处理
                // 所以优先对比input的accept类型和文件对象的type值
                return true;
            }
            if (/\/\*/.test(text)) {
                // image/* 这种通配的形式处理
                return fileType.replace(/\/.*$/, '') === text.replace(/\/.*$/, '');
            }
            if (/\..*/.test(text)) {
                // .jpg 等后缀名
                return text === "." + (fileExtension_1 && fileExtension_1.toLowerCase());
            }
            return false;
        });
    }
    return !!file;
};
export var getFiles = function (fileList, accept) {
    if (!fileList) {
        return;
    }
    var files = [].slice.call(fileList);
    if (accept) {
        files = files.filter(function (file) {
            return isAcceptFile(file, accept);
        });
    }
    return files;
};
export var loopDirectory = function (items, accept, callback) {
    var files = [];
    var restFileCount = 0; // 剩余上传文件的数量
    var onFinish = function () {
        !restFileCount && callback(files);
    };
    var _loopDirectory = function (item) {
        restFileCount += 1;
        if (item.isFile) {
            item.file(function (file) {
                restFileCount -= 1;
                if (isAcceptFile(file, accept)) {
                    Object.defineProperty(file, 'webkitRelativePath', {
                        value: item.fullPath.replace(/^\//, ''),
                    });
                    files.push(file);
                }
                onFinish();
            });
            return;
        }
        if (item.isDirectory) {
            // item 是个文件夹
            var reader_1 = item.createReader();
            var flag_1 = false;
            var readEntries_1 = function () {
                reader_1.readEntries(function (entries) {
                    if (!flag_1) {
                        restFileCount -= 1;
                        flag_1 = true;
                    }
                    if (entries.length === 0) {
                        onFinish();
                    }
                    else {
                        readEntries_1(); // the maximum files read using readEntries is 100
                        entries.forEach(_loopDirectory);
                    }
                });
            };
            readEntries_1();
            return;
        }
        restFileCount -= 1;
        onFinish();
    };
    var list = [].slice.call(items);
    list.forEach(function (item) {
        if (item.webkitGetAsEntry) {
            _loopDirectory(item.webkitGetAsEntry());
        }
    });
};
