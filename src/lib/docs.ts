import { allBlogPosts } from 'contentlayer/generated';

interface SearchOptions {
	skip?: number;
	limit?: number;
}

export function getBlogPosts({ skip, limit }: SearchOptions = {}) {
	return allBlogPosts
		.filter((post) => new Date(post.date) < new Date())
		.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1))
		.slice(skip, limit);
}

export function getBlogPostBySlug(slug: string) {
	let post = allBlogPosts.find((p) => p.slug === `blog/${slug}`);

	if (!post) {
		throw new Error('Not found');
	}

	return post;
}
