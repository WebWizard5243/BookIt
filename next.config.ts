// next.config.js or next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
    // or simpler legacy:
    // domains: ['res.cloudinary.com']
  },
}
module.exports = nextConfig
