import { create } from "zustand";
import { AVAILABLE_LOCALES } from "./locale/type";
import { requiredValidator } from "./validators";
/**
 * Generate form validation zustand store
 *
 * @param form Form validation definition
 * @param settings Settings for form
 */
export const createFormValidator = (form, settings) => {
    let locale = (settings?.locale || navigator?.language?.split('-')[0] || 'en');
    if (AVAILABLE_LOCALES.indexOf(locale) === -1)
        locale = 'en';
    const getInitialValues = () => Object
        .keys(form)
        .reduce((aggregatedObj, field) => ({
        ...aggregatedObj,
        [field]: form[field].initialValue || ''
    }), {});
    const getInitialErrors = () => Object
        .keys(form)
        .reduce((aggregatedObj, field) => ({
        ...aggregatedObj,
        [field]: null
    }), {});
    const getInitialValidFlags = () => Object
        .keys(form)
        .reduce((aggregatedObj, field) => ({
        ...aggregatedObj,
        [field]: false
    }), {});
    return create((set, get) => ({
        locale,
        setLocale: (locale) => set(() => ({ locale })),
        isValid: () => {
            const { valid } = get();
            return Object
                .keys(form)
                .map(field => valid[field])
                .every(e => !!e);
        },
        reset: () => {
            set(({ initialValues }) => ({
                values: { ...initialValues },
                errors: getInitialErrors(),
            }));
            get().validate(true);
        },
        values: getInitialValues(),
        errors: getInitialErrors(),
        initialValues: getInitialValues(),
        valid: getInitialValidFlags(),
        onBlur: (field) => get().validate(false, [field]),
        onChange: (fieldValues) => {
            set(({ values }) => ({ values: { ...values, ...fieldValues } }));
            get().validate(true, [Object.keys(fieldValues)[0]]);
        },
        bind: Object
            .keys(form)
            .reduce((aggregatedObj, field) => ({
            ...aggregatedObj,
            [field]: {
                onBlur: () => get().onBlur(field),
                onChange: v => get().onChange({ [field]: v }),
                get value() {
                    return get().values[field];
                }
            }
        }), {}),
        validate: (silent = true, include = []) => {
            const { values } = get();
            for (let field in values) {
                if (include.length > 0 && include.indexOf(field) === -1) {
                    continue;
                }
                // region Collect validators for field
                let validators = [];
                if (form[field].required)
                    validators.push(requiredValidator);
                validators = [
                    ...validators,
                    ...form[field].rules || [],
                ];
                // endregion
                if (validators.length > 0) {
                    let fieldHasError = false;
                    for (let validator of validators) {
                        let validationResult = validator.call(this, values[field]);
                        if (validationResult !== true) {
                            fieldHasError = true;
                            set(({ valid, errors }) => ({
                                valid: { ...valid, [field]: false },
                                errors: { ...errors, [field]: silent ? null : validationResult }
                            }));
                            break;
                        }
                    }
                    if (!fieldHasError) {
                        set(({ errors, valid }) => ({
                            errors: { ...errors, [field]: null },
                            valid: { ...valid, [field]: true }
                        }));
                    }
                }
            }
        },
        setInitialValues: (values) => set(({ initialValues }) => ({
            initialValues: {
                ...initialValues,
                ...values,
            }
        })),
        hasModified: () => {
            const { values, initialValues } = get();
            return !Object
                .keys(values)
                .map(field => values[field] == initialValues[field])
                .every(isInitial => isInitial);
        },
        setValues: (newValues) => {
            set(({ values }) => ({
                values: {
                    ...values,
                    ...newValues,
                }
            }));
            get().validate(true, Object.keys(newValues));
        }
    }));
};
export const setDefaultLocale = (locale) => 
// @ts-ignore
window.___zustand_forms__default_locale = locale;
