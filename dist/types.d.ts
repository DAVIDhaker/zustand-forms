import { Locale } from "./locale/type";
export type FormFieldValidatorResult = true | string;
export type FormFieldValidator<T> = (v: string, form: FormType<T>) => FormFieldValidatorResult;
export type FormBindMetaType = {
    onBlur: () => void;
    onChange: (to: any) => void;
    get value(): string;
};
export type FormBindType<T> = {
    [key in keyof T]: FormBindMetaType;
};
export type FormValuesType<T> = {
    [key in keyof T]: string;
};
export type FormErrorsType<T> = {
    [key in keyof T]: string | null;
};
export type FormValidFlagsType<T> = {
    [key in keyof T]: boolean;
};
export type FormType<T> = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    isValid: () => boolean;
    reset: () => void;
    bind: FormBindType<T>;
    values: FormValuesType<T>;
    initialValues: FormValuesType<T>;
    errors: FormErrorsType<T>;
    valid: FormValidFlagsType<T>;
    /**
     * Run form validation
     *
     * @param silent Don't emit errors (to field messages)
     * @param include Validate only picked fields
     */
    validate: (silent?: boolean, include?: Array<keyof T>) => void;
    /**
     * Blur event listener
     *
     * @param field Field name (as passed in form definition)
     */
    onBlur: (field: keyof T) => void;
    /**
     * Change acceptor
     *
     * @param fieldsValue Map of fields and new values
     */
    onChange: (fieldValue: {
        [K in keyof Partial<T>]: string;
    }) => void;
    /**
     * Update the initial values of form
     *
     * @param initialValues Part or all initial values
     */
    setInitialValues: (initialValues: Partial<FormValuesType<T>>) => void;
    /**
     * Has form modified
     *
     * This method compares values and initial values and if it's
     * equals - return true, else - false
     */
    hasModified: () => boolean;
    /**
     * Set form values
     */
    setValues: (values: Partial<FormValuesType<T>>) => void;
};
export type FormCreatorArgs<T> = {
    [key in keyof T]: {
        required: boolean;
        rules?: FormFieldValidator<T>[];
        initialValue?: any;
    };
};
export type FormSettingsType = {
    /**
     * Locale of the form (default - as browser language)
     */
    locale?: Locale;
};
