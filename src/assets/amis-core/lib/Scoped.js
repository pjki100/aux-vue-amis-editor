/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var find = require('lodash/find');
var hoistNonReactStatic = require('hoist-non-react-statics');
require('amis-formula');
require('moment');
require('lodash/isPlainObject');
var dataMapping = require('./utils/dataMapping.js');
require('./utils/filter.js');
var helper = require('./utils/helper.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var find__default = /*#__PURE__*/_interopDefaultLegacy(find);
var hoistNonReactStatic__default = /*#__PURE__*/_interopDefaultLegacy(hoistNonReactStatic);

/**
 * @file 用来创建一个域，在这个域里面会把里面的运行时实例注册进来，方便组件之间的通信。
 * @author fex
 */
var ScopedContext = React__default["default"].createContext(createScopedTools(''));
function createScopedTools(path, parent, env) {
    var components = [];
    var self = {
        parent: parent,
        registerComponent: function (component) {
            // 不要把自己注册在自己的 Scoped 上，自己的 Scoped 是给子节点们注册的。
            if (component.props.$path === path && parent) {
                return parent.registerComponent(component);
            }
            if (!~components.indexOf(component)) {
                components.push(component);
            }
        },
        unRegisterComponent: function (component) {
            // 自己本身实际上注册在父级 Scoped 上。
            if (component.props.$path === path && parent) {
                return parent.unRegisterComponent(component);
            }
            var idx = components.indexOf(component);
            if (~idx) {
                components.splice(idx, 1);
            }
        },
        getComponentByName: function (name) {
            if (~name.indexOf('.')) {
                var paths = name.split('.');
                var len_1 = paths.length;
                return paths.reduce(function (scope, name, idx) {
                    if (scope && scope.getComponentByName) {
                        var result = scope.getComponentByName(name);
                        return result && idx < len_1 - 1 ? result.context : result;
                    }
                    return null;
                }, this);
            }
            var resolved = find__default["default"](components, function (component) {
                return component.props.name === name || component.props.id === name;
            });
            return resolved || (parent && parent.getComponentByName(name));
        },
        getComponentById: function (id) {
            var root = this;
            // 找到顶端scoped
            while (root.parent) {
                root = root.parent;
            }
            // 向下查找
            var component = undefined;
            helper.findTree([root], function (item) {
                return item.getComponents().find(function (cmpt) {
                    if (cmpt.props.id === id) {
                        component = cmpt;
                        return true;
                    }
                    return false;
                });
            });
            return component;
        },
        getComponents: function () {
            return components.concat();
        },
        reload: function (target, ctx) {
            var scoped = this;
            var targets = typeof target === 'string' ? target.split(/\s*,\s*/) : target;
            targets.forEach(function (name) {
                var idx2 = name.indexOf('?');
                var query = null;
                if (~idx2) {
                    var queryObj = helper.qsparse(name
                        .substring(idx2 + 1)
                        .replace(/\$\{(.*?)\}/, function (_, match) { return '${' + encodeURIComponent(match) + '}'; }));
                    query = dataMapping.dataMapping(queryObj, ctx);
                    name = name.substring(0, idx2);
                }
                var idx = name.indexOf('.');
                var subPath = '';
                if (~idx) {
                    subPath = name.substring(1 + idx);
                    name = name.substring(0, idx);
                }
                if (name === 'window') {
                    if (query) {
                        var link = location.pathname + '?' + helper.qsstringify(query);
                        env ? env.updateLocation(link, true) : location.replace(link);
                    }
                    else {
                        location.reload();
                    }
                }
                else {
                    var component = scoped.getComponentByName(name);
                    component &&
                        component.reload &&
                        component.reload(subPath, query, ctx);
                }
            });
        },
        send: function (receive, values) {
            var scoped = this;
            var receives = typeof receive === 'string' ? receive.split(/\s*,\s*/) : receive;
            // todo 没找到做提示！
            receives.forEach(function (name) {
                var askIdx = name.indexOf('?');
                if (~askIdx) {
                    var query = name.substring(askIdx + 1);
                    var queryObj = helper.qsparse(query.replace(/\$\{(.*?)\}/, function (_, match) { return '${' + encodeURIComponent(match) + '}'; }));
                    name = name.substring(0, askIdx);
                    values = dataMapping.dataMapping(queryObj, values);
                }
                var idx = name.indexOf('.');
                var subPath = '';
                if (~idx) {
                    subPath = name.substring(1 + idx);
                    name = name.substring(0, idx);
                }
                var component = scoped.getComponentByName(name);
                if (component && component.receive) {
                    component.receive(values, subPath);
                }
                else if (name === 'window' && env && env.updateLocation) {
                    var query = tslib.__assign(tslib.__assign({}, (location.search ? helper.qsparse(location.search.substring(1)) : {})), values);
                    var link = location.pathname + '?' + helper.qsstringify(query);
                    env.updateLocation(link, true);
                }
            });
        },
        /**
         * 主要是用来关闭指定弹框的
         *
         * @param target 目标 name
         */
        close: function (target) {
            var scoped = this;
            if (typeof target === 'string') {
                // 过滤已经关掉的，当用户 close 配置多个弹框 name 时会出现这种情况
                target
                    .split(/\s*,\s*/)
                    .map(function (name) { return scoped.getComponentByName(name); })
                    .filter(function (component) { return component && component.props.show; })
                    .forEach(closeDialog);
            }
        },
        /**
         * 关闭指定id的弹窗
         * @param id
         */
        closeById: function (id) {
            var scoped = this;
            var component = scoped.getComponentById(id);
            if (component && component.props.show) {
                closeDialog(component);
            }
        }
    };
    if (!parent) {
        return self;
    }
    !parent.children && (parent.children = []);
    // 把孩子带上
    parent.children.push(self);
    return self;
}
function closeDialog(component) {
    component.context
        .getComponents()
        .filter(function (item) {
        return item &&
            (item.props.type === 'dialog' || item.props.type === 'drawer') &&
            item.props.show;
    })
        .forEach(closeDialog);
    component.props.onClose && component.props.onClose();
}
function HocScoped(ComposedComponent) {
    var ScopedComponent = /** @class */ (function (_super) {
        tslib.__extends(ScopedComponent, _super);
        function ScopedComponent(props, context) {
            var _this = _super.call(this, props) || this;
            _this.scoped = createScopedTools(_this.props.$path, context, _this.props.env);
            var scopeRef = props.scopeRef;
            scopeRef && scopeRef(_this.scoped);
            return _this;
        }
        ScopedComponent.prototype.getWrappedInstance = function () {
            return this.ref;
        };
        ScopedComponent.prototype.childRef = function (ref) {
            while (ref && ref.getWrappedInstance) {
                ref = ref.getWrappedInstance();
            }
            this.ref = ref;
        };
        ScopedComponent.prototype.componentWillUnmount = function () {
            var scopeRef = this.props.scopeRef;
            scopeRef && scopeRef(null);
            delete this.scoped;
        };
        ScopedComponent.prototype.render = function () {
            var _a = this.props; _a.scopeRef; var rest = tslib.__rest(_a, ["scopeRef"]);
            return (React__default["default"].createElement(ScopedContext.Provider, { value: this.scoped },
                React__default["default"].createElement(ComposedComponent, tslib.__assign({}, rest /* todo */, { ref: this.childRef }))));
        };
        ScopedComponent.displayName = "Scoped(".concat(ComposedComponent.displayName || ComposedComponent.name, ")");
        ScopedComponent.contextType = ScopedContext;
        ScopedComponent.ComposedComponent = ComposedComponent;
        tslib.__decorate([
            helper.autobind,
            tslib.__metadata("design:type", Function),
            tslib.__metadata("design:paramtypes", [Object]),
            tslib.__metadata("design:returntype", void 0)
        ], ScopedComponent.prototype, "childRef", null);
        return ScopedComponent;
    }(React__default["default"].Component));
    hoistNonReactStatic__default["default"](ScopedComponent, ComposedComponent);
    return ScopedComponent;
}

exports.HocScoped = HocScoped;
exports.ScopedContext = ScopedContext;
exports["default"] = HocScoped;
