/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __assign, __extends, __rest, __decorate, __metadata } from 'tslib';
import React from 'react';
import find from 'lodash/find';
import hoistNonReactStatic from 'hoist-non-react-statics';
import 'amis-formula';
import 'moment';
import 'lodash/isPlainObject';
import { dataMapping } from './utils/dataMapping.js';
import './utils/filter.js';
import { findTree, qsparse, qsstringify, autobind } from './utils/helper.js';

/**
 * @file 用来创建一个域，在这个域里面会把里面的运行时实例注册进来，方便组件之间的通信。
 * @author fex
 */
var ScopedContext = React.createContext(createScopedTools(''));
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
            var resolved = find(components, function (component) {
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
            findTree([root], function (item) {
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
                    var queryObj = qsparse(name
                        .substring(idx2 + 1)
                        .replace(/\$\{(.*?)\}/, function (_, match) { return '${' + encodeURIComponent(match) + '}'; }));
                    query = dataMapping(queryObj, ctx);
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
                        var link = location.pathname + '?' + qsstringify(query);
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
                    var queryObj = qsparse(query.replace(/\$\{(.*?)\}/, function (_, match) { return '${' + encodeURIComponent(match) + '}'; }));
                    name = name.substring(0, askIdx);
                    values = dataMapping(queryObj, values);
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
                    var query = __assign(__assign({}, (location.search ? qsparse(location.search.substring(1)) : {})), values);
                    var link = location.pathname + '?' + qsstringify(query);
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
        __extends(ScopedComponent, _super);
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
            var _a = this.props; _a.scopeRef; var rest = __rest(_a, ["scopeRef"]);
            return (React.createElement(ScopedContext.Provider, { value: this.scoped },
                React.createElement(ComposedComponent, __assign({}, rest /* todo */, { ref: this.childRef }))));
        };
        ScopedComponent.displayName = "Scoped(".concat(ComposedComponent.displayName || ComposedComponent.name, ")");
        ScopedComponent.contextType = ScopedContext;
        ScopedComponent.ComposedComponent = ComposedComponent;
        __decorate([
            autobind,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], ScopedComponent.prototype, "childRef", null);
        return ScopedComponent;
    }(React.Component));
    hoistNonReactStatic(ScopedComponent, ComposedComponent);
    return ScopedComponent;
}

export { HocScoped, ScopedContext, HocScoped as default };
