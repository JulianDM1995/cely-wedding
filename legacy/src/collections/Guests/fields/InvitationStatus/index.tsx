'use client'

import { Button, useDocumentInfo, useField } from '@payloadcms/ui'
import React, { useState } from 'react'
import { FaCheck, FaHourglassStart, FaPaperPlane, FaTimes } from 'react-icons/fa'
import { sendInvitation } from '../../cells/InvitationStatus/actions'

export const InvitationStatusField: React.FC = () => {
    const { value, setValue } = useField<string>({ path: 'status' })
    const { id } = useDocumentInfo()

    // We need to get the ID from the document context if possible, or usually useField('id') works if the doc behaves like that,
    // but in Payload 3.0 Fields sometimes don't have direct access to ID if it's a new doc.
    // However, for sending invitation we mostly care about existing docs.
    // Let's assume we can get ID. if not we might need useDocumentInfo or similar if available, or just rely on the prop if passed (but path based fields dont get rowData).

    // Actually, `useField` for 'id' might not work on 'create'.
    // But we can only send invitation if saved?
    // Let's try to get ID.

    // Wait, simpler approach: reusing the logic from the Cell.

    const [isLoading, setIsLoading] = useState(false)

    const handleSend = async () => {
        if (!id) {
            alert('Guest ID not found. Save the guest first.')
            return
        }

        setIsLoading(true)
        try {
            const res = await sendInvitation(String(id))
            if (res.success) {
                alert(res.message)
                setValue('sent')
            } else {
                alert(res.message)
            }
        } catch (error) {
            alert('Error sending invitation')
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'confirmed':
                return {
                    backgroundColor: 'rgba(52, 168, 83, 0.1)', // #34a853 at 10%
                    borderColor: '#34a853',
                    color: '#137333',
                    icon: <FaCheck />,
                    label: 'Confirmado'
                }
            case 'sent':
                return {
                    backgroundColor: 'rgba(66, 133, 244, 0.1)', // #4285f4 at 10%
                    borderColor: '#4285f4',
                    color: '#1967d2',
                    icon: <FaPaperPlane />,
                    label: 'Enviado'
                }
            case 'declined':
                return {
                    backgroundColor: 'rgba(234, 67, 53, 0.1)', // #ea4335 at 10%
                    borderColor: '#ea4335',
                    color: '#c5221f',
                    icon: <FaTimes />,
                    label: 'Declinado'
                }
            default:
                return {
                    backgroundColor: 'var(--theme-elevation-50)',
                    borderColor: 'var(--theme-elevation-150)',
                    color: 'var(--theme-text)',
                    icon: <FaHourglassStart />,
                    label: 'No Enviado'
                }
        }
    }

    const statusStyles = getStatusStyles(value as string)

    return (
        <div style={{ marginBottom: '20px' }}>
            <label className="field-label">Estado de la Invitación</label>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px',
                border: `1px solid ${statusStyles.borderColor}`,
                borderRadius: 'var(--style-radius-m)',
                backgroundColor: statusStyles.backgroundColor,
                color: statusStyles.color,
                transition: 'all 0.2s ease'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '1rem',
                    fontWeight: 600,
                }}>
                    <span style={{ fontSize: '1.2rem' }}>{statusStyles.icon}</span>
                    <span>{statusStyles.label}</span>
                </div>

                <Button
                    size="small"
                    buttonStyle={value === 'not_sent' ? 'primary' : 'secondary'}
                    onClick={handleSend}
                    disabled={isLoading || !id}
                >
                    {isLoading
                        ? 'Enviando...'
                        : (value === 'not_sent' ? 'Enviar invitación por email' : 'Volver a enviar')
                    }
                </Button>
            </div>
            {!id && <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>Guarda el invitado para enviar la invitación.</p>}
        </div>
    )
}
