export type FormFieldValidatorResult = true | string;
export type FormFieldValidator = (v: string) => FormFieldValidatorResult;
export declare function requiredValidator(v: string): FormFieldValidatorResult;
export declare function emailValidator(v: string): FormFieldValidatorResult;
