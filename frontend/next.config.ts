import type { NextConfig } from 'next'
import dns from 'node:dns'
import path from 'node:path'

dns.setDefaultResultOrder('ipv4first')

const isProduction = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  images: {
    //
    // Add your frontend domain here
    //
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lebobeautyco.dynv6.net',
        pathname: '**',
      },
    ],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ':lebobeautyco-types': path.resolve(__dirname, '../packages/lebobeautyco-types'),
      ':lebobeautyco-helper': path.resolve(__dirname, '../packages/lebobeautyco-helper'),
      ':reactjs-social-login': path.resolve(__dirname, '../packages/reactjs-social-login'),
    }
    // Ensure packages can be resolved as modules
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, '../packages'),
    ]
    return config
  },
  turbopack: {
    root: path.resolve(__dirname, '..'), // Set root to monorepo root
    resolveAlias: {
      ':lebobeautyco-types': path.resolve(__dirname, '../packages/lebobeautyco-types'),
      ':lebobeautyco-helper': path.resolve(__dirname, '../packages/lebobeautyco-helper'),
      ':reactjs-social-login': path.resolve(__dirname, '../packages/reactjs-social-login'),
    },
  },
  //
  // Nginx will do gzip compression. We disable
  // compression here so we can prevent buffering
  // streaming responses
  //
  compress: false,
  //
  // Add your frontend domain here
  //
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost', 'lebobeautyco.dynv6.net:8002'],
    },
    // workerThreads: false,
  },
  reactCompiler: true,
  logging: {
    fetches: {
      fullUrl: !isProduction,
    },
  },
}

export default nextConfig
