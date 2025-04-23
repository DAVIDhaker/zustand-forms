import * as locale from './locale';
/**
 * Translate alias to localized string
 * @param alias
 */
export function _(alias) {
    // @ts-ignore
    return locale[this?.locale || window.___zustand_forms__default_locale || 'en'][alias];
}
