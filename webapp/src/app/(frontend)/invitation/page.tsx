import ParallaxPhoto from '@/components/ParallaxPhoto'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'


import { APP_NAME } from '@/constants'
import type { Metadata } from 'next'

interface Props {
  searchParams: Promise<{
    token?: string
  }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { token } = await searchParams

  if (!token) {
    return {
      title: 'Invitación no encontrada'
    }
  }

  const payload = await getPayload({ config: configPromise })

  let guest = null

  // Treat as short code
  const guests = await payload.find({
    collection: 'guests',
    where: {
      code: {
        equals: token,
      },
    },
    limit: 1,
  })

  if (guests.docs.length > 0) {
    guest = guests.docs[0]
  }

  if (!guest) {
    return {
      title: 'Invitación no encontrada'
    }
  }

  return {
    title: `${guest.name} | ${APP_NAME}`,
    description: `Invitación especial para ${guest.name}.`,
    openGraph: {
      title: `${guest.name} | ${APP_NAME}`,
      description: `Invitación especial para ${guest.name}.`,
    }
  }
}
export default async function GuestPage({ searchParams }: Props) {
  const { token } = await searchParams
  const payload = await getPayload({ config: configPromise })

  if (!token) {
    return notFound()
  }

  // Treat as short code
  const guests = await payload.find({
    collection: 'guests',
    where: {
      code: {
        equals: token,
      },
    },
    limit: 1,
  })

  let guest = null
  if (guests.docs.length > 0) {
    guest = guests.docs[0]
  }

  if (!guest) {
    return notFound()
  }

  // Fetch global config
  const personalization = await payload.findGlobal({
    slug: 'personalization',
  })

  const couple = {
    groom: personalization.couple?.groom || 'Juan',
    bride: personalization.couple?.bride || 'Tatiana'
  }

  return (
    <div style={{ height: '100dvh', width: '100%' }}>
      <ParallaxPhoto guest={guest} weddingDate={personalization.weddingDate} couple={couple} personalization={personalization} />
    </div>
  )
}

