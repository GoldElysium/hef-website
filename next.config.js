// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	// output: 'standalone',
	experimental: {
		appDir: true,
		enableUndici: true,
	}
};

module.exports = nextConfig;
