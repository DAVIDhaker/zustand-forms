import {Locale} from "./locale/type";


// region Validators types
export type FormFieldValidatorResult = true | string


export type FormFieldValidator<T> = (v: string, form: FormType<T>) => FormFieldValidatorResult
// endregion


export type FormBindMetaType = {
    onBlur: () => void
    onChange: (to: any) => void
    get value(): string
}

export type FormBindType<T> = {
    [key in keyof T]: FormBindMetaType
}

export type FormValuesType<T> = {
    [key in keyof T]: string
}

export type FormErrorsType<T> = {
    [key in keyof T]: string | null
}

export type FormValidFlagsType<T> = {
    [key in keyof T]: boolean
}

export type FormType<T> = {
    // Locale language (by default - current browser locale)
    locale: Locale;

    // Change locale of current form
    setLocale: (locale: Locale) => void;

    // Are form is valid
    isValid: () => boolean

    // Reset the form to the initial values
    reset: () => void

    // Methods to bind the form
    bind: FormBindType<T>

    // Values of form
    values: FormValuesType<T>

    // Initial values of the form
    initialValues: FormValuesType<T>

    // Errors of form FIELD to FIRST ERROR dict
    errors: FormErrorsType<T>

    // Per field "is valid" flag (valid.FIELD)
    valid: FormValidFlagsType<T>

    /**
     * Run form validation
     *
     * @param silent Don't emit errors (to field messages)
     * @param include Validate only picked fields
     */
    validate: (silent?: boolean, include?: Array<keyof T>) => void

    /**
     * Blur event listener
     *
     * @param field Field name (as passed in form definition)
     */
    onBlur: (field: keyof T) => void

    /**
     * Change acceptor
     *
     * @param fieldsValue Map of fields and new values
     */
    onChange: (fieldValue: {[K in keyof Partial<T>]: string}) => void

    /**
     * Update the initial values of form
     *
     * @param initialValues Part or all initial values
     */
    setInitialValues: (initialValues: Partial<FormValuesType<T>>) => void

    /**
     * Has form modified
     *
     * This method compares values and initial values and if it's
     * equals - return true, else - false
     */
    hasModified: () => boolean

    /**
     * Set form values
     */
    setValues: (values: Partial<FormValuesType<T>>) => void
}


export type FormCreatorArgs<T> = {
    [key in keyof T]: {
        // Are field is required
        required: boolean

        // Set of rules for field validation
        rules?: FormFieldValidator<T>[],

        // Initial value of field when form reset/init
        initialValue?: any,
    }
}

// todo Validation mode
// type ValidationTrigger = 'onchange' | 'onblur'
// type ValidationTriggersSettingType = {
//     /**
//      * Form validation triggers
//      *
//      * onchange - validate on any input or blur (default)
//      * onblur - validate only when any field has blured
//      */
//     validationTriggers?: ValidationTrigger[]
// }



export type FormSettingsType = { // ValidationTriggersSettingType &
    /**
     * Locale of the form (default - as browser language)
     */
    locale?: Locale
}
