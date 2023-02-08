'use client';

import NextImage from 'next/image';
import { notFound } from 'next/navigation';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { z } from 'zod';

import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react';

import { getBlogPostBySlug } from '@/lib/docs';

export default function BlogPage({ params }: { params: { slug: string } }) {
	let post = getBlogPostBySlug(params.slug);

	if (!post) {
		notFound();
	}

	let Component = useMDXComponent(post.body.code);

	return (
		<div>
			<Component components={{ Image }} />
		</div>
	);
}

let ImageSchema = z.object({
	src: z.string(),
	alt: z.string(),
	width: z.string(),
	height: z.string(),
});

function Image(
	props: DetailedHTMLProps<
		ImgHTMLAttributes<HTMLImageElement>,
		HTMLImageElement
	>,
) {
	let { src, alt, width, height } = ImageSchema.parse(props);

	return (
		<NextImage
			sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
			src={src}
			alt={alt}
			width={parseInt(width)}
			height={parseInt(height)}
		/>
	);
}
