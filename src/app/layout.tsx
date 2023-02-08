import './globals.css';
import { Inter } from '@next/font/google';
import { cx } from 'class-variance-authority';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import Link from 'next/link';

import ThemedHtml from './ThemedHtml';
import styles from './layout.module.css';

import type { ReactNode } from 'react';

import GithubIcon from '@/components/GithubIcon';
import GlassIcon from '@/components/GlassIcon';
import LinkedinIcon from '@/components/LinkedinIcon';
import Logo from '@/components/Logo';
import MastodonIcon from '@/components/MastodonIcon';
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
						<header className={cx(styles.header, styles.center)}>
							<Link style={{ textDecoration: 'none' }} href="/">
								<Logo />
							</Link>
						</header>
						<main className={cx(styles.center)}>{children}</main>
						<footer className={cx(styles.center, styles.footer)}>
							<nav className={styles.social}>
								<ul>
									<li>
										<SocialLink href="https://github.com/cdebotton">
											<GithubIcon />
										</SocialLink>
									</li>
									<li>
										<SocialLink href="https://linkedin.com/in/christiandebotton">
											<LinkedinIcon />
										</SocialLink>
									</li>
									<li>
										<SocialLink href="https://glass.photo/cdb">
											<GlassIcon />
										</SocialLink>
									</li>
									<li>
										<SocialLink href="https://mas.to/@cdebotton">
											<MastodonIcon />
										</SocialLink>
									</li>
								</ul>
							</nav>
							<ThemeToggle />
						</footer>
					</div>
				</body>
			</ThemedHtml>
		</ThemeProvider>
	);
}

function SocialLink({
	children,
	href,
}: {
	children?: ReactNode;
	href: string;
}) {
	return (
		<a
			className={styles.socialLink}
			target="_blank"
			rel="noreferrer"
			href={href}
		>
			{children}
		</a>
	);
}
