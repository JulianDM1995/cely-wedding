'use client'

import React from 'react'
import { FaCheck, FaEnvelope, FaRegCircle, FaTimes, FaUser } from 'react-icons/fa'

export const NameCell: React.FC<any> = (props) => {
    const { cellData, rowData } = props
    const { profilePicture, status } = rowData

    // Status Colors & Icons
    const getStatusConfig = (s: string) => {
        switch (s) {
            case 'confirmed':
                return { color: '#4caf50', icon: FaCheck, label: 'Confirmado', bg: '#e8f5e9' } // Green
            case 'declined':
                return { color: '#f44336', icon: FaTimes, label: 'Declinado', bg: '#ffebee' } // Red
            case 'sent':
            case 'viewed':
                return { color: '#ff9800', icon: FaEnvelope, label: 'Enviado', bg: '#fff3e0' } // Orange
            default:
                return { color: '#9e9e9e', icon: FaRegCircle, label: 'No Enviado', bg: '#f5f5f5' } // Gray
        }
    }

    // Helper to extract image URL
    const getImageUrl = () => {
        if (profilePicture && typeof profilePicture === 'object' && 'url' in profilePicture) {
            return profilePicture.url
        }
        return null
    }

    const imageUrl = getImageUrl()
    const { color, icon: Icon, label, bg } = getStatusConfig(status)

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 0' }}>
            {/* Avatar with Status Border */}
            <div
                style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: `2px solid ${color}`, // Status color border
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    position: 'relative'
                }}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={cellData}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <FaUser style={{ color: '#aaa', fontSize: '16px' }} />
                )}
            </div>

            {/* Name and Status Badge */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{
                    fontWeight: 600,
                    fontSize: '15px',
                    color: '#333'
                }}>
                    {cellData}
                </span>

                {/* Cool Status Badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    color: color,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    <Icon size={10} />
                    <span>{label}</span>
                </div>
            </div>
        </div>
    )
}
