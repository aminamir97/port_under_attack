/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/intro',
      },
    ];
  },
  /* config options here */
  devIndicators: false
};

export default nextConfig;
