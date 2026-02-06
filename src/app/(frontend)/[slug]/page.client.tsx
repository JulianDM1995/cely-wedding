import { InvitationRenderer } from '@/components/InvitationRenderer'
import type { Guest } from '@/payload-types'
import React from 'react'

export const PageClient: React.FC<{ guest: Guest }> = ({ guest }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        padding: '20px',
      }}
    >
      <InvitationRenderer guest={guest} />
    </div>
  )
}
