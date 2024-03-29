import { allCodes } from 'contentlayer/generated';

import { notFound } from 'next/navigation';
import { useMDXComponent } from 'next-contentlayer/hooks';

export default function CodePage({ params }: { params: { post: string } }) {
	let post = allCodes.find((post) => post.slug === '/code/' + params.post);

	if (!post) {
		notFound();
	}

	const Page = useMDXComponent(post.body.code);

	return (
		<div>
			<h2>Code</h2>
			<Page />
		</div>
	);
}
