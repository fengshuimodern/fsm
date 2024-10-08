/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals = [...config.externals, { encoding: 'encoding' }];
    return config;
  },
  images: {
    domains: ['images.unsplash.com', 'firebasestorage.googleapis.com'],
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  output: 'export', // Added this line for Cloudflare Pages compatibility
};

export default nextConfig;