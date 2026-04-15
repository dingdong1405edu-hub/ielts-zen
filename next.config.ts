import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  typescript: { ignoreBuildErrors: false },
}

export default nextConfig
