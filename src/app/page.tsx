import { allDocuments, type DocumentTypes } from 'contentlayer/generated';

import { ClockIcon } from '@radix-ui/react-icons';
import { formatDistance, formatDuration, intervalToDuration } from 'date-fns';
import Link from 'next/link';

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
			<header>
				<h2>
					<Link href={post.slug}>{post.title}</Link>
				</h2>
				<span>
					{readTime} to read <ClockIcon height="1em" width="1em" />
					<time dateTime={post.published}>{publishedOn}</time>
				</span>
				<ul>
					{post.tags.map((tag) => (
						<span key={`${post._id}-${tag}`}>{tag}</span>
					))}
				</ul>
			</header>
			<p>{post.preview}</p>
		</article>
	);
}
