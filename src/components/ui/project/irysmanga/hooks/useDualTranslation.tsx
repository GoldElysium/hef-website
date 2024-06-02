import { useCallback, useEffect, useState } from 'react';
import useTranslation from '@/lib/i18n/client';
import { Language } from '../utils/types';

const useDualTranslation = (mangaLanguage: Language) => {
	const { i18n } = useTranslation('reader');
	const [translationData, setTranslationData] = useState(
		i18n.getDataByLanguage(mangaLanguage),
	);
	useEffect(() => {
		setTranslationData(i18n.getDataByLanguage(mangaLanguage));
	}, [mangaLanguage, i18n]);

	useEffect(() => {
		i18n.loadLanguages('jp');
	}, [i18n]);
	const tManga = useCallback(
		(key: string) => (translationData ? translationData.reader[key] : key),
		[translationData],
	);

	return tManga;
};

export default useDualTranslation;
