import React from 'react';
import { isArray, isObject } from '../_util/is';
import { ID_SUFFIX } from './utils';
// 标签
var FormItemLabel = function (_a) {
    var htmlFor = _a.htmlFor, showColon = _a.showColon, label = _a.label, requiredSymbol = _a.requiredSymbol, required = _a.required, rules = _a.rules, prefix = _a.prefix;
    var isRequiredRule = isArray(rules) && rules.some(function (rule) { return rule && rule.required; });
    var symbolPosition = isObject(requiredSymbol) ? requiredSymbol.position : 'start';
    var symbolNode = (required || isRequiredRule) && !!requiredSymbol && (React.createElement("strong", { className: prefix + "-form-item-symbol" },
        React.createElement("svg", { fill: "currentColor", viewBox: "0 0 1024 1024", width: "1em", height: "1em" },
            React.createElement("path", { d: "M583.338667 17.066667c18.773333 0 34.133333 15.36 34.133333 34.133333v349.013333l313.344-101.888a34.133333 34.133333 0 0 1 43.008 22.016l42.154667 129.706667a34.133333 34.133333 0 0 1-21.845334 43.178667l-315.733333 102.4 208.896 287.744a34.133333 34.133333 0 0 1-7.509333 47.786666l-110.421334 80.213334a34.133333 34.133333 0 0 1-47.786666-7.509334L505.685333 706.218667 288.426667 1005.226667a34.133333 34.133333 0 0 1-47.786667 7.509333l-110.421333-80.213333a34.133333 34.133333 0 0 1-7.509334-47.786667l214.186667-295.253333L29.013333 489.813333a34.133333 34.133333 0 0 1-22.016-43.008l42.154667-129.877333a34.133333 34.133333 0 0 1 43.008-22.016l320.512 104.106667L412.672 51.2c0-18.773333 15.36-34.133333 34.133333-34.133333h136.533334z" }))));
    return label ? (React.createElement("label", { htmlFor: htmlFor && "" + htmlFor + ID_SUFFIX },
        symbolPosition !== 'end' && symbolNode,
        " ",
        label,
        symbolPosition === 'end' && React.createElement(React.Fragment, null,
            " ",
            symbolNode),
        showColon ? ':' : '')) : null;
};
export default FormItemLabel;
