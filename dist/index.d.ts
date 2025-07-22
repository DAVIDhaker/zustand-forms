import { UseBoundStore, StoreApi } from "zustand";
import { Locale } from "./locale/type";
import { FormCreatorArgs, FormSettingsType, FormType } from './types';
/**
 * Generate form validation zustand store
 *
 * @param form Form validation definition
 * @param settings Settings for form
 */
export declare const createFormValidator: <T extends object>(form: FormCreatorArgs<T>, settings?: FormSettingsType) => UseBoundStore<StoreApi<FormType<T>>>;
export declare const setDefaultLocale: (locale: Locale) => "en" | "ru";
