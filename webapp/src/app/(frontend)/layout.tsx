import { APP_DESCRIPTION } from '@/constants'
import { Cormorant_Garamond, Great_Vibes } from 'next/font/google'
import React from 'react'
import './styles.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
})

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function generateMetadata() {
  const payload = await getPayload({ config: configPromise })
  const personalization = await payload.findGlobal({
    slug: 'personalization',
  })

  const groom = personalization.couple?.groom || 'Juan'
  const bride = personalization.couple?.bride || 'Tatiana'
  const title = `${groom} & ${bride}`
  const description = `${groom} & ${bride} - ${APP_DESCRIPTION}`

  return {
    metadataBase: process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL) : undefined,
    title,
    description,
    openGraph: {
      title,
      description,
    }
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${cormorant.variable} ${greatVibes.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
