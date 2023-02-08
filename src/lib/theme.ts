import { z } from 'zod';

let ThemeSchema = z
	.union([z.literal('VAPORWAVE'), z.literal('EVA-02')])
	.default('VAPORWAVE');

export type Theme = z.infer<typeof ThemeSchema>;

export function parseTheme(input: string | null | undefined): Theme {
	try {
		return ThemeSchema.parse(input);
	} catch {
		return 'VAPORWAVE';
	}
}
