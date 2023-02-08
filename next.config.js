const ThreeMinifierPlugin = require('@yushijinhun/three-minifier-webpack');
const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	webpack: (config, { isServer, dev }) => {
		if (!isServer && !dev) {
			config.cache = false;
			const threeMinifier = new ThreeMinifierPlugin();
			config.plugins.unshift(threeMinifier);
			config.resolve.plugins.unshift(threeMinifier.resolver);
		}
		return config;
	},
};

module.exports = withContentlayer(nextConfig);
