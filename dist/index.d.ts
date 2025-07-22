import { UseBoundStore, StoreApi } from "zustand";
import { Locale } from "./locale/type";
import { FormCreatorArgs, FormSettingsType, FormType } from './types';
export type FormValidatorType<T> = UseBoundStore<StoreApi<FormType<T>>>;
/**
 * Generate form validation zustand store
 *
 * @param form Form validation definition
 * @param settings Settings for form
 */
export declare const createFormValidator: <T extends object>(form: FormCreatorArgs<T>, settings?: FormSettingsType) => FormValidatorType<T>;
export declare const setDefaultLocale: (locale: Locale) => "en" | "ru";
//# sourceMappingURL=index.d.ts.map