'use client'

import type { QRLayout } from '@/components/QRDesigner/utils'
import { renderQR, renderQRSVG } from '@/components/QRDesigner/utils'
import { QRComposer } from '@/components/QRDesigner/QRComposer'
import { Button, useDocumentInfo, useField } from '@payloadcms/ui'
import React, { useEffect, useMemo, useState } from 'react'

const GUEST_PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400" preserveAspectRatio="none"><rect width="300" height="400" fill="#FFFFFF" /><g transform="translate(50, 120) scale(0.3125)"><path fill="#6B7280" d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0h12.6c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 195.3V464c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V195.3l-51.5 45.3c-13.4 11.1-33.3 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0h12.6z"/></g></svg>`
const GUEST_PLACEHOLDER_URL = `data:image/svg+xml;utf8,${encodeURIComponent(GUEST_PLACEHOLDER_SVG)}`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

const fetchMediaIfId = async (input: string | AnyRecord, collection: string): Promise<AnyRecord> => {
  if (typeof input === 'string' && input.length > 0) {
    if (input.startsWith('/') || input.startsWith('http')) return { url: input }
    try {
      const res = await fetch(`/api/${collection}/${input}`)
      if (res.ok) return await res.json()
    } catch (e) {
      console.error('Error fetching media', input, e)
    }
  }
  if (typeof input === 'object' && input?.url) return input
  return typeof input === 'object' ? input : {}
}

