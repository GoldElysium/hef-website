
import { createContext } from 'react';

// WIP exparamental context that provides information about different platform
// features, such as webp support.

export const SupportContext = createContext({
	webp: (() => {
		if (/iP[ao]d|iPhone/i.test(navigator.userAgent)) {
			const match = (navigator.appVersion ?? '').match(/OS (\d+)/);
			if (match != null) {
				if (parseInt(match[1], 10) <= 14) {
					return false;
				}
			}
		}

		if (/([^l][^i][^k][^e])? Mac OS/.test(navigator.userAgent)) {
			if ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 2) {
				const match = (navigator.appVersion ?? '').match(/Version (\d+)/);
				if (match != null) {
					if (parseInt(match[1], 10) <= 14) {
						return false;
					}
				}
			}
		}

		return true;
	})(),
});

export default SupportContext;
