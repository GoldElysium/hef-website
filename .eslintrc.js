module.exports = {
	extends: [
		'airbnb-typescript',
		'@ijsto',
	],
	parserOptions: {
		project: './tsconfig.json',
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	rules: {
		'no-tabs': 0,
		indent: 0,
		'sort-keys': 0,
		'prettier/prettier': [0, {
			useTabs: false
		}],
		'@typescript-eslint/indent': [2, 'tab'],
		'react/jsx-filename-extension': [1, {'extensions': ['.js', '.jsx', '.tsx']}],
		'import/extensions': 0,
		'import/no-unresolved': 0,
	}
}