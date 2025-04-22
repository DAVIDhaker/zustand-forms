import { create } from "zustand";
import { requiredValidator } from "./validators";
import { AVAILABLE_LOCALES } from "./locale/type";
/**
 * Generate form validation zustand store
 *
 * @param form Form validation definition
 * @param settings Settings for form
 */
export const createFormValidator = (form, settings) => {
    var _a;
    let locale = ((settings === null || settings === void 0 ? void 0 : settings.locale) || ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.language) === null || _a === void 0 ? void 0 : _a.split('-')[0]) || 'en');
    if (AVAILABLE_LOCALES.indexOf(locale) === -1)
        locale = 'en';
    const getInitialValues = () => Object
        .keys(form)
        .reduce((aggregatedObj, field) => (Object.assign(Object.assign({}, aggregatedObj), { [field]: form[field].initialValue || '' })), {});
    const getInitialErrors = () => Object
        .keys(form)
        .reduce((aggregatedObj, field) => (Object.assign(Object.assign({}, aggregatedObj), { [field]: null })), {});
    const getInitialValidFlags = () => Object
        .keys(form)
        .reduce((aggregatedObj, field) => (Object.assign(Object.assign({}, aggregatedObj), { [field]: false })), {});
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
        reset: () => set(() => ({
            values: getInitialValues(),
            errors: getInitialErrors(),
            valid: getInitialValidFlags(),
        })),
        values: getInitialValues(),
        errors: getInitialErrors(),
        valid: getInitialValidFlags(),
        onBlur: (field) => get().validate(false, [field]),
        onChange: (fieldValues) => {
            set(({ values }) => ({ values: Object.assign(Object.assign({}, values), fieldValues) }));
            get().validate(true, [Object.keys(fieldValues)[0]]);
        },
        bind: Object
            .keys(form)
            .reduce((aggregatedObj, field) => (Object.assign(Object.assign({}, aggregatedObj), { [field]: {
                onBlur: () => get().onBlur(field),
                onChange: v => get().onChange({ [field]: v }),
            } })), {}),
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
                                valid: Object.assign(Object.assign({}, valid), { [field]: false }),
                                errors: Object.assign(Object.assign({}, errors), { [field]: silent ? null : validationResult })
                            }));
                            break;
                        }
                    }
                    if (!fieldHasError) {
                        set(({ errors, valid }) => ({
                            errors: Object.assign(Object.assign({}, errors), { [field]: null }),
                            valid: Object.assign(Object.assign({}, valid), { [field]: true })
                        }));
                    }
                }
            }
        }
    }));
};
export const setDefaultLocale = (locale) => 
// @ts-ignore
window.___zustand_forms__default_locale = locale;
