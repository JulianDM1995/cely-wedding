import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Guests } from './collections/Guests'
import { GuestMessages } from './collections/GuestMessages'

import { Personalization } from './globals/Personalization'
import { NewGuestMessage } from './globals/NewGuestMessage'

import { APP_NAME } from './constants'

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
        Icon: '/components/graphics/ClientIcon.tsx#default',
        Logo: '/components/graphics/ClientBanner.tsx#default',
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
  collections: [Users, Media, Guests, GuestMessages],
  globals: [Personalization, NewGuestMessage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})

