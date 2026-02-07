import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Guests } from './collections/Guests'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Personalization } from './globals/Personalization/index'


import { APP_NAME } from './constants'
import { seed } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Icon: '/fields/ClientIcon.tsx#default',
        Logo: '/fields/ClientLogo.tsx#default',
      },
    },
    meta: {
      titleSuffix: ` | ${APP_NAME}`,
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/images/branding/icon.png',
        },
      ],
    },
  },
  collections: [Users, Media, Guests],
  globals: [Personalization],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SENDGRID_FROM_EMAIL || 'onboarding@resend.dev',
    defaultFromName: process.env.SENDGRID_FROM_NAME || APP_NAME,
    transportOptions: {
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || '',
        endpoint: process.env.S3_ENDPOINT || '',
        // Force path style for S3 compatible storage if needed (often needed for MinIO, sometimes for R2/others)
        forcePathStyle: true, 
      },
    }),
  ],
  onInit: async (payload) => {
    if (process.env.PAYLOAD_SEED === 'true') {
      await seed(payload, { reset: true })
    }
  },
})
