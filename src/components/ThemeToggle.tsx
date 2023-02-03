'use client';

import Button from './Button';
import { ThemeContext } from './ThemeProvider';

export default function ThemeToggle() {
	let [state, send] = ThemeContext.useActor();

	let label: string;
	if (state.context.theme === 'VAPORWAVE') {
		label = 'EVA-02';
	} else {
		label = 'Vaporwave';
	}

	function handleClick() {
		send({ type: 'TOGGLE_THEME' });
	}

	return <Button onClick={handleClick}>{label}</Button>;
}
