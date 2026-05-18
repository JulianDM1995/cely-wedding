'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { FaCog } from 'react-icons/fa'
import { InvitationComposer } from './InvitationComposer'
import { InvitationConfigurator } from './InvitationConfigurator'

export const InvitationDesigner: React.FC = () => {
  const [opened, setOpened] = useState(false)
  const open = () => setOpened(true)
  const close = () => setOpened(false)

  const { setValue: setQrSize } = useField<number>({ path: 'qrLayout.qrSize' })
  const { setValue: setQrX } = useField<number>({ path: 'qrLayout.qrX' })
  const { setValue: setQrY } = useField<number>({ path: 'qrLayout.qrY' })

  const formLayout = useFormFields(([fields]) => {
    const getVal = (path: string) => fields[path]?.value
    return {
      dotsType: getVal('qrLayout.dotsType') as string,
      color: getVal('qrLayout.color') as string,
      cornersSquareType: getVal('qrLayout.cornersSquareType') as string,
      cornersSquareColor: getVal('qrLayout.cornersSquareColor') as string,
      cornersDotType: getVal('qrLayout.cornersDotType') as string,
      cornersDotColor: getVal('qrLayout.cornersDotColor') as string,
      backgroundImage: getVal('qrLayout.backgroundImage'),
      qrSize: getVal('qrLayout.qrSize') as number,
      qrX: getVal('qrLayout.qrX') as number,
      qrY: getVal('qrLayout.qrY') as number,
      showLogo: getVal('qrLayout.logo.show') as boolean,
      logoSize: getVal('qrLayout.logo.size') as number,
      logoId: getVal('logo'), // Use top-level logo field
    }
  })

  // State to hold resolved URLs
  const [bgUrl, setBgUrl] = useState<string>('')
  const [logoUrl, setLogoUrl] = useState<string>('')

  // Memoize IDs to prevent unnecessary refetches
  const backgroundImageId = useMemo(() => formLayout.backgroundImage, [formLayout.backgroundImage])
  const logoId = useMemo(() => formLayout.logoId, [formLayout.logoId])

  // Resolve Background URL
  useEffect(() => {
    const fetchBg = async () => {
      const bgId = backgroundImageId
      if (!bgId) {
        setBgUrl('')
        return
      }
      if (typeof bgId === 'object' && 'url' in bgId) {
        setBgUrl(bgId.url as string)
        return
      }
      try {
        const res = await fetch(`/api/media/${bgId}`)
        if (res.ok) {
          const data = await res.json()
          setBgUrl(data.url)
        }
      } catch (error) {
        console.error('Error fetching background:', error)
      }
    }
    fetchBg()
  }, [backgroundImageId])

  // Resolve Logo URL
  useEffect(() => {
    const fetchLogo = async () => {
      const lid = logoId

      if (!lid) {
        setLogoUrl('')
        return
      }
      if (typeof lid === 'object' && 'url' in lid) {
        setLogoUrl(lid.url as string)
        return
      }
      try {
        const res = await fetch(`/api/brand-logos/${lid}`)
        if (res.ok) {
          const data = await res.json()
          setLogoUrl(data.url)
        }
      } catch (error) {
        console.error('Error fetching logo:', error)
      }
    }
    fetchLogo()
  }, [logoId]) // Only depend on logoId, not logoSize

  // Construct the finalized layout object for InvitationComposer
  const finalInvitationLayout = {
    url: `${process.env.NEXT_PUBLIC_APP_URL}/guest-slug`,
    dots: {
      type: formLayout.dotsType,
      color: formLayout.color,
    },
    cornersSquare: {
      type: formLayout.cornersSquareType,
      color: formLayout.cornersSquareColor,
    },
    cornersDot: {
      type: formLayout.cornersDotType,
      color: formLayout.cornersDotColor,
    },
    background: {
      image: bgUrl,
      qrSize: formLayout.qrSize,
      qrX: formLayout.qrX,
      qrY: formLayout.qrY,
    },
    logo: {
      show: formLayout.showLogo,
      image: logoUrl,
      size: formLayout.logoSize,
    },
  }

  const handleSetQrPosition = (x: number, y: number) => {
    setQrX(x)
    setQrY(y)
  }

  return (
    <div
      style={{
        width: '100%',
        height: '600px',
        marginBottom: '8px',
        backgroundColor: 'var(--theme-elevation-50)',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 'var(--style-radius-s)',
        padding: '20px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <InvitationComposer
        invitationLayout={finalInvitationLayout}
        setQrSize={setQrSize}
        setQrPosition={handleSetQrPosition}
      />

      {/* Configurator Trigger */}
      <div
        onClick={open}
        role="button"
        tabIndex={0}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#1e293b',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 10,
        }}
        title="Customize QR Style"
      >
        <FaCog size={20} />
      </div>

      <InvitationConfigurator opened={opened} onClose={close} />
    </div>
  )
}


