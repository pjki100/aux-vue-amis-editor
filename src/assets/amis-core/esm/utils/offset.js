/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

/**
 * 修改自 https://github.com/react-bootstrap/dom-helpers/blob/master/src/offset.ts
 */
/**
 * Returns the offset of a given element, including top and left positions, width and height.
 *
 * @param node the element
 */
function offset(node) {
    var doc = node === null || node === void 0 ? void 0 : node.ownerDocument;
    var box = { top: 0, left: 0, height: 0, width: 0 };
    var docElem = doc && doc.documentElement;
    // Make sure it's not a disconnected DOM node
    if (!docElem || !docElem.contains(node))
        return box;
    if (node.getBoundingClientRect !== undefined)
        box = node.getBoundingClientRect();
    box = {
        top: box.top + docElem.scrollTop - (docElem.clientTop || 0),
        left: box.left + docElem.scrollLeft - (docElem.clientLeft || 0),
        width: box.width,
        height: box.height
    };
    return box;
}

export { offset as default, offset };
