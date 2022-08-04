/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __assign } from 'tslib';
import { guid } from './helper.js';
import { keyToPath } from './keyToPath.js';

var DataScope = /** @class */ (function () {
    function DataScope(schemas, id) {
        this.children = [];
        this.schemas = [];
        this.setSchemas(Array.isArray(schemas) ? schemas : [schemas]);
        this.id = id;
    }
    DataScope.prototype.addChild = function (id, schema) {
        var child = new DataScope(schema || {
            type: 'object',
            properties: {}
        }, id);
        this.children.push(child);
        child.parent = this;
        return child;
    };
    DataScope.prototype.removeChild = function (idOrScope) {
        var idx = this.children.findIndex(function (item) {
            return typeof idOrScope === 'string' ? idOrScope === item.id : item === idOrScope;
        });
        if (~idx) {
            var scope = this.children[idx];
            delete scope.parent;
            this.children.splice(idx, 1);
        }
    };
    DataScope.prototype.setSchemas = function (schemas) {
        this.schemas.splice(0, this.schemas.length);
        for (var _i = 0, schemas_1 = schemas; _i < schemas_1.length; _i++) {
            var schema = schemas_1[_i];
            if (schema.type !== 'object') {
                throw new TypeError('data scope accept only object');
            }
            this.schemas.push(__assign({ $id: guid() }, schema));
        }
        return this;
    };
    DataScope.prototype.addSchema = function (schema) {
        schema = __assign({ $id: guid() }, schema);
        this.schemas.push(schema);
        return this;
    };
    DataScope.prototype.removeSchema = function (id) {
        var idx = this.schemas.findIndex(function (schema) { return schema.$id === id; });
        if (~idx) {
            this.schemas.splice(idx, 1);
        }
        return this;
    };
    DataScope.prototype.contains = function (scope) {
        var from = scope;
        while (from) {
            if (this === from) {
                return true;
            }
            from = from.parent;
        }
        return false;
    };
    DataScope.prototype.getMergedSchema = function () {
        var mergedSchema = {
            type: 'object',
            properties: {}
        };
        // todo 以后再来细化这一块，先粗略的写个大概
        this.schemas.forEach(function (schema) {
            var properties = schema.properties || {};
            Object.keys(properties).forEach(function (key) {
                var value = properties[key];
                if (mergedSchema.properties[key]) {
                    if (Array.isArray(mergedSchema.properties[key].oneOf)) {
                        mergedSchema.properties[key].oneOf.push();
                    }
                    else if (mergedSchema.properties[key].type &&
                        mergedSchema.properties[key].type !== value.type) {
                        mergedSchema.properties[key] = {
                            oneOf: [mergedSchema.properties[key], value]
                        };
                    }
                }
                else {
                    mergedSchema.properties[key] = value;
                }
            });
        });
        return mergedSchema;
    };
    DataScope.prototype.buildOptions = function (options, schema, path, key, 
    /** 是否数组元素，数组元素的内容将获取每个成员的对应值 */
    isArrayItem, 
    /** 不是所有的都可以选择，但不影响子元素 */
    disabled) {
        var _this = this;
        var _a;
        if (path === void 0) { path = ''; }
        if (key === void 0) { key = ''; }
        if (isArrayItem === void 0) { isArrayItem = false; }
        // todo 支持 oneOf, anyOf
        var option = {
            label: schema.title || key,
            value: path,
            type: schema.type,
            tag: (_a = schema.description) !== null && _a !== void 0 ? _a : schema.type,
            disabled: disabled
        };
        options.push(option);
        if (schema.type === 'object' && schema.properties) {
            option.children = [];
            var keys = Object.keys(schema.properties);
            keys.forEach(function (key) {
                var child = schema.properties[key];
                var newPath = isArrayItem ? "ARRAYMAP(".concat(path, ", item => item.").concat(key, ")") : (path + (path ? '.' : '') + key);
                _this.buildOptions(option.children, child, newPath, key, isArrayItem, false);
            });
        }
        else if (schema.type === 'array' && schema.items) {
            option.children = [];
            this.buildOptions(option.children, __assign({ title: '成员' }, schema.items), path, 'items', true, true);
            this.buildOptions(option.children, {
                title: '总数',
                type: 'number'
            }, path + (path ? '.' : '') + 'length', 'length', true, isArrayItem);
        }
    };
    DataScope.prototype.getDataPropsAsOptions = function () {
        var variables = [];
        this.buildOptions(variables, this.getMergedSchema());
        return variables[0].children;
    };
    DataScope.prototype.getSchemaByPath = function (path) {
        var parts = keyToPath(path);
        for (var _i = 0, _a = this.schemas; _i < _a.length; _i++) {
            var schema = _a[_i];
            var result = parts.reduce(function (schema, key) {
                if (schema && schema.type === 'object' && schema.properties) {
                    return schema.properties[key];
                }
                return null;
            }, schema);
            if (result) {
                return result;
            }
        }
        return null;
    };
    return DataScope;
}());

export { DataScope };
