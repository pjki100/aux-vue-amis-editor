/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');

var ServerError = /** @class */ (function (_super) {
    tslib.__extends(ServerError, _super);
    function ServerError(msg, response) {
        var _this = _super.call(this, msg) || this;
        _this.type = 'ServerError';
        _this.response = response;
        return _this;
    }
    return ServerError;
}(Error));

exports.ServerError = ServerError;
