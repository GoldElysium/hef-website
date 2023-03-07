import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import getLanguagesFromHeaders from 'lib/util/middleware';
import { fallbackLanguage, languages } from 'lib/i18n/settings';

function isValidLocale(pathName: string) {
	return languages.some(
		(locale) => pathName.startsWith(`/${locale}/`) || pathName === `/${locale}`,
	);
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (isValidLocale(pathname)) {
		return NextResponse.next();
	}

	const acceptedLanguages = getLanguagesFromHeaders(request.headers);
	const matchedLocale = match(acceptedLanguages, languages, fallbackLanguage);

	return NextResponse.redirect(
		new URL(`/${matchedLocale}/${pathname}`, request.url),
	);
}

export const config = {
	matcher: [
		// Paths to ignore
		'/((?!api|_next/static|_next/image|favicon.ico|sw.js|resize|assets|img|locales).*)',

		// Paths to check
		'/',
	],
};
