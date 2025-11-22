/** @type {import('next').NextConfig} */
const nextConfig = {
  // We removed the specific webpack rule for dhiwise to avoid errors for now, 
  // sticking to standard Next.js image patterns.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pixabay.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/homepage',
        permanent: false, // Redirect root to homepage like Rocket did
      },
    ];
  },
};

export default nextConfig;