const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
		mdxRs: true,
	},
};

module.exports = withContentlayer(nextConfig);
