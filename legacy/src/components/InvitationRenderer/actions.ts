'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

export const updateGuestStatus = async (guestId: string, status: 'confirmed' | 'declined') => {
  const payload = await getPayload({ config })

  try {
    await payload.update({
      collection: 'guests',
      id: guestId,
      data: {
        status,
      },
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating RSVP:', error)
    return { success: false, error: 'Failed to update status' }
  }
}
