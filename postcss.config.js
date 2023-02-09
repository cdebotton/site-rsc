module.exports = {
	plugins: {
		'@csstools/postcss-global-data': {
			files: ['./src/lib/queries.css'],
		},
		'postcss-flexbugs-fixes': {},
		'postcss-preset-env': {
			autoprefixer: {
				flexbox: 'no-2009',
			},
			stage: 1,
			features: {
				'custom-properties': false,
			},
		},
	},
};
