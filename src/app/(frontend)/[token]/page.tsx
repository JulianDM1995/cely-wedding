import { InvitationRenderer } from '@/components/InvitationRenderer'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { decryptGuestId } from '../../../utilities/guestToken'


interface Props {
  params: Promise<{
    token: string
  }>
}
export default async function GuestPage({ params }: Props) {
  const { token } = await params
  const payload = await getPayload({ config: configPromise })

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

