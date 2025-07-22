import {_} from "./utils";
import {FormFieldValidatorResult} from "./types";


export function requiredValidator(v: string): FormFieldValidatorResult {
    // @ts-ignore
    return Boolean(v) || _.call(this, 'field_required_error')
}

export function emailValidator(v: string): FormFieldValidatorResult {
    // @ts-ignore
    return /^.+@.+\..+$/.test(v) || _.call(this, 'invalid_email_error')
}