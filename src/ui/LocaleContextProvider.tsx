'use client';

import React, { useMemo, useState } from 'react';
import { LocaleContext } from 'contexts/LocaleContext';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getOptions } from 'lib/i18n/settings';
import resourcesToBackend from 'i18next-resources-to-backend';
import { Language } from 'lib/i18n/languages';

interface IProps {
	children: React.ReactNode
	lang: Language
}

i18next
	.use(initReactI18next)
	.use(
		resourcesToBackend(
			(lng: string, ns: string) => import(`../../public/locales/${lng}/${ns}.json`),
		),
	)
	.init({
		...getOptions(),
		lng: undefined,
		detection: {
			order: ['path', 'htmlTag', 'cookie', 'navigator'],
		},
	});

export default function LocaleContextProvider({ children, lang }: IProps) {
	const [locale] = useState(lang);

	const context = useMemo(() => {
		if (i18next.resolvedLanguage !== lang) {
			i18next.changeLanguage(lang);
		}
		return ({ locale });
	}, [lang]);

	return (
		<LocaleContext.Provider value={context}>
			{children}
		</LocaleContext.Provider>
	);
}
