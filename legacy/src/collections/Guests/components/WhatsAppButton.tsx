'use client'

import { useFormFields } from '@payloadcms/ui'
import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'

export const WhatsAppButton: React.FC = () => {
    const phoneNumber = useFormFields(([fields]) => fields.phoneNumber?.value) as string
    const name = useFormFields(([fields]) => fields.name?.value) as string
    const customMessage = useFormFields(([fields]) => fields.message?.value) as string

    if (!phoneNumber) {
        return null
    }

    const handleWhatsAppClick = () => {
        // Format phone number: remove non-numeric characters
        const formattedPhone = phoneNumber.replace(/\D/g, '')

        // Default message if no custom message is provided
        const defaultMessage = `Hola ${name}, esperamos que puedas acompañarnos en nuestra boda.`
        const messageToSend = customMessage || defaultMessage

        // Construct WhatsApp URL
        const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageToSend)}`

        window.open(url, '_blank')
    }

    return (
        <div style={{ marginBottom: '20px' }}>
            <button
                onClick={handleWhatsAppClick}
                type="button"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#25D366',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                }}
            >
                <FaWhatsapp size={16} />
                Enviar WhatsApp
            </button>
        </div>
    )
}
