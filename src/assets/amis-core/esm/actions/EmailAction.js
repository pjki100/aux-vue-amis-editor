/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __awaiter, __generator } from 'tslib';
import pick from 'lodash/pick';
import qs from 'qs';
import { registerAction } from './Action.js';

/**
 * 邮件动作
 *
 * @export
 * @class EmailAction
 * @implements {Action}
 */
var EmailAction = /** @class */ (function () {
    function EmailAction() {
    }
    EmailAction.prototype.run = function (action, renderer, event) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var mailTo, mailInfo, mailStr, mailto;
            return __generator(this, function (_c) {
                mailTo = (_a = action.args) === null || _a === void 0 ? void 0 : _a.to;
                mailInfo = pick((_b = action.args) !== null && _b !== void 0 ? _b : {}, 'cc', 'bcc', 'subject', 'body');
                mailStr = qs.stringify(mailInfo);
                mailto = "mailto:".concat(mailTo, "?").concat(mailStr);
                window.open(mailto);
                return [2 /*return*/];
            });
        });
    };
    return EmailAction;
}());
registerAction('email', new EmailAction());

export { EmailAction };
