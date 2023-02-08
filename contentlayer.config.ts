import { makeSource, defineDocumentType } from 'contentlayer/source-files';

export const BlogPost = defineDocumentType(() => {
	return {
		name: 'BlogPost',
		filePathPattern: 'blog/**/*.md',
		contentType: 'mdx',
		description: "It's a post",
		fields: {
			title: {
				type: 'string',
				required: true,
			},
			date: {
				type: 'date',
				required: true,
			},
			description: {
				type: 'string',
				required: true,
			},
		},
		computedFields: {
			slug: {
				type: 'string',
				resolve: (doc) => doc._raw.flattenedPath,
			},
		},
	};
});

export default makeSource({
	documentTypes: [BlogPost],
	contentDirPath: './content',
});