const GuestQRCode: React.FC = () => {
  const { id } = useDocumentInfo()
  const { value: profilePicture } = useField<string | { id: string; url?: string }>({ path: 'profilePicture' })
  const { value: guestNameData } = useField<string>({ path: 'name' })
  const { value: code } = useField<string>({ path: 'code' })

  const [personalizationConfig, setPersonalizationConfig] = useState<Record<string, unknown> | null>(null)
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [bgUrl, setBgUrl] = useState<string>('')
  const [guestPhotoUrl, setGuestPhotoUrl] = useState<string>('')
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isLoadingVisuals, setIsLoadingVisuals] = useState<boolean>(true)
  const [downloadOpen, setDownloadOpen] = useState(false)

  // Fetch Global Configuration
  useEffect(() => {
    const fetchGlobalConfig = async () => {
      setIsLoadingVisuals(true)
      try {
        const res = await fetch('/api/globals/personalization?depth=1')
        if (res.ok) {
          const data = await res.json()
          setPersonalizationConfig(data)
          
          if (data.qrLayout?.backgroundImage) {
            const bg = await fetchMediaIfId(data.qrLayout.backgroundImage, 'media')
            if (bg?.url) setBgUrl(bg.url)
          }
        }
      } catch (e) { 
        console.error('Error fetching global config:', e)
      } finally {
        setIsLoadingVisuals(false)
      }
    }
    fetchGlobalConfig()
  }, [])

  // Resolve Guest Photo
  useEffect(() => {
    const fetchPhoto = async () => {
      if (profilePicture) {
        const media = await fetchMediaIfId(profilePicture, 'media')
        if (media?.url) {
           setGuestPhotoUrl(media.url)
        } else {
           setGuestPhotoUrl('')
        }
      } else {
        setGuestPhotoUrl('')
      }
    }
    fetchPhoto()
  }, [profilePicture])

  const url = useMemo(() => {
     let base = `${process.env.NEXT_PUBLIC_APP_URL || ''}/invitation`
     const params = new URLSearchParams()
     
     if (code) {
       params.append('token', code)
     }

     const str = params.toString()
     if (str) base += `?${str}`
     
     return base
  }, [code])

  const finalQRLayout: QRLayout | null = useMemo(() => {
    if (!url || isLoadingVisuals) return null

    const qrLayout = (personalizationConfig?.qrLayout as AnyRecord) || {}

    return {
      url,
      dots: {
        type: qrLayout.dotsType || 'square',
        color: qrLayout.color || '#000000',
      },
      cornersSquare: {
        type: qrLayout.cornersSquareType || 'square',
        color: qrLayout.cornersSquareColor || '#000000',
      },
      cornersDot: {
        type: qrLayout.cornersDotType || 'square',
        color: qrLayout.cornersDotColor || '#000000',
      },
      background: {
        image: bgUrl,
        qrSize: qrLayout.qrSize || 300,
        qrX: qrLayout.qrX || 0,
        qrY: qrLayout.qrY || 0,
        qrRotation: qrLayout.qrRotation || 0,
      },
      logo: {
        show: qrLayout.show ?? false,
        image: logoUrl,
        size: qrLayout.size || 20,
        strokeWidth: qrLayout.strokeWidth,
      },
      productPhoto: {
        show: qrLayout.includeProductPhoto ?? true,
        width: qrLayout.productPhotoWidth || 150,
        height: qrLayout.productPhotoHeight || 150,
        x: qrLayout.productPhotoX || 0,
        y: qrLayout.productPhotoY || 0,
        rotation: 0,
        roundness: qrLayout.productPhotoRoundness ?? 100,
        fitMode: 'cover',
        bgColor: '#E5E7EB',
        hasSavedCoordinates: false
      },
      garmentName: {
        show: qrLayout.includeGarmentName ?? true,
        width: qrLayout.garmentNameWidth || 300,
        height: qrLayout.garmentNameHeight || 50,
        x: qrLayout.garmentNameX || 0,
        y: qrLayout.garmentNameY || 0,
        fontFamily: qrLayout.garmentNameFontFamily || 'Inter, sans-serif',
        fontSize: qrLayout.garmentNameFontSize || 48,
        fontColor: qrLayout.garmentNameFontColor || '#000000',
        fontWeight: qrLayout.garmentNameFontWeight || '600',
        textAlign: qrLayout.garmentNameTextAlign || 'center',
        textVerticalAlign: qrLayout.garmentNameTextVerticalAlign || 'middle',
        rotation: qrLayout.garmentNameRotation || 0,
        text: guestNameData || 'Guest Name',
        hasSavedCoordinates: false
      },
      errorCorrectionLevel: qrLayout.errorCorrectionLevel || 'Q'
    }
  }, [url, personalizationConfig?.qrLayout, bgUrl, logoUrl, guestNameData, isLoadingVisuals])

  useEffect(() => {
    const generatePreview = async () => {
      if (!finalQRLayout) {
        setPreviewUrl('')
        return
      }
      try {
        const blob = await renderQR(finalQRLayout, guestPhotoUrl)
        const objUrl = URL.createObjectURL(blob)
        setPreviewUrl(objUrl)

        return () => URL.revokeObjectURL(objUrl)
      } catch (error) {
        console.error('Error generating QR preview:', error)
        setPreviewUrl('')
      }
    }

    generatePreview()
  }, [finalQRLayout, guestPhotoUrl])

  const triggerDownload = (blob: Blob, filename: string) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadPNG = async () => {
    if (!finalQRLayout) return
    try {
      const blob = await renderQR(finalQRLayout, guestPhotoUrl)
      triggerDownload(blob, `qr-${id || 'preview'}.png`)
    } catch (error) {
      console.error('Error downloading PNG:', error)
    }
  }

  const downloadSVG = async () => {
    if (!finalQRLayout) return
    try {
      const blob = await renderQRSVG(finalQRLayout, guestPhotoUrl)
      triggerDownload(blob, `qr-${id || 'preview'}.svg`)
    } catch (error) {
      console.error('Error downloading SVG:', error)
    }
  }

  if (!id) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-800 rounded border border-yellow-200 text-sm">
        Save the guest first to generate a Custom QR.
      </div>
    )
  }

  return (
    <div style={{ height: 'calc(100vh - 200px)', minHeight: '600px', display: 'flex', flexDirection: 'column', width: '100%', border: '1px solid var(--theme-elevation-200)', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '8px 16px', 
        backgroundColor: 'var(--theme-elevation-50)', 
        borderBottom: '1px solid var(--theme-elevation-200)',
        gap: '16px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--theme-text)', fontFamily: 'monospace', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--theme-elevation-500)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--theme-text)'}>{url}</a>
        </div>
        <div className="topbar-btn-override" style={{ display: 'flex', gap: '8px', flexShrink: 0, position: 'relative' }}>
          <style dangerouslySetInnerHTML={{ __html: `
            .topbar-btn-override button {
              margin: 0 !important;
            }
          `}} />
          <Button buttonStyle="primary" size="small" onClick={() => setDownloadOpen(!downloadOpen)}>
            Download QR
          </Button>
          {downloadOpen && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 9 }}
                onClick={() => setDownloadOpen(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '220px',
                  backgroundColor: 'var(--theme-elevation-0)',
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <button
                  onClick={() => {
                    downloadPNG()
                    setDownloadOpen(false)
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px 16px',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--theme-elevation-100)',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    border: 'none',
                    color: 'var(--theme-text)',
                    transition: 'background 0.15s'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--theme-elevation-50)')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ fontWeight: 500, fontSize: '14px' }}>PNG</div>
                  <div style={{ fontSize: '12px', color: 'var(--theme-elevation-400)', marginTop: '2px' }}>High quality raster image</div>
                </button>
                <button
                  onClick={() => {
                    downloadSVG()
                    setDownloadOpen(false)
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px 16px',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    border: 'none',
                    color: 'var(--theme-text)',
                    transition: 'background 0.15s'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--theme-elevation-50)')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ fontWeight: 500, fontSize: '14px' }}>SVG Vector</div>
                  <div style={{ fontSize: '12px', color: 'var(--theme-elevation-400)', marginTop: '2px' }}>Scalable vector graphics</div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          backgroundColor: 'var(--theme-elevation-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
      {!previewUrl && (
        <div
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'var(--theme-elevation-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--theme-elevation-400)',
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
            `,
            }}
          />
          <span>{isLoadingVisuals ? 'Loading configuration...' : 'Generating Custom QR...'}</span>
        </div>
      )}

      {previewUrl && finalQRLayout && (
        <QRComposer
          showOutlinesInReadOnly={false}
          qrLayout={finalQRLayout}
          agentPhotoUrl={guestPhotoUrl}
          fallbackPhotoIcon={
            <img
              src={GUEST_PLACEHOLDER_URL}
              style={{
                width: '100%',
                height: '100%',
                objectFit: (finalQRLayout.productPhoto?.fitMode as 'cover' | 'contain' | 'fill') || 'cover',
                pointerEvents: 'none',
              }}
              alt="Guest Placeholder"
            />
          }
        />
      )}
      </div>
    </div>
  )
}

export default GuestQRCode
