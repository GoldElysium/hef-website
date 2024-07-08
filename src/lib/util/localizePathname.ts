import { Language } from '@/lib/i18n/languages';
import { languages } from '@/lib/i18n/settings';

/**
 * Prepend the locale to the provided path name.
 * @param lang The current locale
 * @param pathName A relative path name, or the current path name
 * @returns The pathname with the locale prefixed
 */
export default function localizePathname(lang: Language, pathName: string | null) {
	if (!pathName || pathName === '/') return `/${lang}`;

	if (languages.some((language) => pathName.startsWith(`/${language}/`) || pathName === `/${language}`)) {
		const segments = pathName.split('/');
		segments[1] = lang;
		return segments.join('/');
	}

	return `/${lang}${pathName}`;
}
