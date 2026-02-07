import config from '@/payload.config'
import { verifyGuestbookToken } from '@/utilities/tokens'
import { getPayload } from 'payload'
import { SelectGuestClient } from './page.client'

export default async function SelectGuestPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { token } = await searchParams

    if (!token || typeof token !== 'string' || !verifyGuestbookToken(token)) {
        return (
            <div className="flex items-center justify-center min-h-screen p-8 text-center text-red-500">
                <h1 className="text-xl font-bold">Invalid or Expired Link</h1>
                <p className="mt-2">Please scan the QR code again.</p>
            </div>
        )
    }

    const payload = await getPayload({ config })

    // Update Global timestamp for "Live Read" status
    try {
        await payload.updateGlobal({
            slug: 'new-guest-message' as any,
            data: {
                lastTimeRead: new Date().toISOString(),
            },
        })
    } catch (e) {
        console.error('Error updating global:', e)
    }
    const { docs: guests } = await payload.find({
        collection: 'guests',
        limit: 1000, // Or implement pagination if needed, but for a wedding 1000 is usually enough
        sort: 'name',
        depth: 1, // Need profile pictures
    })

    return <SelectGuestClient guests={guests} />
}
