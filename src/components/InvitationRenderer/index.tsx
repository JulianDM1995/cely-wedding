'use client'

import type { Guest } from '@/payload-types'
import React from 'react'
import { FaEnvelope } from 'react-icons/fa'

interface InvitationRendererProps {
  guest: Guest
}

export const InvitationRenderer: React.FC<InvitationRendererProps> = ({ guest }) => {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        textAlign: 'center',
        fontFamily: 'serif',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid #eee',
          paddingBottom: '20px',
          marginBottom: '30px',
        }}
      >
        <span
          style={{
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontSize: '12px',
            color: '#888',
          }}
        >
          You are invited
        </span>
      </div>

      <h1
        style={{
          fontSize: '2.5rem',
          color: '#333',
          marginBottom: '10px',
          fontWeight: 'normal',
        }}
      >
        {guest.name}
      </h1>

      <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '40px' }}>
        We are delighted to have you celebrate with us.
      </p>

      <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            color: '#888',
            fontSize: '0.9rem'
        }}
      >
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
             <FaEnvelope /> {guest.email}
         </div>
      </div>
      
      {/* 
        This is a placeholder for where the actual digital invitation content 
        (like Rsvp status, etc.) would go 
      */}
      
    </div>
  )
}
