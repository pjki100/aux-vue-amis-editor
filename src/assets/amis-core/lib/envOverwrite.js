/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var helper = require('./utils/helper.js');

/**
 * @file 用于在移动端或不同语言环境下使用不同配置
 */
var _a, _b;
var isMobile = ((_b = (_a = window).matchMedia) === null || _b === void 0 ? void 0 : _b.call(_a, '(max-width: 768px)').matches)
    ? true
    : false;
// 这里不能用 addSchemaFilter 是因为还需要更深层的替换，比如 select 里的 options
var envOverwrite = function (schema, locale) {
    if (schema.mobile && isMobile) {
        Object.assign(schema, schema.mobile);
        delete schema.mobile;
    }
    if (locale) {
        var schemaNodes = helper.findObjectsWithKey(schema, locale);
        for (var _i = 0, schemaNodes_1 = schemaNodes; _i < schemaNodes_1.length; _i++) {
            var schemaNode = schemaNodes_1[_i];
            Object.assign(schemaNode, schemaNode[locale]);
            delete schemaNode[locale];
        }
    }
    if (isMobile) {
        var schemaNodes = helper.findObjectsWithKey(schema, 'mobile');
        for (var _a = 0, schemaNodes_2 = schemaNodes; _a < schemaNodes_2.length; _a++) {
            var schemaNode = schemaNodes_2[_a];
            Object.assign(schemaNode, schemaNode['mobile']);
            delete schemaNode['mobile'];
        }
    }
};

exports.envOverwrite = envOverwrite;
