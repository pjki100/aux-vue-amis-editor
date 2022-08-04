/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __extends } from 'tslib';
import React from 'react';

var Placeholder = /** @class */ (function (_super) {
    __extends(Placeholder, _super);
    function Placeholder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Placeholder.prototype.componentDidMount = function () {
        console.warn("Please implement this renderer(".concat(this.props.type, ")"));
    };
    Placeholder.prototype.render = function () {
        return null;
    };
    return Placeholder;
}(React.Component));

export { Placeholder };
