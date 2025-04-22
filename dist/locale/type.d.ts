export type Localization = {
    field_required_error: string;
    invalid_email_error: string;
};
import * as locales from './';
export type Locale = keyof typeof locales;
export declare const AVAILABLE_LOCALES: string[];
