'use client'

import React, { useEffect, useState } from 'react'
import { useFormFields, useTranslation, toast } from '@payloadcms/ui'
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa'

export const CommunicationActions: React.FC = () => {
  const { t, i18n } = useTranslation()
  const nameField = useFormFields(([fields]) => fields.name)
  const slugField = useFormFields(([fields]) => fields.slug)
  const phoneField = useFormFields(([fields]) => fields.phoneNumber)
  const emailField = useFormFields(([fields]) => fields.email)
  
  const [templates, setTemplates] = useState<{ whatsapp: string; emailSubject: string; emailMessage: string } | null>(null)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const name = nameField?.value as string || ''
  const slug = slugField?.value as string || ''
  const phone = phoneField?.value as string || ''
  const email = emailField?.value as string || ''

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/globals/personalization')
        const data = await res.json()
        setTemplates({
          whatsapp: data.whatsappMessage || 'Hola {{name}}, mira tu invitación: https://boda.com/invitacion/{{slug}}',
          emailSubject: data.emailSubject || '¡Estás invitado!',
          emailMessage: data.emailMessage || 'Hola {{name}}',
        })
      } catch (e) {
        console.error('Failed to fetch personalization templates', e)
      }
    }
    fetchTemplates()
  }, [])

  const handleWhatsApp = () => {
    if (!phone) {
      toast.error(i18n.language === 'es' ? 'El invitado no tiene teléfono' : 'Guest has no phone number')
      return
    }
    if (!templates) return

    const message = templates.whatsapp
      .replace(/{{name}}/g, name)
      .replace(/{{slug}}/g, slug)
    
    // clean phone
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleEmail = async () => {
    if (!email) {
      toast.error(i18n.language === 'es' ? 'El invitado no tiene email' : 'Guest has no email')
      return
    }
    if (!templates) return

    setIsSendingEmail(true)
    try {
      // Use the window pathname to get the current document ID.
      // Payload URL is like /admin/collections/guests/12345
      const segments = window.location.pathname.split('/')
      const id = segments[segments.length - 1]

      const res = await fetch(`/api/guests/${id}/send-email`, {
        method: 'POST',
      })
      if (res.ok) {
        toast.success(i18n.language === 'es' ? 'Email enviado correctamente' : 'Email sent successfully')
      } else {
        toast.error(i18n.language === 'es' ? 'Error al enviar el email' : 'Failed to send email')
      }
    } catch (e) {
      console.error(e)
      toast.error(i18n.language === 'es' ? 'Error de red' : 'Network error')
    } finally {
      setIsSendingEmail(false)
    }
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>
        {i18n.language === 'es' ? 'Acciones de Comunicación' : 'Communication Actions'}
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        <button
          type="button"
          onClick={handleWhatsApp}
          disabled={!templates || !phone}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            backgroundColor: '#25D366', color: 'white',
            border: 'none', borderRadius: '4px', padding: '10px 16px', width: '100%',
            cursor: (!templates || !phone) ? 'not-allowed' : 'pointer',
            fontWeight: 600, opacity: (!templates || !phone) ? 0.6 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          <FaWhatsapp size={18} />
          {i18n.language === 'es' ? 'Enviar WhatsApp' : 'Send WhatsApp'}
        </button>
        <button
          type="button"
          onClick={handleEmail}
          disabled={!templates || !email || isSendingEmail}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            backgroundColor: 'var(--theme-elevation-800)', color: 'var(--theme-elevation-50)',
            border: 'none', borderRadius: '4px', padding: '10px 16px', width: '100%',
            cursor: (!templates || !email || isSendingEmail) ? 'not-allowed' : 'pointer',
            fontWeight: 600, opacity: (!templates || !email || isSendingEmail) ? 0.6 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          <FaEnvelope size={18} />
          {isSendingEmail ? (i18n.language === 'es' ? 'Enviando...' : 'Sending...') : (i18n.language === 'es' ? 'Enviar Email' : 'Send Email')}
        </button>
      </div>
      {!phone && (
        <p style={{ fontSize: '12px', color: 'var(--theme-elevation-400)', marginTop: '8px', marginBottom: 0 }}>
          {i18n.language === 'es' ? 'Se requiere un teléfono para enviar WhatsApp.' : 'Phone required for WhatsApp.'}
        </p>
      )}
      {!email && (
        <p style={{ fontSize: '12px', color: 'var(--theme-elevation-400)', marginTop: '4px', marginBottom: 0 }}>
          {i18n.language === 'es' ? 'Se requiere un email para enviar correo.' : 'Email required for sending email.'}
        </p>
      )}
    </div>
  )
}

export default CommunicationActions
