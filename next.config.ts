/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    basePath: process.env.NODE_ENV === 'production' ? '/trieddating' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/trieddating/' : '',
}

module.exports = nextConfig

export default nextConfig;
