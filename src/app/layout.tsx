import './globals.css';

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
			className={`${inter.className} grid h-full`}
			lang="en"
		>
			<body className="bg-[conic-gradient(from_0deg_at_0%_50%,var(--tw-gradient-stops))] from-violet-3 via-indigo-4 to-plum-4 to-50% pb-24 antialiased [background-attachment:fixed]">
				<div className="mx-auto mt-12 max-w-5xl pe-8 ps-8">
					<header className="flex items-baseline gap-4">
						<Logo />
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
		<Link className="mb-8 mt-0" href="/">
			<h1 className="inline-flex flex-col">
				<span
					lang="ja"
					className="ps-4 text-sm/none font-light tracking-widest text-slate-11"
				>
					クリスチャン・デボットン
				</span>
				<span className="animate-[bg-scroll-x_10s_linear_infinite_alternate] bg-gradient-to-r from-blue-9 via-purple-9 to-blue-9 bg-[size:400vw_400vh] bg-clip-text text-6xl/none font-extrabold tracking-tighter text-[transparent]">
					Christian de Botton<span className="text-indigo-12">.</span>
				</span>
			</h1>
			<ul className="flex gap-2 ps-4">
				{descriptors.map((descriptor) => {
					if (Array.isArray(descriptor)) {
						// Rotating descriptor
						// This should be a new client component since it'll use framer-motion.
					} else {
						return (
							<li key={descriptor} className="text-xl/none font-extralight">
								{descriptor}.
							</li>
						);
					}
				})}
			</ul>
		</Link>
	);
}
