/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'supabase.co', 'vlrhvkislotdojapkbnz.supabase.co'],
  },
  // 低内存优化配置
  experimental: {
    workerThreads: false,
    cpus: 1,
    forceSwcTransforms: false,
    // 减少内存使用
    esmExternals: 'loose',
  },
  // 内存优化的webpack配置
  webpack: (config, { dev, isServer }) => {
    // 限制并行处理，减少内存使用
    config.parallelism = 1;

    // 限制缓存大小
    if (config.cache && typeof config.cache === 'object') {
      config.cache.maxMemoryGenerations = 1;
    }

    if (dev) {
      // 减少监听的文件数量
      config.watchOptions = {
        poll: 2000, // 降低轮询频率
        aggregateTimeout: 500,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
        ],
      };

      // 禁用开发模式下的内存密集型优化
      config.optimization = {
        ...config.optimization,
        minimize: false,
        splitChunks: false,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        concatenateModules: false,
      };

      // 减少缓存大小
      config.infrastructureLogging = {
        level: 'warn',
      };
    }

    return config;
  },
  // 设置输出文件跟踪根目录
  outputFileTracingRoot: __dirname,
  // 禁用压缩以节省内存
  compress: false,
  // 减少构建时的内存使用
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 1分钟后释放内存
    pagesBufferLength: 2, // 只保持2个页面在内存中
  },
};

module.exports = nextConfig;