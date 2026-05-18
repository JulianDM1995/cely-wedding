'use client'

import React from 'react'

interface EventDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  personalization: any
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onClose, personalization }) => {
  if (!isOpen) return null

  const getMapUrl = (lat?: number, lng?: number) => {
    if (lat && lng) {
      return `https://www.google.com/maps?q=${lat},${lng}`
    }
    return '#'
  }

  const { ceremony, reception, dressCode, giftType } = personalization || {}

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100dvh',
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          backgroundColor: '#fffcf5',
          borderRadius: '24px',
          padding: '30px',
          overflowY: 'auto',
          position: 'relative',
          fontFamily: 'var(--font-cormorant)',
          textAlign: 'center',
          boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'transparent',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            color: '#888',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#333')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
        >
          ×
        </button>

        <h2 style={{ fontSize: '2rem', color: '#1a1a1a', marginBottom: '30px', fontFamily: 'var(--font-great-vibes)' }}>
          Detalles del Evento
        </h2>

        {/* Ceremony */}
        {ceremony && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#997b1f', marginBottom: '10px' }}>Ceremonia</h3>
            <p style={{ margin: '5px 0', fontSize: '1.1rem' }}><strong>Hora:</strong> {ceremony.time}</p>
            <p style={{ margin: '5px 0', fontSize: '1.1rem' }}><strong>Lugar:</strong> {ceremony.placeName}</p>
            {ceremony.gpsCoordinates && (
                 <a href={getMapUrl(ceremony.gpsCoordinates.latitude, ceremony.gpsCoordinates.longitude)} target="_blank" rel="noreferrer" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }}>📍 Ver Mapa</a>
            )}
             {ceremony.placePhoto && typeof ceremony.placePhoto === 'object' && ceremony.placePhoto.url && (
              <img src={ceremony.placePhoto.url} alt="Ceremonia" style={{ width: '100%', marginTop: '15px', borderRadius: '12px' }} />
            )}
          </div>
        )}

        {/* Reception */}
        {reception && (
          <div style={{ marginBottom: '30px', borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#997b1f', marginBottom: '10px' }}>Recepción</h3>
            <p style={{ margin: '5px 0', fontSize: '1.1rem' }}><strong>Hora:</strong> {reception.time}</p>
            <p style={{ margin: '5px 0', fontSize: '1.1rem' }}><strong>Lugar:</strong> {reception.placeName}</p>
            {reception.gpsCoordinates && (
               <a href={getMapUrl(reception.gpsCoordinates.latitude, reception.gpsCoordinates.longitude)} target="_blank" rel="noreferrer" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }}>📍 Ver Mapa</a>
            )}
            {reception.placePhoto && typeof reception.placePhoto === 'object' && reception.placePhoto.url && (
              <img src={reception.placePhoto.url} alt="Recepción" style={{ width: '100%', marginTop: '15px', borderRadius: '12px' }} />
            )}
          </div>
        )}

        {/* Dress Code */}
        {dressCode && (
           <div style={{ marginBottom: '30px', borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#997b1f', marginBottom: '10px' }}>Código de Vestimenta</h3>
            <p style={{ margin: '5px 0', fontSize: '1.1rem' }}>{dressCode.text}</p>
             <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {dressCode.femaleImage && typeof dressCode.femaleImage === 'object' && dressCode.femaleImage.url && (
                  <img src={dressCode.femaleImage.url} alt="Dress Code Mujer" style={{ width: '50%', borderRadius: '12px' }} />
              )}
               {dressCode.maleImage && typeof dressCode.maleImage === 'object' && dressCode.maleImage.url && (
                  <img src={dressCode.maleImage.url} alt="Dress Code Hombre" style={{ width: '50%', borderRadius: '12px' }} />
              )}
             </div>
          </div>
        )}

         {/* Gifts */}
         {giftType && (
           <div style={{ marginBottom: '30px', borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#997b1f', marginBottom: '10px' }}>Regalos</h3>
            <p style={{ margin: '5px 0', fontSize: '1.1rem' }}>{giftType}</p>
          </div>
        )}
      </div>
    </div>
  )
}
