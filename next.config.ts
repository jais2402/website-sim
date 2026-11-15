import type { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  // Not for search engines yet: also covers non-HTML responses. See src/app/layout.tsx.
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
  },
}

export default config
