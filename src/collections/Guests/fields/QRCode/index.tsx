'use client'

import { Button, useDocumentInfo, useField } from '@payloadcms/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { QRLayout, renderQR, renderQRSVG } from '../../../../globals/Personalization/fields/InvitationDesigner/utils'

// Helper to fetch media
const fetchMediaIfId = async (input: string | any, collection: string): Promise<any> => {
  if (typeof input === 'string' && input.length > 0) {
    try {
      const res = await fetch(`/api/${collection}/${input}`)
      if (res.ok) return await res.json()
    } catch (e) {
      console.error('Error fetching media', input, e)
    }
  }
  // If it's an object with a URL, return it
  if (typeof input === 'object' && input?.url) return input
  return input
}

export const QRCode: React.FC = () => {
  const { id } = useDocumentInfo()
  const { value: slug } = useField<string>({ path: 'slug' })

  const [personalization, setPersonalization] = useState<any>(null)
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [bgUrl, setBgUrl] = useState<string>('')
  const [previewUrl, setPreviewUrl] = useState<string>('')

  // 1. Fetch Personalization Global
  useEffect(() => {
    const fetchGlobal = async () => {
      try {
        const req = await fetch('/api/globals/personalization?depth=1')
        if (req.ok) {
          const data = await req.json()
          setPersonalization(data)
        }
      } catch (err) {
        console.error('Error fetching personalization:', err)
      }
    }
    fetchGlobal()
  }, [])

  // 2. Resolve Assets (Logo / Background) from Personalization
  useEffect(() => {
    const fetchAssets = async () => {
      if (!personalization) return

      // NOTE: Adjust paths based on actual Personalization Global structure
      // Assuming 'logo' is a top-level field or inside qrLayout if configured that way.
      // Based on previous file views, qrLayout had 'backgroundImage' but not explicitly 'logo' at top level yet,
      // but the snippet referenced 'brandData.logo'. I'll check for both.
      
      const logoField = personalization.logo || personalization.qrLayout?.logo
      if (logoField) {
         // If it's an object (from depth=1) or ID
         const l = await fetchMediaIfId(logoField, 'media') // Using 'media' collection as standard
         if (l?.url) setLogoUrl(l.url)
      } else {
         setLogoUrl('')
      }

      const bgField = personalization.qrLayout?.backgroundImage
      if (bgField) {
        const bg = await fetchMediaIfId(bgField, 'media')
        if (bg?.url) setBgUrl(bg.url)
      } else {
        setBgUrl('')
      }
    }
    fetchAssets()
  }, [personalization])

  const url = (slug || id) ? `${process.env.NEXT_PUBLIC_APP_URL}/${slug || id}` : ''
  
  // 3. Build QRLayout Object
  const finalQRLayout: QRLayout | null = useMemo(() => {
    if (!url || !personalization) return null

    const layoutSettings = personalization.qrLayout || {}

    return {
      url,
      dots: {
        type: layoutSettings.dotsType || 'square',
        color: layoutSettings.color || '#000000',
      },
      cornersSquare: {
        type: layoutSettings.cornersSquareType || 'square',
        color: layoutSettings.cornersSquareColor || layoutSettings.color || '#000000',
      },
      cornersDot: {
        type: layoutSettings.cornersDotType || 'square',
        color: layoutSettings.cornersDotColor || layoutSettings.cornersSquareColor || layoutSettings.color || '#000000',
      },
      background: {
        image: bgUrl,
        qrSize: layoutSettings.qrSize || 300,
        qrX: layoutSettings.qrX || 0,
        qrY: layoutSettings.qrY || 0,
      },
      logo: {
        show: layoutSettings.logo?.show ?? false,
        image: logoUrl,
        size: layoutSettings.logo?.size || 20,
      },
    }
  }, [url, personalization, bgUrl, logoUrl])

  // 4. Generate Preview
  useEffect(() => {
    let active = true
    let objectUrl: string | null = null

    const generatePreview = async () => {
      if (!finalQRLayout) {
        setPreviewUrl('')
        return
      }
      try {
        const blob = await renderQR(finalQRLayout)
        if (!active) return

        objectUrl = URL.createObjectURL(blob)
        setPreviewUrl(objectUrl)
      } catch (error) {
        console.error('Error generating QR preview:', error)
        if (active) setPreviewUrl('')
      }
    }

    generatePreview()

    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [finalQRLayout])

  // 5. Download Handlers
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
      const blob = await renderQR(finalQRLayout)
      triggerDownload(blob, `guest-qr-${slug || id}.png`)
    } catch (error) {
      console.error('Error downloading PNG:', error)
    }
  }

  const downloadSVG = async () => {
    if (!finalQRLayout) return
    try {
      const blob = await renderQRSVG(finalQRLayout)
      triggerDownload(blob, `guest-qr-${slug || id}.svg`)
    } catch (error) {
      console.error('Error downloading SVG:', error)
    }
  }

  if (!url) {
    return <div className="p-4 text-sm text-gray-500">Save the guest to generate a QR code.</div>
  }

  return (
    <div className="flex flex-col w-full">
      <label
        style={{
          fontSize: '13px',
          lineHeight: '20px',
          color: 'var(--theme-elevation-800)',
          marginBottom: '8px',
          display: 'block',
          fontWeight: 600,
        }}
      >
        Guest QR Code
      </label>
      <div
        style={{
          width: '100%',
          backgroundColor: 'var(--theme-elevation-50)',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: 'var(--style-radius-m)',
          padding: '20px',
        }}
      >
        <div style={{ width: '100%', position: 'relative' }}>
          {!previewUrl && (
             <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
               {personalization ? 'Generating...' : 'Loading Config...'}
             </div>
          )}

          {previewUrl && (
            <div
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                  style={{
                    backgroundColor: bgUrl ? 'transparent' : 'white',
                    borderRadius: 'var(--style-radius-m)',
                    padding: '10px',
                    width: 'fit-content',
                  }}
                >
                <img
                    src={previewUrl}
                    alt="QR Code"
                    style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    display: 'block',
                    }}
                />
              </div>
            </div>
          )}
        </div>

        {/* QR Link Text */}
        <div style={{ marginTop: '1rem', textAlign: 'center', width: '100%', overflow: 'hidden' }}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                fontSize: '12px',
                color: '#999',
                textDecoration: 'none',
                fontFamily: 'monospace',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}
            title={url}
          >
            {url}
          </a>
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginTop: '12px',
          width: '100%',
        }}
      >
        <Button buttonStyle="secondary" onClick={downloadSVG}>
          Download SVG
        </Button>
        <Button buttonStyle="secondary" onClick={downloadPNG}>
          Download PNG
        </Button>
      </div>
    </div>
  )
}
