'use server'

import config from '@/payload.config'
import { signGuestbookToken } from '@/utilities/tokens'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

export const getGuestbookToken = async () => {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  
  // Verify admin authentication
  const { user } = await payload.auth({ headers })
  
  if (!user) {
    throw new Error('Unauthorized')
  }

  return { token: signGuestbookToken() }
}

export const getGuestMessages = async () => {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const messages = await payload.find({
        collection: 'guest-messages' as any,
        sort: '-createdAt', // Newest first
        depth: 1,
        limit: 50, // Limit to recent 50
    })

    return messages.docs
}

export const getNewGuestMessageGlobal = async () => {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const global = await payload.findGlobal({
        slug: 'new-guest-message' as any,
        depth: 1,
    })

    return global
}
