'use server'

import config from '@/payload.config'
import { verifyGuestAccessToken } from '@/utilities/tokens'
import { getPayload } from 'payload'

export const submitGuestMessage = async (formData: FormData, token: string) => {
  const guestId = verifyGuestAccessToken(token)

  if (!guestId) {
    return { success: false, error: 'Invalid or expired session' }
  }

  const message = formData.get('message') as string
  const file = formData.get('media') as File | null

  if (!message) {
    return { success: false, error: 'Message is required' }
  }

  try {
    const payload = await getPayload({ config })
    let mediaId = null

    // Handle File Upload
    if (file && file.size > 0) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
          return { success: false, error: 'File too large (max 10MB)' }
      }

      // Payload Local API create with 'file' property
      // We need to convert the File to a buffer ideally, or pass it if Payload supports it.
      // Payload 3.0 Local API supports `file` property which matches the structure { data: Buffer, name: string, mimetype: string, size: number }
      
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      const mediaDoc = await payload.create({
        collection: 'media',
        data: {
          alt: `Guest upload by ${guestId}`,
        },
        file: {
          data: buffer,
          name: file.name,
          mimetype: file.type,
          size: file.size,
        },
      })
      mediaId = mediaDoc.id
    }

    const newMessage = await payload.create({
      collection: 'guest-messages' as any,
      data: {
        owner: guestId,
        message,
        media: mediaId,
        status: 'draft', // Default to draft for moderation
        style: {}, // Placeholder for now
      },
    })

    // Update Global lastMessage for "Live Feed" status
    try {
        await payload.updateGlobal({
            slug: 'new-guest-message' as any,
            data: {
                lastMessage: newMessage.id,
            },
        })
    } catch (e) {
        console.error('Error updating global:', e)
    }

    return { success: true }
  } catch (error) {
    console.error('Error submitting message:', error)
    return { success: false, error: 'Failed to submit message' }
  }
}
