/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { evalExpression, filter } from './tpl.js';
import { injectPropsToObject, mapObject } from './helper.js';
import isPlainObject from 'lodash/isPlainObject';
import cx from 'classnames';

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
                    ctx = injectPropsToObject(data, {
                        __props: props
                    });
                }
                value =
                    parts[2] === 'On'
                        ? evalExpression(value, ctx || data)
                        : filter(value, ctx || data);
            }
            exprProps[key] = value;
        }
        else if (value &&
            isPlainObject(value) &&
            ((parts === null || parts === void 0 ? void 0 : parts[2]) === 'className' || (parts === null || parts === void 0 ? void 0 : parts[2]) === 'ClassName')) {
            key = parts[1] + parts[2];
            exprProps["".concat(key, "Raw")] = value;
            exprProps[key] = cx(mapObject(value, function (value) {
                return typeof value === 'string' ? evalExpression(value, data) : value;
            }));
        }
    });
    return exprProps;
}

export { getExprProperties as default, getExprProperties };
