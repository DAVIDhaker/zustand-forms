import * as locale from './locale';
/**
 * Translate alias to localized string
 * @param alias
 */
export function _(alias) {
    // @ts-ignore
    return locale[(this === null || this === void 0 ? void 0 : this.locale) || window.___zustand_forms__default_locale || 'en'][alias];
}
