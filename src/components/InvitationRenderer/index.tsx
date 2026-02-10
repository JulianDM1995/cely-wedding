'use client'

import type { Guest } from '@/payload-types'
import React from 'react'

interface InvitationRendererProps {
  guest?: Guest
  transparentBg?: boolean
  onClose?: () => void
}

export const InvitationRenderer: React.FC<InvitationRendererProps> = ({ guest, transparentBg, onClose }) => {
  return (
    <div
      style={{
        width: '100%',
        minHeight: transparentBg ? '100%' : '100dvh', // Fix: Allow container to control height in modal
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: transparentBg ? 'transparent' : '#f9f9f9',
        overflow: 'hidden',
        pointerEvents: transparentBg ? 'none' : 'auto', // Fix: Let clicks pass through if just wrapper
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
          backgroundColor: transparentBg ? 'rgba(255, 252, 245, 0.95)' : '#fffcf5', // Warm paper color
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`, // Subtle paper texture
          backdropFilter: transparentBg ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: transparentBg ? 'blur(20px)' : 'none',
          border: transparentBg ? '1px solid rgba(255, 255, 255, 0.8)' : 'none',
          borderRadius: '24px', // More rounded
          boxShadow: transparentBg ? '0 25px 50px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center',
          fontFamily: 'var(--font-cormorant)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          pointerEvents: 'auto', // Fix: Capture clicks inside card
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px', // Top corner
              right: '15px',
              background: 'transparent',
              border: 'none',
              fontSize: '2rem', // Larger X
              cursor: 'pointer',
              color: '#888',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              transition: 'all 0.2s',
              zIndex: 20
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#333'
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#888'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            ×
          </button>
        )}
        <div
          style={{
            position: 'absolute',
            zIndex: 1, // Ensure it is behind content but distinct
            top: '12px',
            left: '12px',
            right: '12px',
            bottom: '12px',
            border: '1px solid rgba(212, 175, 55, 0.3)', // Subtle gold inner border
            borderRadius: '16px',
            pointerEvents: 'none'
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >


          <div
            style={{
              marginBottom: '30px',
              marginTop: onClose ? '10px' : '0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span
              style={{
                textTransform: 'uppercase',
                letterSpacing: '3px',
                fontSize: '12px',
                color: '#997b1f', // Darker gold as requested
                fontWeight: 600,
                fontFamily: 'var(--font-cormorant)'
              }}
            >
              {guest ? 'Estás invitado' : 'Aparta la Fecha'}
            </span>
            {/* Elegant Divider */}
            <div style={{ width: '40px', height: '1px', backgroundColor: '#d4af37', opacity: 0.5 }}></div>
          </div>

          {guest?.profilePicture && typeof guest.profilePicture === 'object' && 'url' in guest.profilePicture && (
            <div
              style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                border: '3px solid #fff',
                outline: '1px solid rgba(212, 175, 55, 0.3)', // Subtle gold outline
                flexShrink: 0,
                aspectRatio: '1 / 1'
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
              fontSize: '3.5rem', // Larger name
              color: '#1a1a1a',
              marginBottom: '2px', // Reduce bottom margin as email is coming next
              fontWeight: 'normal', // Reverted to normal as requested
              letterSpacing: '-1px',
              lineHeight: 1.1
            }}
          >
            {guest ? guest.name : 'Bienvenido'}
          </h1>



          <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '30px', lineHeight: '1.6', fontStyle: 'italic', maxWidth: '80%' }}>
            Estamos encantados de que celebres<br />con nosotros este día especial.
          </p>

          {/* Attendance Actions - Only show if guest exists */}
          {guest && (
            <div style={{ marginTop: '20px', width: '100%' }}>
              <p style={{ marginBottom: '20px', color: '#d4af37', fontFamily: 'var(--font-great-vibes)', fontSize: '2.2rem' }}>¿Nos acompañarás?</p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <AttendanceButtons guestId={guest.id} initialStatus={guest.status} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { updateGuestStatus } from './actions'

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

const AttendanceButtons = ({ guestId, initialStatus }: { guestId: string, initialStatus?: string | null }) => {
  const [status, setStatus] = useState(initialStatus)
  const [loading, setLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 8000) // Stop after 8 seconds
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  const handleUpdateStatus = async (newStatus: 'confirmed' | 'declined') => {
    setLoading(true)
    const res = await updateGuestStatus(guestId, newStatus)
    setLoading(false)
    if (res.success) {
      setStatus(newStatus)
      if (newStatus === 'confirmed') {
        setShowConfetti(true)
      }
    } else {
      alert('Error al actualizar estado')
    }
  }

  return (
    <>
      {showConfetti && typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={300}
            gravity={0.15}
            colors={['#d4af37', '#e5c15b', '#f9e076', '#fffcf5', '#ffffff']}
          />
        </div>,
        document.body
      )}
      <button
        onClick={() => handleUpdateStatus('confirmed')}
        disabled={loading || status === 'confirmed'}
        style={{
          padding: '12px 32px',
          backgroundColor: status === 'confirmed' ? '#2e7d32' : '#d4af37', // Gold button
          color: '#fff',
          border: 'none',
          borderRadius: '2px', // Sharper corners for elegance
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '14px',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          opacity: loading ? 0.7 : 1,
          boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)', // Gold shadow
          transition: 'all 0.3s ease',
          minWidth: '150px'
        }}
        onMouseEnter={(e) => {
          if (status !== 'confirmed') {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)'
          }
        }}
        onMouseLeave={(e) => {
          if (status !== 'confirmed') {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)'
          }
        }}
      >
        {status === 'confirmed' ? '✓ Confirmado' : 'Confirmar'}
      </button>
      <button
        onClick={() => handleUpdateStatus('declined')}
        disabled={loading || status === 'declined'}
        style={{
          padding: '12px 32px',
          backgroundColor: 'transparent',
          color: status === 'declined' ? '#d32f2f' : '#666',
          border: '1px solid #ddd',
          borderRadius: '2px',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: '14px',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.3s ease',
          minWidth: '150px'
        }}
        onMouseEnter={(e) => {
          if (status !== 'declined') {
            e.currentTarget.style.borderColor = '#999'
            e.currentTarget.style.color = '#333'
          }
        }}
        onMouseLeave={(e) => {
          if (status !== 'declined') {
            e.currentTarget.style.borderColor = '#ddd'
            e.currentTarget.style.color = '#666'
          }
        }}
      >
        {status === 'declined' ? 'Declinado' : 'Declinar'}
      </button>
    </>
  )
}

