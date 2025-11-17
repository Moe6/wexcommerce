import type { NextConfig } from 'next'
import dns from 'node:dns'
import path from 'node:path'

dns.setDefaultResultOrder('ipv4first')

const isProduction = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  // Transpile packages from monorepo to ensure they're processed correctly
  transpilePackages: ['reactjs-social-login', 'lebobeautyco-types', 'lebobeautyco-helper'],
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
      '@': path.resolve(__dirname, './src'),
      '@/': `${path.resolve(__dirname, './src')}/`,
      ':lebobeautyco-types': path.resolve(__dirname, '../packages/lebobeautyco-types'),
      ':lebobeautyco-helper': path.resolve(__dirname, '../packages/lebobeautyco-helper'),
      ':reactjs-social-login': path.resolve(__dirname, '../packages/reactjs-social-login/dist/src'),
    }
    // Ensure packages can be resolved as modules
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, '../packages'),
    ]
    // Ensure webpack resolves package.json main field correctly
    config.resolve.mainFields = ['main', 'module', 'browser', ...(config.resolve.mainFields || [])]
    return config
  },
  turbopack: {
    root: path.resolve(__dirname, '..'), // Set root to monorepo root
    resolveAlias: {
      '@': path.resolve(__dirname, './src'),
      '@/': `${path.resolve(__dirname, './src')}/`,
      ':lebobeautyco-types': path.resolve(__dirname, '../packages/lebobeautyco-types'),
      ':lebobeautyco-helper': path.resolve(__dirname, '../packages/lebobeautyco-helper'),
      // Point directly to the built index.js file - Turbopack needs the full path
      ':reactjs-social-login': path.resolve(__dirname, '../packages/reactjs-social-login/dist/src'),
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
  },
  reactCompiler: true,
  logging: {
    fetches: {
      fullUrl: !isProduction,
    },
  },
}

export default nextConfig
