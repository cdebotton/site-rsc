import './globals.css';
import { Inter } from '@next/font/google';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';

import ThemedHtml from './ThemedHtml';
import styles from './layout.module.css';

import Logo from '@/components/Logo';
import ThemeProvider from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import { parseTheme } from '@/lib/theme';

const inter = Inter({ subsets: ['latin'] });

let DynamicBackground = dynamic(
	() => import('@/components/DynamicBackground'),
	{ ssr: false },
);

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	let theme = parseTheme(cookies().get('theme')?.value);

	return (
		<ThemeProvider initialTheme={theme}>
			<ThemedHtml className={inter.className} lang="en">
				<head />
				<body>
					<DynamicBackground style={{ position: 'fixed', inset: 0 }} />
					<div className={styles.container}>
						<header>
							<Logo />
						</header>
						{children}
						<footer>
							<ThemeToggle />
						</footer>
					</div>
				</body>
			</ThemedHtml>
		</ThemeProvider>
	);
}
