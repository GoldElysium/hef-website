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
					'link': withOpacity('--color-link'),
					'dark-primary-1': withOpacity('--color-dark-primary-1'),
					'dark-secondary-1': withOpacity('--color-dark-secondary-1'),
					'dark-link': withOpacity('--color-dark-link'),
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
					'link': withOpacity('--color-link'),
					'dark-primary-1': withOpacity('--color-dark-primary-1'),
					'dark-secondary-1': withOpacity('--color-dark-secondary-1'),
					'dark-link': withOpacity('--color-dark-link'),
				}
			},
			borderColor: {
				skin: {
					'primary-1': withOpacity('--color-primary-1'),
					'secondary-1': withOpacity('--color-secondary-1'),
					'link': withOpacity('--color-link'),
					'dark-primary-1': withOpacity('--color-dark-primary-1'),
					'dark-secondary-1': withOpacity('--color-dark-secondary-1'),
					'dark-link': withOpacity('--color-dark-link'),
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
	plugins: [require('daisyui')],
};
