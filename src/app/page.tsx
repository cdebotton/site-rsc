import { allDocuments } from 'contentlayer/generated';

import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { Fragment } from 'react';

export default function Home() {
	// Sort posts by date, newest first
	let posts = allDocuments.sort((a, b) => (a.published < b.published ? -1 : 1));

	return (
		<>
			{posts.map((post) => {
				return (
					<Fragment key={post._id}>
						<h2 className="inline-flex flex-col pb-4 pt-8 text-3xl/snug font-semibold">
							<Link href={post.slug}>{post.title}</Link>
							<time className="text-slate-11 text-sm" dateTime={post.published}>
								{formatDistance(new Date(post.published), new Date(), {
									addSuffix: true,
								})}
							</time>
						</h2>
						<p>{post.preview}</p>
					</Fragment>
				);
			})}
		</>
	);
}
