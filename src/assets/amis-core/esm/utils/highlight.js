/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import React from 'react';

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
        prev && dom.push(React.createElement("span", { key: dom.length }, prev));
        match[0] &&
            dom.push(React.createElement("span", { className: hlClassName, key: dom.length }, match[0]));
        start = match.index + match[0].length;
    }
    var rest = text.substring(start);
    rest && dom.push(React.createElement("span", { key: dom.length }, rest));
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

export { highlight };
