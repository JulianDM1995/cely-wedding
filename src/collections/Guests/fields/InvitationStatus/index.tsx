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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return '#4CAF50'
            case 'sent': return '#2196F3'
            case 'declined': return '#F44336'
            default: return '#9E9E9E'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed': return <FaCheck />
            case 'sent': return <FaPaperPlane />
            case 'declined': return <FaTimes />
            default: return <FaHourglassStart />
        }
    }

    return (
        <div style={{ marginBottom: '20px' }}>
            <label className="field-label">Invitation Status</label>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                padding: '10px',
                border: '1px solid var(--theme-elevation-150)',
                borderRadius: 'var(--style-radius-m)',
                backgroundColor: 'var(--theme-elevation-50)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    backgroundColor: getStatusColor(value as string),
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                }}>
                    {getStatusIcon(value as string)}
                    <span style={{ textTransform: 'capitalize' }}>{(value as string)?.replace('_', ' ') || 'Not Sent'}</span>
                </div>

                {value === 'not_sent' && (
                     <Button 
                        size="small"
                        onClick={handleSend}
                        disabled={isLoading || !id}
                     >
                        {isLoading ? 'Sending...' : 'Send Invitation'}
                     </Button>
                )}
                 {value === 'sent' && (
                     <Button 
                        size="small"
                        buttonStyle="secondary"
                        onClick={handleSend}
                        disabled={isLoading || !id}
                     >
                        {isLoading ? 'Resending...' : 'Resend Invitation'}
                     </Button>
                )}
            </div>
             {!id && <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>Save the guest to send an invitation.</p>}
        </div>
    )
}
