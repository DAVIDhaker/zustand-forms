import { _ } from "./utils";
export function requiredValidator(v) {
    // @ts-ignore
    return Boolean(v) || _.call(this, 'field_required_error');
}
export function emailValidator(v) {
    // @ts-ignore
    return /^.+@.+\..+$/.test(v) || _.call(this, 'invalid_email_error');
}
