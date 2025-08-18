import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],
  transpilePackages: ['@repo/db', '@repo/ui'],
  output: 'standalone', // 배포용
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // 프로덕션에서 console 제거
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
    optimizePackageImports: [
      'lodash',
      'date-fns',
      'react-icons',
      'lucide-react',
      '@radix-ui',
      '@tanstack',
      '@/components',
      '@/lib',
    ], // 패키지 트리쉐이킹
    webpackBuildWorker: true, // 빌드 속도 향상
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    imageSizes: [28, 40, 46, 58, 86, 120, 150, 172, 212, 256, 375],
    deviceSizes: [150, 375, 500],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    domains: ['simjfysftupqszgxkosk.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'simjfysftupqszgxkosk.supabase.co', // 새 프로젝트 추가
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            //MIME 타입 보호
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            //클릭재킹 방지
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            //XSS 보호
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        //폰트 캐싱
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // 정적 파일 캐싱
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client',
      });

      const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    // 번들 분석기 (프로덕션 빌드 시에만)
    if (!dev && !isServer && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: 'bundle-analyzer-report.html',
        })
      );
    }
    //React DevTools 비활성화
    if (!dev && !isServer) {
      const webpack = require('webpack');
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.DefinePlugin({
          __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
        })
      );
    }

    //React DOM 중복 제거 및 최적화
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-dom$': 'react-dom/client',
        'react-dom/client$': 'react-dom/client',
      };

      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 200000, // 200KB 제한
          cacheGroups: {
            // React 관련
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 50,
              enforce: true,
              reuseExistingChunk: true,
            },
            // Next.js 코어
            nextjs: {
              test: /[\\/]node_modules[\\/]next[\\/]/,
              name: 'nextjs',
              chunks: 'all',
              priority: 40,
            },
            // UI 라이브러리들
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|@formkit)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 30,
            },
            // 쿼리/상태관리
            query: {
              test: /[\\/]node_modules[\\/](@tanstack|zustand)[\\/]/,
              name: 'query',
              chunks: 'all',
              priority: 25,
            },
            // Supabase
            backend: {
              test: /[\\/]node_modules[\\/](@supabase)[\\/]/,
              name: 'backend',
              chunks: 'all',
              priority: 15,
            },
            // 기타 vendor
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              maxSize: 150000, // 150KB 제한
            },
            common: {
              minChunks: 2,
              chunks: 'all',
              name: 'common',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    config.watchOptions = {
      ignored: ['**/supabase/functions/**', '**/node_modules/**', '**/.next/**'],
    };

    return config;
  },
};

export default nextConfig;
