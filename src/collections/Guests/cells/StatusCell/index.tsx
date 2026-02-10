'use client'

import React from 'react'
import { FaCheck, FaEnvelope, FaRegCircle, FaTimes } from 'react-icons/fa'

export const StatusCell: React.FC<any> = ({ cellData }) => {
    const status = cellData

    // Status Colors & Icons using Payload Theme Variables
    // Correct format: var(--theme-success-500), var(--theme-error-500), etc.
    const getStatusConfig = (s: string) => {
        switch (s) {
            case 'confirmed':
                return {
                    color: 'var(--theme-success-500)',
                    icon: FaCheck,
                    label: 'Confirmado',
                }
            case 'declined':
                return {
                    color: 'var(--theme-error-500)',
                    icon: FaTimes,
                    label: 'Declinado',
                }
            case 'sent':
            case 'viewed':
                return {
                    color: 'var(--theme-warning-500)',
                    icon: FaEnvelope,
                    label: 'Enviado',
                }
            default:
                return {
                    color: 'var(--theme-elevation-500)',
                    icon: FaRegCircle,
                    label: 'No Enviado',
                }
        }
    }

    const { color, icon: Icon, label } = getStatusConfig(status)

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                borderRadius: '4px',
                backgroundColor: 'var(--theme-elevation-100)', // Adapts to dark/light mode
                color: color,
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: `1px solid ${color}`,
                boxShadow: 'var(--theme-shadow-sm)'
            }}>
                <Icon size={12} />
                <span>{label}</span>
            </div>
        </div>
    )
}
