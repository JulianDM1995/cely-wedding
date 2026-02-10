'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { generateInvitationEmail } from '../../../../email/invitation'

// Server Action for sending invitation
export const sendInvitation = async (guestId: string) => {
  const payload = await getPayload({ config })
  
  try {
    const guest = await payload.findByID({
      collection: 'guests',
      id: guestId,
    })

    if (!guest) {
      throw new Error('Guest not found')
    }

    if (!guest.email) {
      throw new Error('Guest has no email')
    }

    // Generate personalized link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000'
    const token = guest.code
    
    if (!token) {
        throw new Error('Guest has no invitation code. Please save the guest first.')
    }

    const invitationLink = `${appUrl}/invitation?token=${token}`

    // Send Email or Log to Console
    const emailData = await generateInvitationEmail(guest.name || 'Invitado', guest.email, invitationLink)
    
    if (!process.env.RESEND_API_KEY && !process.env.SENDGRID_API_KEY) {
      console.log('--- EMAIL SIMULATION (No API Key) ---')
      console.log('To:', guest.email)
      console.log('Subject:', emailData.subject)
      console.log('Link:', invitationLink)
      console.log('HTML (Preview):', emailData.html.substring(0, 100) + '...')
      console.log('-------------------------------------')
    } else {
        await payload.sendEmail(emailData)
    }

    // Update Status
    await payload.update({
      collection: 'guests',
      id: guest.id,
      data: {
        status: 'sent',
      },
    })

    return { success: true, message: 'Invitation sent successfully' }

  } catch (error) {
    console.error('Error sending invitation:', error)
    return { success: false, message: error instanceof Error ? error.message : 'Error sending invitation' }
  }
}
