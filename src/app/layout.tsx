import './globals.css';

import NavLink from './nav-link';

import { Inter } from 'next/font/google';
import Link from 'next/link';

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
		<html className={`${inter.className} grid h-full`} lang="en">
			<body className="antialiased">
				<div className="mx-auto mt-12 max-w-5xl pe-8 ps-8">
					<header className="flex items-baseline gap-4">
						<h1 className="mb-8 mt-0 text-5xl/snug font-extrabold tracking-tight">
							<Link href="/">Christian de Botton</Link>
						</h1>
						<nav className="flex gap-2">
							<NavLink href="/code">Code</NavLink>
							<NavLink href="/photography">Photography</NavLink>
							<NavLink href="/video">Video</NavLink>
							<NavLink href="/about">About</NavLink>
						</nav>
					</header>
					{children}
				</div>
			</body>
		</html>
	);
}
