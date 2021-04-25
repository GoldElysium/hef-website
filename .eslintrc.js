module.exports = {
	extends: '@ijsto',
	rules: {
		"no-tabs": 0,
		indent: [2, 'tab'],
		"sort-keys": 0,
		'prettier/prettier': ['off', {
			useTabs: false
		}],
		"react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".tsx"] }],
	}
}