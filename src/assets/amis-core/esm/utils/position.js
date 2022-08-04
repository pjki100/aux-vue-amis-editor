/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __assign } from 'tslib';
import { offset } from './offset.js';
import { offsetParent } from './offsetParent.js';

/**
 * 删减自 https://github.com/react-bootstrap/dom-helpers/blob/master/src/position.ts
 */
var nodeName = function (node) {
    return node.nodeName && node.nodeName.toLowerCase();
};
/**
 * Returns the relative position of a given element.
 *
 * @param node the element
 * @param offsetParent the offset parent
 */
function position(node, offsetParent$1) {
    var parentOffset = { top: 0, left: 0 };
    var offset$1;
    // Fixed elements are offset from window (parentOffset = {top:0, left: 0},
    // because it is its only offset parent
    if (getComputedStyle(node).getPropertyValue('position') === 'fixed') {
        offset$1 = node.getBoundingClientRect();
    }
    else {
        var parent_1 = offsetParent$1 || offsetParent(node);
        offset$1 = offset(node);
        if (parent_1 === node) {
            return {
                top: 0,
                left: 0,
                width: offset$1.width,
                height: offset$1.height
            };
        }
        if (nodeName(parent_1) !== 'html')
            parentOffset = offset(parent_1);
        var borderTop = String(getComputedStyle(parent_1).getPropertyValue('border-top-width') || 0);
        parentOffset.top += parseInt(borderTop, 10) - parent_1.scrollTop || 0;
        var borderLeft = String(getComputedStyle(parent_1).getPropertyValue('border-left-width') || 0);
        parentOffset.left += parseInt(borderLeft, 10) - parent_1.scrollLeft || 0;
    }
    var marginTop = String(getComputedStyle(node).getPropertyValue('margin-top') || 0);
    var marginLeft = String(getComputedStyle(node).getPropertyValue('margin-left') || 0);
    // Subtract parent offsets and node margins
    return __assign(__assign({}, offset$1), { top: offset$1.top - parentOffset.top - (parseInt(marginTop, 10) || 0), left: offset$1.left - parentOffset.left - (parseInt(marginLeft, 10) || 0) });
}

export { position as default, position };
