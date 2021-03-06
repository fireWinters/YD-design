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
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import BaseNotification from '../_class/notification';
import Notice from '../_class/notice';
import cs from '../_util/classNames';
import { isNumber } from '../_util/is';
var notificationTypes = ['info', 'success', 'error', 'warning', 'normal'];
var notificationInstance = {};
// global config
var maxCount;
var prefixCls;
var duration;
var container;
var Notification = /** @class */ (function (_super) {
    __extends(Notification, _super);
    function Notification() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.remove = function (id) {
            var noticeItem = _this.state.notices.find(function (item) { return item.id === id; });
            if (noticeItem) {
                _this.update(__assign(__assign({}, noticeItem), { style: __assign(__assign({}, noticeItem.style), { opacity: 0 }) }));
            }
            // 200 ?????????????????????????????????
            setTimeout(function () {
                _super.prototype.remove.call(_this, id);
            }, 200);
        };
        return _this;
    }
    Notification.prototype.render = function () {
        var _this = this;
        var _a = this.state, notices = _a.notices, _b = _a.position, position = _b === void 0 ? 'topRight' : _b;
        var prefixClsNotification = prefixCls ? prefixCls + "-notification" : 'arco-notification';
        var transitionClass;
        if (position === 'topLeft' || position === 'bottomLeft') {
            transitionClass = 'slideNoticeLeft';
        }
        else {
            transitionClass = 'slideNoticeRight';
        }
        var classNames = cs(prefixClsNotification + "-wrapper", prefixClsNotification + "-wrapper-" + position);
        return (React.createElement("div", { className: classNames },
            React.createElement(TransitionGroup, { component: null }, notices.map(function (notice) { return (React.createElement(CSSTransition, { key: notice.id, timeout: {
                    enter: 400,
                    exit: 300,
                }, classNames: transitionClass, onExit: function (e) {
                    e.style.height = e.scrollHeight + "px";
                }, onExiting: function (e) {
                    e.style.height = 0;
                }, onExited: function (e) {
                    e.style.height = 0;
                    notice.onClose && notice.onClose();
                } },
                React.createElement(Notice, __assign({}, notice, { onClose: _this.remove, prefixCls: prefixClsNotification, iconPrefix: prefixCls, noticeType: "notification" })))); }))));
    };
    Notification.config = function (options) {
        if (options === void 0) { options = {}; }
        if (options.maxCount) {
            maxCount = options.maxCount;
        }
        if (options.prefixCls) {
            prefixCls = options.prefixCls;
        }
        if (isNumber(options.duration)) {
            duration = options.duration;
        }
        if (options.getContainer && options.getContainer() !== container) {
            container = options.getContainer();
            Object.keys(notificationInstance).forEach(function (notice) { return notificationInstance[notice].clear(); });
            notificationInstance = {};
        }
    };
    Notification.clear = function () {
        Object.keys(notificationInstance).forEach(function (ins) {
            notificationInstance[ins].clear();
        });
    };
    Notification.remove = function (id) {
        Object.keys(notificationInstance).forEach(function (ins) {
            notificationInstance[ins].remove(id);
        });
    };
    Notification.addInstance = function (noticeProps) {
        var _a = noticeProps.position, position = _a === void 0 ? 'topRight' : _a;
        var _noticeProps = __assign({ duration: duration }, noticeProps);
        if (notificationInstance[position]) {
            var notices = notificationInstance[position].state.notices;
            if (notices.length >= maxCount) {
                var updated = notices[0];
                notices.shift();
                notificationInstance[position].add(__assign(__assign({}, _noticeProps), { id: updated.id }));
            }
            else {
                notificationInstance[position].add(_noticeProps);
            }
            return notificationInstance[position];
        }
        var div = document.createElement('div');
        var instance = null;
        (container || document.body).appendChild(div);
        ReactDOM.render(React.createElement(Notification, { ref: function (ref) {
                notificationInstance[position] = ref;
                notificationInstance[position].add(_noticeProps);
                instance = notificationInstance[position];
                return instance;
            } }), div);
    };
    return Notification;
}(BaseNotification));
notificationTypes.forEach(function (type) {
    Notification[type] = function (noticeProps) {
        return Notification.addInstance(__assign(__assign({}, noticeProps), { type: type }));
    };
});
export default Notification;
