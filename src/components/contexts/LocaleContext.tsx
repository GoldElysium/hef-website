'use client';

import { Language } from '@/lib/i18n/languages';
import { fallbackLanguage } from '@/lib/i18n/settings';
import React from 'react';

type LocaleContextType = {
	locale: Language;
};

export const LocaleContext = React.createContext<LocaleContextType>({
	locale: fallbackLanguage,
});

export const useLocale = () => React.useContext(LocaleContext);
