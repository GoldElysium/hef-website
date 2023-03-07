import 'server-only';
import { createInstance, Namespace, KeyPrefix } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { defaultNamespace, getOptions } from './settings';
import { Language } from './languages';

const initI18next = async (lang: Language, namespace: string | string[]) => {
	const i18nInstance = createInstance();
	await i18nInstance
		.use(initReactI18next)
		.use(
			resourcesToBackend(
				(lng: string, ns: string) => import(`../../public/locales/${lng}/${ns}.json`),
			),
		)
		.init(getOptions(lang, namespace));
	return i18nInstance;
};

export default async function useTranslation<
	N extends Namespace,
	TKPrefix extends KeyPrefix<N>,
>(lang: Language, namespace?: N, keyPrefix?: TKPrefix) {
	const ns = Array.isArray(namespace) ? namespace[0] : namespace ?? defaultNamespace;
	const i18nextInstance = await initI18next(lang, ns);
	return {
		// @ts-expect-error
		// https://github.com/i18next/react-i18next/issues/1601
		t: i18nextInstance.getFixedT(lang, ns, keyPrefix),
		i18n: i18nextInstance,
	};
}
