'use server'

import { generateAccessLinkEmail } from '@/email/accessLink'
import config from '@/payload.config'
import { signGuestAccessToken } from '@/utilities/tokens'
import { getPayload } from 'payload'

export const sendGuestAccessEmail = async (guestId: string) => {
  try {
    const payload = await getPayload({ config })

    // 1. Fetch Guest
    const guest = await payload.findByID({
      collection: 'guests',
      id: guestId,
    })

    if (!guest || !guest.email) {
      return { success: false, error: 'Guest not found or no email' }
    }

    // 2. Generate Token
    const token = signGuestAccessToken(guest.id)
    const accessLink = `${process.env.NEXT_PUBLIC_APP_URL}/new-message?token=${token}`

    // 3. Send Email or Log
    const emailData = await generateAccessLinkEmail({
      guestName: guest.name || 'Guest',
      guestEmail: guest.email,
      accessLink,
    })

    if (!process.env.RESEND_API_KEY && !process.env.SENDGRID_API_KEY) {
      console.log('--- EMAIL SIMULATION (No API Key) ---')
      console.log('To:', guest.email)
      console.log('Subject:', emailData.subject)
      console.log('Link:', accessLink)
      console.log('HTML (Preview):', emailData.html?.substring(0, 100) + '...')
      console.log('-------------------------------------')
    } else {
      await payload.sendEmail(emailData)
    }

    // Update Global owner for "Live Read" status
    try {
        await payload.updateGlobal({
            slug: 'new-guest-message' as any,
            data: {
                owner: guest.id,
            },
        })
    } catch (e) {
        console.error('Error updating global:', e)
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending access email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
