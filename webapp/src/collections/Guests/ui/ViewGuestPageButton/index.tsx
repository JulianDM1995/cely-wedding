'use client'

import { Button, useDocumentInfo, useFormFields, useTranslation } from '@payloadcms/ui'
import React from 'react'

const ViewGuestPageButton: React.FC = () => {
  const { id } = useDocumentInfo()
  const formSlug = useFormFields(([fields]) => fields.slug?.value as string)
  const { i18n } = useTranslation()

  if (!id || !formSlug) return null

  const href = `/invitation/${formSlug}`

  return (
    <Button
      buttonStyle="secondary"
      el="anchor"
      url={href}
      newTab={true}
    >
      {i18n.language === 'es' ? 'Abrir página de invitación' : 'Open invitation page'}
    </Button>
  )
}

export default ViewGuestPageButton
