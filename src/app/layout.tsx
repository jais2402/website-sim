import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import site from '@content/site.json'
import { SiteFooter } from '@/sections/SiteFooter/SiteFooter'
import './fonts.css'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://simran.actor'),
  title: { default: 'Simran — official site', template: '%s — Simran' },
  description: site.description,
  openGraph: { siteName: 'Simran', type: 'website', locale: 'en_IN' },
  // Keep the site out of search engines until launch. Remove this and the
  // X-Robots-Tag header in next.config.ts to allow indexing.
  robots: { index: false, follow: false },
}

export const viewport: Viewport = { themeColor: '#0a0a0a', colorScheme: 'dark' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
        <SiteFooter email={site.email} social={site.social} year={new Date().getFullYear()} />
      </body>
    </html>
  )
}
