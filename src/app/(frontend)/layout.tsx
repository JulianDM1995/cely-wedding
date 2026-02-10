import { APP_DESCRIPTION, APP_NAME } from '@/constants'
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

export const metadata = {
  description: APP_DESCRIPTION,
  title: APP_NAME,
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
