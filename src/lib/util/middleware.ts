import { fallbackLanguage } from '@/lib/i18n/settings';
import { NextRequest } from 'next/server';

const langRegex = /^\s*[^\s\-;]+(?:-[^\s;]+)?/;

function getLanguagesFromHeaders(headers: NextRequest['headers']): string[] {
	const acceptLangHeader = headers.get('Accept-Language');
	if (!acceptLangHeader) return [fallbackLanguage];

	const acceptedLangs = acceptLangHeader.split(',');

	const parsedLanguages: string[] = [];
	for (let i = 0; i < acceptedLangs.length; i++) {
		const matches = langRegex.exec(acceptedLangs[i]);
		if (matches) parsedLanguages.push(matches[0]);
	}

	return parsedLanguages;
}

export default getLanguagesFromHeaders;
