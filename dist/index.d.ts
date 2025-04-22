import { FormFieldValidator } from "./validators";
import { Locale } from "./locale/type";
type FormBindMetaType = {
    onBlur: () => void;
    onChange: (to: any) => void;
};
type FormBindType<T> = {
    [key in keyof T]: FormBindMetaType;
};
type FormValuesType<T> = {
    [key in keyof T]: string;
};
type FormErrorsType<T> = {
    [key in keyof T]: string | null;
};
type FormValidFlagsType<T> = {
    [key in keyof T]: boolean;
};
type FormType<T> = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    isValid: () => boolean;
    reset: () => void;
    bind: FormBindType<T>;
    values: FormValuesType<T>;
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
};
type FormCreatorArgs<T> = {
    [key in keyof T]: {
        required: boolean;
        rules?: FormFieldValidator[];
        initialValue?: any;
    };
};
type FormSettingsType = {
    /**
     * Locale of the form (default - as browser language)
     */
    locale?: Locale;
};
/**
 * Generate form validation zustand store
 *
 * @param form Form validation definition
 * @param settings Settings for form
 */
export declare const createFormValidator: <T extends object>(form: FormCreatorArgs<T>, settings?: FormSettingsType) => import("zustand").UseBoundStore<import("zustand").StoreApi<FormType<T>>>;
export declare const setDefaultLocale: (locale: Locale) => "en" | "ru";
export {};
