import jwt from 'jsonwebtoken'

const SECRET = process.env.PAYLOAD_SECRET || 'fallback-secret'

// 1. Guestbook QR Token (10 minutes)
// Used by the Admin Kiosk to generate a QR code.
// Verified by /select-guest page.
export const signGuestbookToken = (): string => {
  return jwt.sign({ type: 'guestbook-qr' }, SECRET, { expiresIn: '10m' })
}

export const verifyGuestbookToken = (token: string): boolean => {
  try {
    const decoded = jwt.verify(token, SECRET) as { type: string }
    return decoded.type === 'guestbook-qr'
  } catch (error) {
    return false
  }
}

// 2. Guest Access Token (e.g. 24 hours)
// Sent via email to the guest.
// Verified by /new-message page.
export const signGuestAccessToken = (guestId: string): string => {
  // Store guestId in the token
  return jwt.sign({ type: 'guest-access', guestId }, SECRET, { expiresIn: '24h' })
}

export const verifyGuestAccessToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, SECRET) as { type: string, guestId: string }
    if (decoded.type !== 'guest-access' || !decoded.guestId) {
      return null
    }
    return decoded.guestId
  } catch (error) {
    return null
  }
}
