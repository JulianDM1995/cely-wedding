import ParallaxPhoto from '@/components/ParallaxPhoto'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { decryptGuestId } from '../../../utilities/guestToken'


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
  const guestId = decryptGuestId(decodeURIComponent(token))

  if (!guestId) {
    return {
      title: 'Invitación inválida'
    }
  }

  const guest = await payload.findByID({
    collection: 'guests',
    id: guestId,
  })

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
      images: guest.profilePicture && typeof guest.profilePicture === 'object' && 'url' in guest.profilePicture
        ? [(guest.profilePicture as any).url]
        : []
    }
  }
}
export default async function GuestPage({ searchParams }: Props) {
  const { token } = await searchParams
  const payload = await getPayload({ config: configPromise })

  if (!token) {
    return notFound()
  }

  const guestId = decryptGuestId(decodeURIComponent(token))

  if (!guestId) {
    return notFound()
  }

  const guest = await payload.findByID({
    collection: 'guests',
    id: guestId,
  })

  if (!guest) {
    return notFound()
  }

  return (
    <div style={{ height: '100dvh', width: '100%' }}>
      <ParallaxPhoto guest={guest} />
    </div>
  )
}

