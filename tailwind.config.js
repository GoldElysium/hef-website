function withOpacity(variableName) {
	return ({ opacityValue }) => {
		if (opacityValue !== undefined) {
			return `rgba(var(${variableName}), ${opacityValue})`
		}
		return `rgb(var(${variableName}))`
	}
}

module.exports = {
	mode: 'jit',
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			maxWidth: {
				'1/12': '8.333333%',
				'2/12': '16.666667%',
				'3/12': '25%',
				'4/12': '33.333333%',
				'5/12': '41.666667%',
				'6/12': '50%',
				'7/12': '58.333333%',
				'8/12': '66.666667%',
				'9/12': '75%',
				'10/12': '83.333333%',
				'11/12': '91.666667%',
			},
			gridTemplateColumns: {
				'submissionGrid': '100px auto',
			},
			textColor: {
				skin: {
					'primary-1': withOpacity('--color-primary-1'),
					'secondary-1': withOpacity('--color-secondary-1'),
					'dark-primary-1': withOpacity('--color-dark-primary-1'),
					'dark-secondary-1': withOpacity('--color-dark-secondary-1'),
				}
			},
			backgroundColor: {
				skin: {
					'background-1': withOpacity('--color-background-1'),
					'background-2': withOpacity('--color-background-2'),
					'card': withOpacity('--color-card'),
					'dark-background-1': withOpacity('--color-dark-background-1'),
					'dark-background-2': withOpacity('--color-dark-background-2'),
					'dark-card': withOpacity('--color-dark-card'),

					'primary-1': withOpacity('--color-primary-1'),
					'secondary-1': withOpacity('--color-secondary-1'),
					'dark-primary-1': withOpacity('--color-dark-primary-1'),
					'dark-secondary-1': withOpacity('--color-dark-secondary-1'),
				}
			},
			borderColor: {
				skin: {
					'primary-1': withOpacity('--color-primary-1'),
					'secondary-1': withOpacity('--color-secondary-1'),
					'dark-primary-1': withOpacity('--color-dark-primary-1'),
					'dark-secondary-1': withOpacity('--color-dark-secondary-1'),
				}
			},
			zIndex: {
				'-1': '-1',
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
	daisyui: {
		themes: [
			{
				hefs: {
					"primary": "#ef4444",
					"secondary": "#ff881a",
					"accent": "#0000ee",
					"neutral": "#ef4444",
					"base-100": "#fdecec",
				}
			},
			{
				"hefs-dark": {
					"primary": "#cf1717",
					"secondary": "#ff5500",
					"accent": "0000ee",
					"neutral": "#241e1e",
					"base-100": "#161212",
				}
			},
			{
				ina: {
					"primary": "#a04698",
					"secondary": "#f29a30",
					"accent": "#a04698",
					"neutral": "#4f445f",
					"base-100": "#f7f3fb",
				}
			},
			{
				"ina-dark": {
					"primary": "#ab6ea0",
					"secondary": "#e6850f",
					"accent": "#e6850f",
					"neutral": "#31273c",
					"base-100": "#131217",
				}
			},
			{
				calli: {
					"primary": "#70527a",
					"secondary": "#b2053b",
					"accent": "#b2053b",
					"neutral": "#9b4b6c",
					"base-100": "#fce9ee",
				}
			},
			{
				"calli-dark": {
					"primary": "#f5a3df",
					"secondary": "#db0a46",
					"accent": "#db0a46",
					"neutral": "#440d26",
					"base-100": "#1b0912",
				}
			},
			{
				gura: {
					"primary": "#2b9ea6",
					"secondary": "#ba4549",
					"accent": "#c84f53",
					"neutral": "#34749e",
					"base-100": "#f0f9ff",
				}
			},
			{
				"gura-dark": {
					"primary": "#098a95",
					"secondary": "#d93036",
					"accent": "#d93036",
					"neutral": "#0f212e",
					"base-100": "#050b0f",
				}
			},
			{
				kiara: {
					"primary": "#cc7a00",
					"secondary": "#149472",
					"accent": "#00805e",
					"neutral": "#cc411e",
					"base-100": "#ffffff",
				}
			},
			{
				"kiara-dark": {
					"primary": "#e68319",
					"secondary": "#17d3b7",
					"accent": "#17d3b7",
					"neutral": "#431302",
					"base-100": "#0f0000",
				}
			},
			{
				ame: {
					"primary": "#844339",
					"secondary": "#1282a1",
					"accent": "#1282a1",
					"neutral": "#a45c46",
					"base-100": "#fff7eb",
				}
			},
			{
				"ame-dark": {
					"primary": "#fbe0b5",
					"secondary": "#0092cc",
					"accent": "#0092cc",
					"neutral": "#362117",
					"base-100": "#150d0a",
				}
			},
			{
				irys: {
					"primary": "#b51d64",
					"secondary": "#e70c53",
					"accent": "#e70c53",
					"neutral": "#6a0444",
					"base-100": "#f6f3f7",
				}
			},
			{
				"irys-dark": {
					"primary": "#db2c6c",
					"secondary": "#b725cb",
					"accent": "#ce53df",
					"neutral": "#661545",
					"base-100": "#1c1a1d",
				}
			},
			{
				fauna: {
					"primary": "#00a193",
					"secondary": "#db1774",
					"accent": "#db1774",
					"neutral": "#578e3e",
					"base-100": "#f9fff7",
				}
			},
			{
				"fauna-dark": {
					"primary": "#8bcc8d",
					"secondary": "#00a826",
					"accent": "#ffc9b8",
					"neutral": "#255444",
					"base-100": "#0c1c1c",
				}
			},
			{
				sana: {
					"primary": "#ff47aa",
					"secondary": "#ff8010",
					"accent": "#4b1fff",
					"neutral": "#6523e2",
					"base-100": "#fff8f2",
				}
			},
			{
				"sana-dark": {
					"primary": "#ff1f96",
					"secondary": "#ff8010",
					"accent": "#ffd587",
					"neutral": "#6918b5",
					"base-100": "#060227",
				}
			},
			{
				mumei: {
					"primary": "#a84d4f",
					"secondary": "#438689",
					"accent": "#008a8f",
					"neutral": "#9e786b",
					"base-100": "#fffdfc",
				}
			},
			{
				"mumei-dark": {
					"primary": "#bfa39b",
					"secondary": "#438689",
					"accent": "#e59e6b",
					"neutral": "#4f3731",
					"base-100": "#2e2523",
				}
			},
			{
				kronii: {
					"primary": "#353535",
					"secondary": "#2749ad",
					"accent": "#156bcf",
					"neutral": "#5d617a",
					"base-100": "#fafaff",
				}
			},
			{
				"kronii-dark": {
					"primary": "#eff3fa",
					"secondary": "#2f4dc6",
					"accent": "#72dffd",
					"neutral": "#474959",
					"base-100": "#1c1c21",
				}
			},
			{
				bae: {
					"primary": "#3e393d",
					"secondary": "#06a296",
					"accent": "#d91b11",
					"neutral": "#a11a14",
					"base-100": "#fbfaff",
				}
			},
			{
				"bae-dark": {
					"primary": "#f0f0f0",
					"secondary": "#1b8578",
					"accent": "#ffdb49",
					"neutral": "#7a0400",
					"base-100": "#232323",
				}
			},
		],
	},
};
