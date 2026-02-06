'use client'

import type { Guest } from '@/payload-types'
import React from 'react'

export const PageClient: React.FC<{ guest: Guest }> = ({ guest }) => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Welcome, {guest.name}!</h1>
      <p>Email: {guest.email}</p>
      {/* Add more guest details here as needed */}
    </div>
  )
}
