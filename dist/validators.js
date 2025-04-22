"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredValidator = requiredValidator;
exports.emailValidator = emailValidator;
const utils_1 = require("./utils");
function requiredValidator(v) {
    // @ts-ignore
    return Boolean(v) || utils_1._.call(this, 'field_required_error');
}
function emailValidator(v) {
    // @ts-ignore
    return /^.+@.+\..+$/.test(v) || utils_1._.call(this, 'invalid_email_error');
}
