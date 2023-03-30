import { allDocuments, type DocumentTypes } from 'contentlayer/generated';

import { ClockIcon } from '@radix-ui/react-icons';
import { formatDistance, formatDuration, intervalToDuration } from 'date-fns';
import Link from 'next/link';
import { Fragment } from 'react';

export default function Home() {
	// Sort posts by date, newest first
	let posts = allDocuments.sort((a, b) => (a.published < b.published ? 1 : -1));

	return (
		<>
			{posts.map((post) => {
				return <Post key={post._id} post={post} />;
			})}
		</>
	);
}

function Post({ post }: { post: DocumentTypes }) {
	let publishedOn = formatDistance(new Date(post.published), new Date(), {
		addSuffix: true,
	});

	let readTime = formatDuration(
		intervalToDuration({
			start: 0,
			end: post.readingTime * 60 * 1000,
		}),
		{ format: ['hours', 'minutes', 'seconds'] },
	);

	return (
		<article>
			<header className="inline-flex flex-col gap-1 pb-4 pt-8">
				<h2 className="text-3xl/none font-semibold">
					<Link href={post.slug}>{post.title}</Link>
				</h2>
				<span className="text-sm font-normal text-slate-10">
					{readTime} to read{' '}
					<time className="text-slate-11" dateTime={post.published}>
						<ClockIcon className="inline align-middle" /> {publishedOn}
					</time>
				</span>
				<ul className="mb-2 flex gap-2">
					{post.tags.map((tag) => (
						<span
							key={`${post._id}-${tag}`}
							className="rounded-md bg-indigo-11 px-2 py-1 text-xs font-bold uppercase text-indigo-3"
						>
							{tag}
						</span>
					))}
				</ul>
			</header>
			<p>{post.preview}</p>
		</article>
	);
}
