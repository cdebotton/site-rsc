import { assign, createMachine } from 'xstate';
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

export let themeMachine = createMachine(
	{
		tsTypes: {} as import('./theme.typegen').Typegen0,
		schema: {
			context: {} as { theme: Theme },
			events: {} as { type: 'TOGGLE_THEME' },
		},
		predictableActionArguments: true,
		context: {
			theme: 'VAPORWAVE',
		},
		on: {
			TOGGLE_THEME: {
				actions: ['toggleTheme', 'syncStorage'],
			},
		},
	},
	{
		actions: {
			toggleTheme: assign({
				theme: (ctx) => (ctx.theme === 'EVA-02' ? 'VAPORWAVE' : 'EVA-02'),
			}),
			syncStorage: (ctx) => (document.cookie = `theme=${ctx.theme};Path=/`),
		},
	},
);
