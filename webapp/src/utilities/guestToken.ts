import crypto from 'crypto'

export const generateGuestCode = (length = 12): string => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length)
}
