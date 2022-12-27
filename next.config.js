// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	// output: 'standalone',
	experimental: {
		appDir: true,
		// enableUndici: true,
	},
	images: {
		loader: 'custom',
		loaderFile: './lib/imageLoader.ts',
		unoptimized: true,
	}
};

module.exports = nextConfig;
