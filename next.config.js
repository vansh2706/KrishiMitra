/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['winston'],
    },
    images: {
        unoptimized: true,
    },
    // For dynamic deployment - comment out for static export
    // output: 'export',
    // trailingSlash: true,
    // Base path for deployment
    // basePath: process.env.NODE_ENV === 'production' ? '/krishimitra' : '',
    // assetPrefix: process.env.NODE_ENV === 'production' ? '/krishimitra' : '',
}

module.exports = nextConfig