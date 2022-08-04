/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function highlight(text, input, hlClassName) {
    if (hlClassName === void 0) { hlClassName = 'is-matched'; }
    if (!input) {
        return text;
    }
    text = String(text);
    var reg = new RegExp(input.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'), 'ig');
    if (!reg.test(text)) {
        return text;
    }
    var dom = [];
    var start = 0;
    var match = null;
    reg.lastIndex = 0;
    while ((match = reg.exec(text))) {
        var prev = text.substring(start, match.index);
        prev && dom.push(React__default["default"].createElement("span", { key: dom.length }, prev));
        match[0] &&
            dom.push(React__default["default"].createElement("span", { className: hlClassName, key: dom.length }, match[0]));
        start = match.index + match[0].length;
    }
    var rest = text.substring(start);
    rest && dom.push(React__default["default"].createElement("span", { key: dom.length }, rest));
    // const parts = text.split(reg);
    // parts.forEach((text: string, index) => {
    //   text && dom.push(<span key={index}>{text}</span>);
    //   dom.push(
    //     <span className={hlClassName} key={`${index}-hl`}>
    //       {input}
    //     </span>
    //   );
    // });
    // dom.pop();
    return dom;
}

exports.highlight = highlight;
