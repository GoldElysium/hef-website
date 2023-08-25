// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	images: {
		loader: 'custom',
		loaderFile: 'src/lib/imageLoader.ts',
		unoptimized: true,
	}
};

module.exports = nextConfig;
