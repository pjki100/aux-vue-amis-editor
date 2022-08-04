/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __extends } from 'tslib';

var ServerError = /** @class */ (function (_super) {
    __extends(ServerError, _super);
    function ServerError(msg, response) {
        var _this = _super.call(this, msg) || this;
        _this.type = 'ServerError';
        _this.response = response;
        return _this;
    }
    return ServerError;
}(Error));

export { ServerError };
