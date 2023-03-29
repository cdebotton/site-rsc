/** @type {import('prettier').Config} */
module.exports = {
	useTabs: true,
	trailingComma: 'all',
	singleQuote: true,
	plugins: [require('prettier-plugin-tailwindcss')],
};
