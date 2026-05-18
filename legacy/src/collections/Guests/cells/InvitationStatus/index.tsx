'use client'

import { Button } from '@payloadcms/ui'
import React, { useState } from 'react'
import { sendInvitation } from './actions'

export const SendInvitationCell: React.FC<any> = ({ rowData, cellData }) => {
  const [loading, setLoading] = useState(false)
  const status = cellData
  const [currentStatus, setCurrentStatus] = useState(status)

  const isSent = currentStatus !== 'not_sent'

  const handleSend = async () => {
    // Prevent event propagation to avoid opening the row
    if (loading) return
    
    setLoading(true)
    try {
      const res = await sendInvitation(rowData.id)
      if (res.success) {
        setCurrentStatus('sent')
        alert('Invitación enviada correctamente')
      } else {
        alert(`Error: ${res.message}`)
      }
    } catch (e) {
      console.error(e)
      alert('Error de red')
    } finally {
      setLoading(false)
    }
  }

  if (isSent) {
    return (
      <Button buttonStyle="secondary" disabled size="small" onClick={(e) => e.stopPropagation()}>
        {currentStatus === 'sent' ? 'Invitación enviada' : currentStatus}
      </Button>
    )
  }

  return (
    <Button size="small" onClick={(e) => { e.stopPropagation(); handleSend() }} disabled={loading}>
      {loading ? 'Enviando...' : 'Enviar invitación'}
    </Button>
  )
}
