'use client';

import type { DetailedHTMLProps, HTMLAttributes } from 'react';

import { ThemeContext } from '@/components/ThemeProvider';

export default function ThemedHtml({
	children,
	...props
}: DetailedHTMLProps<HTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>) {
	let theme = ThemeContext.useSelector((state) => state.context.theme);
	return (
		<html data-theme={theme} {...props}>
			{children}
		</html>
	);
}
