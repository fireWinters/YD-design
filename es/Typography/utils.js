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
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import mergedToString from '../_util/mergedToString';
function styleToString(style, extraStyle) {
    var styleNames = Array.prototype.slice.apply(style);
    var styleString = styleNames
        .map(function (name) { return name + ": " + style.getPropertyValue(name) + ";"; })
        .join('');
    var extraStyleString = Object.entries(extraStyle)
        .map(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        return key + ": " + value + ";";
    })
        .join('');
    return styleString + extraStyleString;
}
function pxToNumber(value) {
    if (!value)
        return 0;
    var match = value.match(/^\d*(\.\d*)?/);
    return match ? Number(match[0]) : 0;
}
var mirrorElement;
export function measure(originElement, ellipsisConfig, operations, children, simple) {
    var rows = ellipsisConfig.rows || 1;
    var ellipsisStr = ellipsisConfig.ellipsisStr !== undefined ? ellipsisConfig.ellipsisStr : '...';
    var suffix = ellipsisConfig.suffix !== undefined ? ellipsisConfig.suffix : '';
    if (mirrorElement && originElement.tagName !== mirrorElement.tagName) {
        document.body.removeChild(mirrorElement);
        mirrorElement = undefined;
    }
    if (!mirrorElement) {
        mirrorElement = document.createElement(originElement.tagName);
        document.body.appendChild(mirrorElement);
    }
    var originStyle = window.getComputedStyle(originElement);
    var originWhiteSpace = originStyle.whiteSpace || 'normal';
    var extraStyle = {
        height: 'auto',
        'min-height': 'auto',
        'max-height': 'auto',
        left: '0',
        top: '-99999999px',
        // top:'100px',
        position: 'fixed',
        'z-index': '-200',
        'text-overflow': 'clip',
        // The folding threshold cannot be calculated in the nowrap scene
        'white-space': originWhiteSpace === 'nowrap' ? 'normal' : originWhiteSpace,
        overflow: 'auto',
    };
    // 行内元素影响折叠计算，需要手动指定宽度；
    if (originStyle.display === 'inline') {
        var rect = originElement.getBoundingClientRect();
        extraStyle.width = rect.width + "px";
        extraStyle.display = 'block';
        extraStyle['box-sizing'] = 'border-box';
    }
    var styleString = styleToString(originStyle, extraStyle);
    mirrorElement.setAttribute('style', styleString);
    mirrorElement.setAttribute('aria-hidden', 'true');
    render(React.createElement("span", null, operations), mirrorElement);
    var operationsChildNodes = Array.prototype.slice.apply(mirrorElement.childNodes[0].cloneNode(true).childNodes);
    var fullText = mergedToString(React.Children.toArray(children));
    unmountComponentAtNode(mirrorElement);
    mirrorElement.innerHTML = '';
    var ellipsisTextNode = document.createTextNode("" + ellipsisStr + suffix);
    mirrorElement.appendChild(ellipsisTextNode);
    operationsChildNodes.forEach(function (childNode) {
        mirrorElement.appendChild(childNode);
    });
    var textNode = document.createTextNode(fullText);
    mirrorElement.insertBefore(textNode, mirrorElement.firstChild);
    var lineHeight = pxToNumber(originStyle.lineHeight);
    var maxHeight = Math.round(lineHeight * rows + pxToNumber(originStyle.paddingTop) + pxToNumber(originStyle.paddingBottom));
    function emptyMirrorElem() {
        mirrorElement.setAttribute('style', 'display: none');
        mirrorElement.innerHTML = '';
    }
    function inRange() {
        return mirrorElement.scrollHeight <= maxHeight;
    }
    if (inRange()) {
        unmountComponentAtNode(mirrorElement);
        emptyMirrorElem();
        return { text: fullText, ellipsis: false };
    }
    if (simple) {
        emptyMirrorElem();
        return { ellipsis: true, text: fullText };
    }
    function measureText(textNode, startLoc, endLoc, lastSuccessLoc) {
        if (startLoc === void 0) { startLoc = 0; }
        if (endLoc === void 0) { endLoc = fullText.length; }
        if (lastSuccessLoc === void 0) { lastSuccessLoc = 0; }
        var midLoc = Math.floor((startLoc + endLoc) / 2);
        var currentText = fullText.slice(0, midLoc);
        textNode.textContent = currentText;
        if (startLoc >= endLoc - 1) {
            for (var step = endLoc; step >= startLoc; step -= 1) {
                var currentStepText = fullText.slice(0, step);
                textNode.textContent = currentStepText;
                if (inRange() || !currentStepText) {
                    return;
                }
            }
        }
        if (inRange()) {
            return measureText(textNode, midLoc, endLoc, midLoc);
        }
        return measureText(textNode, startLoc, midLoc, lastSuccessLoc);
    }
    measureText(textNode);
    var ellipsisText = textNode.textContent;
    emptyMirrorElem();
    return {
        text: ellipsisText,
        ellipsis: true,
    };
}
