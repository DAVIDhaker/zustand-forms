export type Localization = {
    field_required_error: string
    invalid_email_error: string
}

import * as locales from './'

export type Locale = keyof typeof locales

export const AVAILABLE_LOCALES = Object.keys(locales)