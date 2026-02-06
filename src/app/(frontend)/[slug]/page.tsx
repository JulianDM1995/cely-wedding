import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { PageClient } from './page.client'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function GuestPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs: guests } = await payload.find({
    collection: 'guests',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 1,
    limit: 1,
  })

  const guest = guests[0]

  if (!guest) {
    notFound()
  }

  return <PageClient guest={guest} />
}
