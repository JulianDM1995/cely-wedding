'use client'

import { Button, useFormFields } from '@payloadcms/ui'
import React from 'react'

export const ViewInvitationButton: React.FC = () => {
    const code = useFormFields(([fields]) => fields.code?.value) as string

    if (!code) {
        return null
    }

    const handleViewInvitation = () => {
        // Construct the URL using the window origin
        const url = `${window.location.origin}/invitation?token=${code}`
        window.open(url, '_blank')
    }

    return (
        <Button onClick={handleViewInvitation} buttonStyle="secondary">
            Ver invitación
        </Button>
    )
}
