import * as colors from '@radix-ui/colors';
import kebabCase from 'kebab-case';

let css = Object.entries(colors)
	.filter(([k]) => !k.endsWith('A') && k !== 'default')
	.flatMap(([color, weights]) => {
		return Object.entries(weights).map(([weight, hsl]) => {
			return `\t--${kebabCase(color)}-${weight.match(/(\d+)$/g)}: ${hsl};`;
		});
	})
	.join('\n');

process.stdout.write(`:root {
${css}
}`);
