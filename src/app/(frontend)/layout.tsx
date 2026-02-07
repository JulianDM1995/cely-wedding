import { APP_DESCRIPTION, APP_NAME } from '@/constants'
import React from 'react'
import './styles.css'

export const metadata = {
  description: APP_DESCRIPTION,
  title: APP_NAME,
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
