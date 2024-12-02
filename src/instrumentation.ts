/* eslint-disable max-len */
import * as Sentry from '@sentry/nextjs';

// eslint-disable-next-line import/prefer-default-export
export function register() {
	Sentry.init({
		dsn: 'https://c60cc8188e7048bbb010801cd280723d@o4505454619590656.ingest.sentry.io/4505454631124992',

		// Adjust this value in production, or use tracesSampler for greater control
		tracesSampleRate: 1,

		// Setting this option to true will print useful information to the console while you're setting up Sentry.
		debug: false,
	});
}
