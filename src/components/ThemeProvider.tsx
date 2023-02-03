'use client';

import { createActorContext } from '@xstate/react';
import { ReactNode, useMemo } from 'react';

import { type Theme, themeMachine } from '@/lib/theme';

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
