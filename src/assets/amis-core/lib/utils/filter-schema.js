/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tpl = require('./tpl.js');
var helper = require('./helper.js');
var isPlainObject = require('lodash/isPlainObject');
var cx = require('classnames');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject);
var cx__default = /*#__PURE__*/_interopDefaultLegacy(cx);

/**
 * 处理 Props 数据，所有带 On 结束的做一次
 *
 * xxxOn
 * xxxExpr
 *
 *
 * @param schema
 * @param data
 */
function getExprProperties(schema, data, blackList, props) {
    if (data === void 0) { data = {}; }
    if (blackList === void 0) { blackList = ['addOn']; }
    var exprProps = {};
    var ctx = null;
    Object.getOwnPropertyNames(schema).forEach(function (key) {
        if (blackList && ~blackList.indexOf(key)) {
            return;
        }
        var parts = /^(.*)(On|Expr|(?:c|C)lassName)(Raw)?$/.exec(key);
        var value = schema[key];
        if (value &&
            typeof value === 'string' &&
            (parts === null || parts === void 0 ? void 0 : parts[1]) &&
            (parts[2] === 'On' || parts[2] === 'Expr')) {
            key = parts[1];
            if (parts[2] === 'On' || parts[2] === 'Expr') {
                if (!ctx &&
                    props &&
                    typeof value === 'string' &&
                    ~value.indexOf('__props')) {
                    ctx = helper.injectPropsToObject(data, {
                        __props: props
                    });
                }
                value =
                    parts[2] === 'On'
                        ? tpl.evalExpression(value, ctx || data)
                        : tpl.filter(value, ctx || data);
            }
            exprProps[key] = value;
        }
        else if (value &&
            isPlainObject__default["default"](value) &&
            ((parts === null || parts === void 0 ? void 0 : parts[2]) === 'className' || (parts === null || parts === void 0 ? void 0 : parts[2]) === 'ClassName')) {
            key = parts[1] + parts[2];
            exprProps["".concat(key, "Raw")] = value;
            exprProps[key] = cx__default["default"](helper.mapObject(value, function (value) {
                return typeof value === 'string' ? tpl.evalExpression(value, data) : value;
            }));
        }
    });
    return exprProps;
}

exports["default"] = getExprProperties;
exports.getExprProperties = getExprProperties;
