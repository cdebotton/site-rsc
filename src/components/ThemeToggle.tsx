'use client';

import Button from './Button';
import { ThemeContext } from './ThemeProvider';
import styles from './ThemeToggle.module.css';

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

	return (
		<Button className={styles.button} onClick={handleClick}>
			{label}
		</Button>
	);
}
