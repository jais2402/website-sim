import type { ReactNode } from 'react'
import { InnerShell } from '@/cinema/InnerShell'

// Release states are date-driven, so refresh hourly.
export const revalidate = 3600

/** Every page except the homepage uses the same cinema shell as the homepage. */
export default function InnerLayout({ children }: { children: ReactNode }) {
  return <InnerShell>{children}</InnerShell>
}
