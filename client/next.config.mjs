/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/graphql',
                destination: process.env.GRAPHQL_URL || "http://localhost:4000/graphql",
            },
        ]
    },
};

export default nextConfig;
