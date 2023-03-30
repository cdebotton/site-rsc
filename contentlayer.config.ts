import {
	LocalDocument,
	defineDocumentType,
	makeSource,
} from 'contentlayer/source-files';
import readingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export let Code = defineDocumentType(() => {
	return {
		name: 'Code',
		filePathPattern: 'code/**/*.mdx',
		contentType: 'mdx',
		fields: {
			title: {
				type: 'string',
				required: true,
			},
			published: {
				type: 'date',
				required: true,
			},
			preview: {
				type: 'string',
				required: true,
			},
			tags: {
				type: 'list',
				of: { type: 'string' },
				required: true,
			},
		},
		computedFields: {
			slug: {
				type: 'string',
				resolve: (doc: LocalDocument) => '/' + doc._raw.flattenedPath,
			},
			readingTime: {
				type: 'number',
				resolve: (doc) => readingTime(doc.body.raw).minutes,
			},
		},
	};
});

export default makeSource({
	contentDirPath: 'content',
	documentTypes: [Code],
	mdx: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [
			rehypeSlug,
			[
				rehypePrettyCode,
				{
					theme: 'poimandres',
					keepBackground: true,
					onVisitLine(node: any) {
						// Prevent lines from collapsing in `display: grid` mode, and
						// allow empty lines to be copy/pasted
						if (node.children.length === 0) {
							node.children = [{ type: 'text', value: ' ' }];
						}
					},
					onVisitHighlightedWord(node: any, id: string) {
						node.properties.className = ['word'];

						// `id` will be either 'v', 's', or 'i'.
						// State (v)alue, (s)etter, and (i)nitial value
						if (id) {
							const backgroundColor = {
								v: 'rgb(196 42 94 / 59%)',
								s: 'rgb(0 103 163 / 56%)',
								i: 'rgb(100 50 255 / 35%)',
							}[id];

							const color = {
								v: 'rgb(255 225 225 / 100%)',
								s: 'rgb(175 255 255 / 100%)',
								i: 'rgb(225 200 255 / 100%)',
							}[id];

							// If the word spans across syntax boundaries (e.g. punctuation), remove
							// colors from the child nodes.
							if (node.properties['data-rehype-pretty-code-wrapper']) {
								node.children.forEach((childNode: any) => {
									childNode.properties.style = '';
								});
							}

							node.properties.style = `background-color: ${backgroundColor}; color: ${color};`;
						}
					},
				},
			],
			[
				rehypeAutolinkHeadings,
				{
					properties: {
						className: 'anchor',
					},
				},
			],
		],
	},
});
