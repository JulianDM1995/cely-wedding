import config from '@/payload.config'
import { verifyGuestAccessToken } from '@/utilities/tokens'
import { getPayload } from 'payload'
import { NewMessageClient } from './page.client'

export default async function NewMessagePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { token } = await searchParams

    const guestId = typeof token === 'string' ? verifyGuestAccessToken(token) : null

    if (!token || !guestId) {
        return (
            <div className="flex items-center justify-center min-h-screen p-8 text-center text-red-500">
                <h1 className="text-xl font-bold">Invalid or Expired Link</h1>
                <p className="mt-2">Please request a new access link from the Guestbook station.</p>
            </div>
        )
    }

    const payload = await getPayload({ config })
    const guest = await payload.findByID({
        collection: 'guests',
        id: guestId,
    })

    if (!guest) {
        return (
            <div className="flex items-center justify-center min-h-screen p-8 text-center">
                <p>Guest profile not found.</p>
            </div>
        )
    }

    return <NewMessageClient guest={guest} token={token as string} />
}
