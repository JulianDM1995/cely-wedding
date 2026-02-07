'use client'

import type { Guest } from '@/payload-types'
import React from 'react'
import { FaEnvelope } from 'react-icons/fa'

interface InvitationRendererProps {
  guest?: Guest
}

export const InvitationRenderer: React.FC<InvitationRendererProps> = ({ guest }) => {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '600px',
          maxHeight: '800px', // Optional: constrain height slightly or keep full
          margin: '0 auto',
          padding: '40px',
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center',
          fontFamily: 'serif',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
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
            {guest ? 'You are invited' : 'Save the Date'}
          </span>
        </div>

        {guest?.profilePicture && typeof guest.profilePicture === 'object' && 'url' in guest.profilePicture && (
          <div
            style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 20px',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={(guest.profilePicture as any).url}
              alt={guest.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}

        <h1
          style={{
            fontSize: '2.5rem',
            color: '#333',
            marginBottom: '10px',
            fontWeight: 'normal',
          }}
        >
          {guest ? guest.name : 'Welcome Guest'}
        </h1>

        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '40px' }}>
          We are delighted to have you celebrate with us.
        </p>

        {guest && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              color: '#888',
              fontSize: '0.9rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaEnvelope /> {guest.email}
            </div>
          </div>
        )}

        {/* Attendance Actions - Only show if guest exists */}
        {guest && (
          <div style={{ marginTop: '40px' }}>
            <p style={{ marginBottom: '20px', color: '#666' }}>Will you accompany us?</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <AttendanceButtons guestId={guest.id} initialStatus={guest.status} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Separate component for interactivity
import { useState } from 'react'
import { updateGuestStatus } from './actions'

const AttendanceButtons = ({ guestId, initialStatus }: { guestId: string, initialStatus?: string | null }) => {
  const [status, setStatus] = useState(initialStatus)
  const [loading, setLoading] = useState(false)

  const handleUpdateStatus = async (newStatus: 'confirmed' | 'declined') => {
    setLoading(true)
    const res = await updateGuestStatus(guestId, newStatus)
    setLoading(false)
    if (res.success) {
      setStatus(newStatus)
    } else {
      alert('Error updating status')
    }
  }

  return (
    <>
      <button
        onClick={() => handleUpdateStatus('confirmed')}
        disabled={loading || status === 'confirmed'}
        style={{
          padding: '10px 24px',
          backgroundColor: status === 'confirmed' ? '#4CAF50' : '#fff',
          color: status === 'confirmed' ? '#fff' : '#4CAF50',
          border: '2px solid #4CAF50',
          borderRadius: '24px',
          cursor: 'pointer',
          fontWeight: 600,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {status === 'confirmed' ? 'Confirmed' : 'Confirm'}
      </button>
      <button
        onClick={() => handleUpdateStatus('declined')}
        disabled={loading || status === 'declined'}
        style={{
          padding: '10px 24px',
          backgroundColor: status === 'declined' ? '#f44336' : '#fff',
          color: status === 'declined' ? '#fff' : '#f44336',
          border: '2px solid #f44336',
          borderRadius: '24px',
          cursor: 'pointer',
          fontWeight: 600,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {status === 'declined' ? 'Declined' : 'Decline'}
      </button>
    </>
  )
}

