import { cva, cx } from 'class-variance-authority';

import styles from './Button.module.css';

import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export default function Button({
	children,
	className,
	...props
}: DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
	return (
		<button {...props} className={cx(styles.button, className)}>
			{children}
		</button>
	);
}
