/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dqw0yv1fe3cqf.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd334ncg5mcrstp.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
