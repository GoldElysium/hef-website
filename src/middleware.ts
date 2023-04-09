import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import getLanguagesFromHeaders from 'lib/util/middleware';
import { fallbackLanguage, languages } from 'lib/i18n/settings';

function getLocaleFromPathname(pathName: string) {
	return languages.find(
		(locale) => pathName.startsWith(`/${locale}/`) || pathName === `/${locale}`,
	);
}

function getUnprefixedUrl(request: NextRequest) {
	const url = new URL(request.url);
	if (!url.pathname.endsWith('/')) {
		url.pathname += '/';
	}

	url.pathname = url.pathname.replace(
		new RegExp(`^/(${languages.join('|')})/`),
		'/',
	);

	// Remove trailing slash
	if (url.pathname !== '/') {
		url.pathname = url.pathname.slice(0, -1);
	}

	return url.toString();
}

function getAlternateEntry(url: string, locale: string) {
	return `<${url}>; rel="alternate"; hreflang="${locale}"`;
}

// https://developers.google.com/search/docs/specialty/international/localized-versions
function getAlternateLinksHeaderValue(request: NextRequest) {
	const unprefixedUrl = getUnprefixedUrl(request);

	const links = languages.map((language) => {
		const url = new URL(unprefixedUrl);
		if (url.pathname === '/') {
			// eslint-disable-next-line no-param-reassign
			url.pathname = `/${language}`;
		} else {
			// eslint-disable-next-line no-param-reassign
			url.pathname = `/${language}${url.pathname}`;
		}

		return getAlternateEntry(url.toString(), language);
	});

	const url = new URL(unprefixedUrl);
	url.pathname = '/en';
	links.push(getAlternateEntry(url.toString(), 'x-default'));

	return links.join(', ');
}

export function middleware(request: NextRequest) {
	let language;
	let response;

	const { nextUrl: { pathname }, cookies } = request;

	// First use route prefix
	if (pathname) {
		const pathLanguage = getLocaleFromPathname(pathname);
		if (pathLanguage) {
			response = NextResponse.next();
			language = pathLanguage;
		}
	}

	// If no prefix, try to find existing cookie
	if (!language && request.cookies) {
		if (cookies.has('NEXT_LOCALE')) {
			const value = cookies.get('NEXT_LOCALE')?.value;
			if (value && (languages as string[]).includes(value)) {
				language = value;
			}
		}
	}

	// Lastly try to use accept language header, otherwise fall back
	if (!language) {
		const acceptedLanguages = getLanguagesFromHeaders(request.headers);
		language = match(acceptedLanguages, languages, fallbackLanguage);
	}

	const hasOutdatedCookie = request.cookies.get('NEXT_LOCALE')?.value !== language;

	if (!response) {
		response = NextResponse.redirect(
			new URL(`/${language}/${pathname}`, request.url),
		);
	}

	if (hasOutdatedCookie) {
		response.cookies.set('NEXT_LOCALE', language);
	}

	response.headers.set(
		'Link',
		getAlternateLinksHeaderValue(request),
	);

	return response;
}

export const config = {
	matcher: [
		// Paths to ignore
		'/((?!api|_next/static|_next/image|favicon.ico|sw.js|resize|assets|img|locales|sitemap.xml|robots.txt).*)',

		// Paths to check
		'/',
	],
};
