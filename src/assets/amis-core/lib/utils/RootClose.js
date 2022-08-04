/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var useRootClose = require('../node_modules/react-overlays/esm/useRootClose.js');
var ReactDOM = require('react-dom');

/**
 * 兼容之前的 RootCloseWrapper 写法
 */
var RootClose = function (_a) {
    var children = _a.children, onRootClose = _a.onRootClose, props = tslib.__rest(_a, ["children", "onRootClose"]);
    var _b = React.useState(null), rootComponent = _b[0], attachRef = _b[1];
    var rootElement = ReactDOM.findDOMNode(rootComponent);
    useRootClose["default"](rootElement, onRootClose, props);
    return typeof children === 'function' ? children(attachRef) : children;
};

exports.RootClose = RootClose;
