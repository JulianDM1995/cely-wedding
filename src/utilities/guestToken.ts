import crypto from 'crypto'

const algorithm = 'aes-256-ctr'
const secretKey = process.env.PAYLOAD_SECRET || 'default_secret_key_must_be_32_bytes_long!!'
// Ensure key is 32 bytes
const key = crypto.createHash('sha256').update(String(secretKey)).digest('base64').substr(0, 32)
const ivLength = 16

export const encryptGuestId = (text: string): string => {
  const iv = crypto.randomBytes(ivLength)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export const decryptGuestId = (hash: string): string | null => {
  try {
    const parts = hash.split(':')
    if (parts.length !== 2) return null
    const iv = Buffer.from(parts[0], 'hex')
    const encryptedText = Buffer.from(parts[1], 'hex')
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()])
    return decrypted.toString()
  } catch (error) {
    console.error('Error decrypting token:', error)
    return null
  }
}
