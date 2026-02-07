'use client'

import { APP_NAME } from '@/constants'
import React from 'react'

const ClientLogo: React.FC = () => {
  return (
    <div className="client-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '100%' }}>
      <img src="/images/branding/icon.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
      <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{APP_NAME}</span>
    </div>
  )
}

export default ClientLogo
