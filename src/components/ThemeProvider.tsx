'use client';

import { createActorContext } from '@xstate/react';
import { ReactNode, useMemo } from 'react';
import { assign, createMachine } from 'xstate';

import { type Theme } from '@/lib/theme';

export let themeMachine = createMachine(
	{
		tsTypes: {} as import('./ThemeProvider.typegen').Typegen0,
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

export let ThemeContext = createActorContext(themeMachine);

export default function ThemeProvider({
	children,
	initialTheme,
}: {
	children?: ReactNode;
	initialTheme: Theme;
}) {
	let machine = useMemo(
		() => themeMachine.withContext({ theme: initialTheme }),
		[initialTheme],
	);

	return (
		<ThemeContext.Provider machine={machine}>{children}</ThemeContext.Provider>
	);
}
