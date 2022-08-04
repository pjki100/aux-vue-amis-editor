/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __rest } from 'tslib';
import { useState } from 'react';
import useRootClose from '../node_modules/react-overlays/esm/useRootClose.js';
import { findDOMNode } from 'react-dom';

/**
 * 兼容之前的 RootCloseWrapper 写法
 */
var RootClose = function (_a) {
    var children = _a.children, onRootClose = _a.onRootClose, props = __rest(_a, ["children", "onRootClose"]);
    var _b = useState(null), rootComponent = _b[0], attachRef = _b[1];
    var rootElement = findDOMNode(rootComponent);
    useRootClose(rootElement, onRootClose, props);
    return typeof children === 'function' ? children(attachRef) : children;
};

export { RootClose };
