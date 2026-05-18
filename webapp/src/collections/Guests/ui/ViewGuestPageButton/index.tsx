'use client'

import { Button, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import React from 'react'

const ViewGuestPageButton: React.FC = () => {
  const { id } = useDocumentInfo()
  const formCode = useFormFields(([fields]) => fields.code?.value as string)

  if (!id || !formCode) return null

  const href = `/invitation?token=${formCode}`

  return (
    <Button
      buttonStyle="secondary"
      el="anchor"
      url={href}
      newTab={true}
    >
      Open Page
    </Button>
  )
}

export default ViewGuestPageButton
