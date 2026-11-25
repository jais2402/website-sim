import type { Metadata } from 'next'
import connect from '@content/connect.json'
import site from '@content/site.json'
import social from '@content/social.json'
import { PageTitle } from '@/cinema/PageTitle'
import { EnquiryForm } from '@/cinema/pages/connect/EnquiryForm'
import { Moments } from '@/cinema/scenes/Moments'

export const metadata: Metadata = { title: 'Connect', description: connect.line }

export default function ConnectPage() {
  return (
    <>
      <PageTitle title="Connect" kicker="Press · Brands · Professional enquiries" lede={connect.line} image="/media/photos/event-2.webp" imagePosition="50% 30%" />
      <EnquiryForm line={connect.line} enquiryTypes={connect.enquiryTypes} email={site.email} />
      <Moments posts={social.posts.slice(0, 4)} profiles={social.follow.profiles} xProfile={social.xProfile} />
    </>
  )
}
