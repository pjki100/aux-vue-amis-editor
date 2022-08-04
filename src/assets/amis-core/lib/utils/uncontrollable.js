/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var uncontrollable$1 = require('uncontrollable');
var hoistNonReactStatic = require('hoist-non-react-statics');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var hoistNonReactStatic__default = /*#__PURE__*/_interopDefaultLegacy(hoistNonReactStatic);

function uncontrollable(arg, config, mapping) {
    var result = uncontrollable$1.uncontrollable(arg, config, mapping);
    return hoistNonReactStatic__default["default"](result, arg);
}

exports.uncontrollable = uncontrollable;
