import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { GuestbookClient } from './page.client'

export default async function GuestbookPage() {
    const headers = await getHeaders()
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { user } = await payload.auth({ headers })

    if (!user) {
        redirect('/admin/login?redirect=/guestbook')
    }

    return <GuestbookClient />
}
