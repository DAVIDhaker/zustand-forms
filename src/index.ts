import {create, UseBoundStore, StoreApi} from "zustand";
import {AVAILABLE_LOCALES, Locale} from "./locale/type";
import {FormFieldValidator, requiredValidator} from "./validators";


type FormBindMetaType = {
    onBlur: () => void
    onChange: (to: any) => void
    get value(): string
}

type FormBindType<T> = {
    [key in keyof T]: FormBindMetaType
}

type FormValuesType<T> = {
    [key in keyof T]: string
}

type FormErrorsType<T> = {
    [key in keyof T]: string | null
}

type FormValidFlagsType<T> = {
    [key in keyof T]: boolean
}

type FormType<T> = {
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


type FormCreatorArgs<T> = {
    [key in keyof T]: {
        // Are field is required
        required: boolean

        // Set of rules for field validation
        rules?: FormFieldValidator[],

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



type FormSettingsType = { // ValidationTriggersSettingType &
    /**
     * Locale of the form (default - as browser language)
     */
    locale?: Locale
}


/**
 * Generate form validation zustand store
 *
 * @param form Form validation definition
 * @param settings Settings for form
 */
export const createFormValidator = <T extends object>(form: FormCreatorArgs<T>, settings?: FormSettingsType): UseBoundStore<StoreApi<FormType<T>>> => {
    let locale: Locale = (settings?.locale || navigator?.language?.split('-')[0] || 'en') as Locale

    if (AVAILABLE_LOCALES.indexOf(locale) === -1)
        locale = 'en'

    const getInitialValues = (): FormValuesType<T> => Object
        .keys(form)
        .reduce((aggregatedObj, field) => ({
            ...aggregatedObj,
            [field]: form[field as keyof T].initialValue || ''
        }), {}) as FormValuesType<T>


    const getInitialErrors = (): FormErrorsType<T> => Object
        .keys(form)
        .reduce((aggregatedObj, field) => ({
            ...aggregatedObj,
            [field]: null
        }), {}) as FormErrorsType<T>

    const getInitialValidFlags = (): FormValidFlagsType<T> => Object
        .keys(form)
        .reduce((aggregatedObj, field) => ({
            ...aggregatedObj,
            [field]: false
        }), {}) as FormValidFlagsType<T>


    return create<FormType<T>>((set, get): FormType<T> => ({
        locale,

        setLocale: (locale) => set(() => ({ locale })),

        isValid: () => {
            const {valid} = get()

            return Object
                .keys(form)
                .map(field => valid[field as keyof T])
                .every(e => !!e)
        },

        reset: () => {
            set(({initialValues}) => ({
                values: { ...initialValues },
                errors: getInitialErrors(),
            }))

            get().validate(true)
        },

        values: getInitialValues(),

        errors: getInitialErrors(),

        initialValues: getInitialValues(),

        valid: getInitialValidFlags(),

        onBlur: (field: keyof T) => get().validate(false, [field]),

        onChange: (fieldValues: {[K in keyof Partial<T>]: string}) => {
            set(({ values }) => ({ values: { ...values, ...fieldValues } }))

            get().validate(true, [Object.keys(fieldValues)[0]] as Array<keyof T>)
        },

        bind: Object
            .keys(form)
            .reduce((aggregatedObj, field) => ({
                ...aggregatedObj,

                [field as keyof T]: {
                    onBlur: () => get().onBlur(field as keyof T),
                    onChange: v => get().onChange({ [field]: v} as {[K in keyof Partial<T>]: string}),
                    get value(): string {
                        return get().values[field as keyof T]
                    }
                } as FormBindMetaType
            }), {}) as FormBindType<T>,

        validate: (silent: boolean = true, include: Array<keyof T> = []) => {
            const { values } = get()

            for (let field in values) {
                if (include.length > 0 && include.indexOf(field as keyof T) === -1) {
                    continue;
                }

                // region Collect validators for field
                let validators = []

                if (form[field as keyof T].required)
                    validators.push(requiredValidator)

                validators = [
                    ...validators,
                    ...form[field as keyof T].rules || [],
                ]
                // endregion

                if (validators.length > 0) {
                    let fieldHasError = false

                    for (let validator of validators!) {
                        let validationResult = validator.call(this, values[field as keyof T])

                        if (validationResult !== true) {
                            fieldHasError = true

                            set(({valid, errors}) => ({
                                valid: { ...valid, [field]: false},
                                errors: { ...errors, [field]: silent ? null : validationResult}
                            }))
                            break
                        }
                    }

                    if (!fieldHasError) {
                        set(({errors, valid}) => ({
                            errors: { ...errors, [field]: null },
                            valid: { ...valid, [field]: true}
                        }))
                    }
                }
            }
        },

        setInitialValues: (values: Partial<FormValuesType<T>>) => set(({initialValues}) => ({
            initialValues: {
                ...initialValues,
                ...values,
            }
        })),

        hasModified: () => {
            const {values, initialValues} = get()

            return !Object
                .keys(values)
                .map(field => values[field as keyof T] == initialValues[field as keyof T])
                .every(isInitial => isInitial)
        },

        setValues: (newValues: Partial<FormValuesType<T>>) => {
            set(({values}) => ({
                values: {
                    ...values,
                    ...newValues,
                }
            }))

            get().validate(true, Object.keys(newValues) as Array<keyof T>)
        }
    }))
}


export const setDefaultLocale = (locale: Locale) =>
    // @ts-ignore
    window.___zustand_forms__default_locale = locale