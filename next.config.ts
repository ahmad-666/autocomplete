import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: []
    },
    experimental: {
        //largePageDataBytes: 20 * 128 * 1000 //2mb(default is 128kb) , tweak nextjs max allow size for props of pages
        //optimizePackageImports: ['package-name'] //only load the modules you are actually using
    }
};

export default nextConfig;
