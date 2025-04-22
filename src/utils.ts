import {Localization} from "./locale/type";
import * as locale from './locale'


/**
 * Translate alias to localized string
 * @param alias
 */
export function _(alias: keyof Localization): string {
    // @ts-ignore
    return locale[this?.locale || window.___zustand_forms__default_locale || 'en'][alias]
}
