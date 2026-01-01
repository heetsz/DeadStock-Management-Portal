/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: API calls now use NEXT_PUBLIC_API_BASE_URL directly in api.ts
  // Rewrites are kept for backward compatibility if needed
  async rewrites() {
    // Only use rewrites if NEXT_PUBLIC_API_BASE_URL is not set (local dev fallback)
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
    if (!apiBase || apiBase === 'http://localhost:8000') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/api/:path*',
        },
      ]
    }
    // For production, no rewrites needed - using full URL
    return []
  },
}

module.exports = nextConfig

