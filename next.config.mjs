/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'flagcdn.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'plus.unsplash.com' },
            { protocol: 'https', hostname: 't3.ftcdn.net' }, // Mock images
            { protocol: 'https', hostname: '**' } // Allow all for demo flexibility
        ],
    },
};

export default nextConfig;
