/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var api = require('../utils/api.js');
var omit = require('lodash/omit');
var Action = require('./Action.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var omit__default = /*#__PURE__*/_interopDefaultLegacy(omit);

/**
 * 打开页面动作
 *
 * @export
 * @class LinkAction
 * @implements {Action}
 */
var LinkAction = /** @class */ (function () {
    function LinkAction() {
    }
    LinkAction.prototype.run = function (action, renderer, event) {
        var _a, _b, _c, _d, _e, _f;
        return tslib.__awaiter(this, void 0, void 0, function () {
            var urlObj;
            return tslib.__generator(this, function (_g) {
                if (!((_a = renderer.props.env) === null || _a === void 0 ? void 0 : _a.jumpTo)) {
                    throw new Error('env.jumpTo is required!');
                }
                urlObj = api.buildApi({
                    url: (((_b = action.args) === null || _b === void 0 ? void 0 : _b.url) || ((_c = action.args) === null || _c === void 0 ? void 0 : _c.link)),
                    method: 'get'
                }, tslib.__assign(tslib.__assign({}, ((_e = (_d = action.args) === null || _d === void 0 ? void 0 : _d.params) !== null && _e !== void 0 ? _e : {})), omit__default["default"]((_f = action.args) !== null && _f !== void 0 ? _f : {}, ['params', 'blank', 'url', 'link'])), {
                    autoAppend: true
                });
                renderer.props.env.jumpTo(urlObj.url, tslib.__assign({ actionType: action.actionType, type: 'button' }, action.args), action.args);
                return [2 /*return*/];
            });
        });
    };
    return LinkAction;
}());
Action.registerAction('openlink', new LinkAction());

exports.LinkAction = LinkAction;
