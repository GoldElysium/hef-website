/**
 * Add new languages here
 *
 * Icons: https://cdnjs.com/libraries/twemoji/14.0.2
 */
export const Languages = {
	english: {
		id: 'en',
		name: 'English',
		icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ec-1f1e7.svg',
	},
	japanese: {
		id: 'jp',
		name: '日本語',
		icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ef-1f1f5.svg',
	},
} as const;

export type Language = typeof Languages[keyof typeof Languages]['id'];
