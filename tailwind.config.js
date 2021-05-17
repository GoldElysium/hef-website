function withOpacity(variableName) {
	return ({ opacityValue }) => {
		if (opacityValue !== undefined) {
			return `rgba(var(${variableName}), ${opacityValue})`
		}
		return `rgb(var(${variableName}))`
	}
}

module.exports = {
	purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
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
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
