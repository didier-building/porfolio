/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Remove static export for now to enable API routes
  // output: 'export',
  // trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Disable external font optimization to avoid build issues
  optimizeFonts: false,
}

module.exports = nextConfig