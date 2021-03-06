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
var messageTypes = ['info', 'success', 'error', 'warning', 'loading', 'normal'];
var messageInstance = {};
var maxCount;
var prefixCls;
var duration;
var container;
function addInstance(noticeProps) {
    var _noticeProps = __assign({ position: 'top', duration: duration }, noticeProps);
    var position = _noticeProps.position, transitionClassNames = _noticeProps.transitionClassNames;
    var id;
    if (messageInstance[position]) {
        var notices = messageInstance[position].state.notices;
        if (notices.length >= maxCount) {
            var updated = notices[0];
            id = updated.id;
            notices.shift();
            messageInstance[position].add(__assign(__assign({}, _noticeProps), { id: id }));
        }
        else {
            id = messageInstance[position].add(_noticeProps);
        }
    }
    else {
        var div = document.createElement('div');
        (container || document.body).appendChild(div);
        ReactDOM.render(React.createElement(Message, { transitionClassNames: transitionClassNames, ref: function (instance) {
                messageInstance[position] = instance;
                id = messageInstance[position].add(_noticeProps);
            } }), div);
    }
    var result = function () {
        if (messageInstance[position]) {
            messageInstance[position].remove(id);
        }
    };
    return result;
}
var Message = /** @class */ (function (_super) {
    __extends(Message, _super);
    function Message() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.remove = function (id) {
            var noticeItem = _this.state.notices.find(function (item) { return item.id === id; });
            if (noticeItem) {
                _this.update(__assign(__assign({}, noticeItem), { style: __assign(__assign({}, noticeItem.style), { opacity: 0 }) }));
            }
            // 100 ?????????????????????????????????
            setTimeout(function () {
                _super.prototype.remove.call(_this, id);
            }, 100);
        };
        return _this;
    }
    Message.prototype.render = function () {
        var _this = this;
        var transitionClassNames = this.props.transitionClassNames;
        var _a = this.state, notices = _a.notices, position = _a.position;
        var prefixClsMessage = prefixCls ? prefixCls + "-message" : 'arco-message';
        var classNames = cs(prefixClsMessage + "-wrapper", prefixClsMessage + "-wrapper-" + position);
        return (React.createElement("div", { className: classNames },
            React.createElement(TransitionGroup, { component: null }, notices.map(function (notice) { return (React.createElement(CSSTransition, { key: notice.id, timeout: {
                    enter: 100,
                    exit: 300,
                }, classNames: transitionClassNames || "fadeMessage", onExit: function (e) {
                    e.style.height = e.scrollHeight + "px";
                }, onExiting: function (e) {
                    e.style.height = 0;
                }, onExited: function (e) {
                    e.style.height = 0;
                    notice.onClose && notice.onClose();
                } },
                React.createElement(Notice, __assign({}, notice, { prefixCls: prefixClsMessage, iconPrefix: prefixCls, onClose: _this.remove, noticeType: "message" })))); }))));
    };
    Message.config = function (options) {
        if (options === void 0) { options = {}; }
        if (options.maxCount) {
            maxCount = options.maxCount;
        }
        if (options.prefixCls) {
            prefixCls = options.prefixCls;
        }
        if (options.duration) {
            duration = options.duration;
        }
        if (options.getContainer && options.getContainer() !== container) {
            container = options.getContainer();
            Object.keys(messageInstance).forEach(function (notice) { return messageInstance[notice].clear(); });
            messageInstance = {};
        }
    };
    Message.clear = function () {
        Object.keys(messageInstance).forEach(function (ins) {
            messageInstance[ins].clear();
        });
    };
    Message.addInstance = addInstance;
    return Message;
}(BaseNotification));
messageTypes.forEach(function (type) {
    Message[type] = function (noticeProps) {
        var props = typeof noticeProps === 'string' ? { content: noticeProps } : noticeProps;
        return addInstance(__assign(__assign({}, props), { type: type }));
    };
});
export default Message;
