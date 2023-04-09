import { InitOptions } from 'i18next';
import { Language, Languages } from './languages';

export const fallbackLanguage = Languages.english.id;
export const defaultNamespace = 'default';
export const languages: Language[] = [
	fallbackLanguage,
	...(Object.values(Languages).filter(({ id }) => id !== Languages.english.id).map(({ id }) => id)),
];

export function getOptions(
	lang: Language = fallbackLanguage,
	ns: string | string[] = defaultNamespace,
): InitOptions {
	return {
		supportedLngs: languages,
		fallbackLng: fallbackLanguage,
		lng: lang,
		fallbackNS: defaultNamespace,
		defaultNS: defaultNamespace,
		ns,
	};
}
