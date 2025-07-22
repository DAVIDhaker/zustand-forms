import {create, UseBoundStore, StoreApi} from "zustand";
import {AVAILABLE_LOCALES, Locale} from "./locale/type";
import {requiredValidator} from "./validators";
import {
    FormBindMetaType,
    FormBindType,
    FormCreatorArgs,
    FormErrorsType, FormFieldValidator,
    FormSettingsType,
    FormType,
    FormValidFlagsType,
    FormValuesType,
} from './types'


export type FormValidatorType<T> = UseBoundStore<StoreApi<FormType<T>>>

/**
 * Generate form validation zustand store
 *
 * @param form Form validation definition
 * @param settings Settings for form
 */
export const createFormValidator = <T extends object>(form: FormCreatorArgs<T>, settings?: FormSettingsType): FormValidatorType<T> => {
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
                let validators: FormFieldValidator<T>[] = []

                if (form[field as keyof T].required)
                    validators.push(requiredValidator)

                validators = [
                    ...validators,
                    ...form[field as keyof T].rules || [],
                ]
                // endregion

                if (validators.length > 0) {
                    let fieldHasError = false

                    for (let validator of validators) {
                        let validationResult = validator(values[field as keyof T], get())

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