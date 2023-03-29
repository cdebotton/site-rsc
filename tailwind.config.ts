import * as radixColors from '@radix-ui/colors';
import kebabCase from 'kebab-case';

import type { Config } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./src/app/**/*.{js,ts,jsx,tsx}',
	],
	future: {
		hoverOnlyWhenSupported: true,
	},
	theme: {
		colors: Object.fromEntries(
			Object.entries(radixColors)
				.filter(([color]) => !color.endsWith('A'))
				.map(([color, weights]) => [
					kebabCase(color),
					Object.fromEntries(
						Object.entries(weights).map(([weight, value]) => [
							weight.match(/(\d+)$/)?.[0],
							value,
						]),
					),
				]),
		),
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
		},
	},
	plugins: [
		require('@tailwindcss/container-queries'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
	],
};

export default config;
