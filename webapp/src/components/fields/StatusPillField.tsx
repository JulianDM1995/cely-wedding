'use client'

import { useField, useTranslation } from '@payloadcms/ui'
import React from 'react'
import { FaCheck, FaTimes, FaPaperPlane, FaClock } from 'react-icons/fa'

type Props = {
    path: string
    label?: string | Record<string, string>
    required?: boolean
    field?: any
}

export const StatusPillField: React.FC<Props> = ({ path, label, required, field }) => {
    const { value, setValue } = useField<string>({ path })
    const { i18n } = useTranslation()

    const translatedLabel = field?.label && typeof field.label === 'object' 
        ? (field.label[i18n.language] || field.label['en'] || field.label['es']) 
        : label || field?.label

    const options = [
        { value: 'not_sent', icon: FaClock, color: 'var(--theme-elevation-400)', bg: 'var(--theme-elevation-100)', label: i18n.language === 'es' ? 'No Enviado' : 'Not Sent' },
        { value: 'sent', icon: FaPaperPlane, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', label: i18n.language === 'es' ? 'Enviado' : 'Sent' },
        { value: 'confirmed', icon: FaCheck, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', label: i18n.language === 'es' ? 'Confirmado' : 'Confirmed' },
        { value: 'declined', icon: FaTimes, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', label: i18n.language === 'es' ? 'Declinado' : 'Declined' },
    ]

    return (
        <div className="field-type" style={{ marginBottom: '1.5rem' }}>
            <label className="field-label" style={{ marginBottom: '8px', display: 'block' }}>
                {translatedLabel as React.ReactNode}
                {required && <span className="required">*</span>}
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {options.map((opt) => {
                    const isSelected = value === opt.value
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setValue(opt.value)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                borderRadius: '999px',
                                border: `1px solid ${isSelected ? opt.color : 'var(--theme-elevation-200)'}`,
                                backgroundColor: isSelected ? opt.bg : 'var(--theme-elevation-50)',
                                color: isSelected ? opt.color : 'var(--theme-elevation-500)',
                                cursor: 'pointer',
                                fontWeight: 500,
                                fontSize: '13px',
                                transition: 'all 0.2s ease',
                                opacity: isSelected ? 1 : 0.7,
                                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            <opt.icon size={12} />
                            {opt.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default StatusPillField
