import './globals.css';
import styles from './layout.module.css';
import NavLink from './NavLink';

import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { z } from 'zod';

function getColorScheme() {
	let stored = cookies().get('color-scheme')?.value;

	if (!stored) {
		return 'eva-02';
	}

	try {
		let json = JSON.parse(stored);
		return z.union([z.literal('eva-02'), z.literal('vaporwave')]).parse(json);
	} catch {
		return 'eva-02';
	}
}

const inter = Inter({ subsets: ['latin'], weight: 'variable' });

export const metadata = {
	title: 'Christian de Botton',
	description: 'Software engineer based in San Francisco, California.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			data-color-scheme={getColorScheme()}
			className={inter.className}
			lang="en"
		>
			<body>
				<div className={styles.layout}>
					<header>
						<Logo />
						<nav>
							<NavLink href="/code">Code</NavLink>
							<NavLink href="/photography">Photography</NavLink>
							<NavLink href="/video">Video</NavLink>
						</nav>
					</header>
					{children}
				</div>
			</body>
		</html>
	);
}

function Logo() {
	let descriptors = [
		'Developer',
		'Photographer',
		['Videographer', 'Dog dad', 'Another thing!'],
	];

	return (
		<Link href="/">
			<h1>
				<span lang="ja">クリスチャン・デボットン</span>
				<span>
					Christian de Botton<span>.</span>
				</span>
			</h1>
			<ul>
				{descriptors.map((descriptor) => {
					if (Array.isArray(descriptor)) {
						// Rotating descriptor
						// This should be a new client component since it'll use framer-motion.
					} else {
						return <li key={descriptor}>{descriptor}.</li>;
					}
				})}
			</ul>
		</Link>
	);
}
