/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __extends, __assign } from 'tslib';
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

var RootStoreContext = React.createContext(undefined);
function withRootStore(ComposedComponent) {
    var _a;
    var result = hoistNonReactStatic((_a = /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.render = function () {
                var rootStore = this.context;
                var injectedProps = {
                    rootStore: rootStore
                };
                return (React.createElement(ComposedComponent, __assign({}, this.props, injectedProps)));
            };
            return class_1;
        }(React.Component)),
        _a.displayName = "WithRootStore(".concat(ComposedComponent.displayName || ComposedComponent.name, ")"),
        _a.contextType = RootStoreContext,
        _a.ComposedComponent = ComposedComponent,
        _a), ComposedComponent);
    return result;
}

export { RootStoreContext, withRootStore };
