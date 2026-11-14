import type { Metadata } from 'next'
import connect from '@content/connect.json'
import social from '@content/social.json'
import { site } from '@/lib/site'
import { Connect } from '@/sections/Connect/Connect'
import { SocialWall } from '@/sections/SocialWall/SocialWall'

export const metadata: Metadata = { title: 'Connect', description: connect.line }

export default function ConnectPage() {
  return (
    <>
      <Connect data={connect} email={site.email} as="h1" />
      <SocialWall data={social} />
    </>
  )
}
