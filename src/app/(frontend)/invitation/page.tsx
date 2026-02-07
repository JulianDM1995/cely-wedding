import { InvitationRenderer } from '@/components/InvitationRenderer'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { decryptGuestId } from '../../../utilities/guestToken'


interface Props {
  searchParams: Promise<{
    token?: string
  }>
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

  return <InvitationRenderer guest={guest} />
}

