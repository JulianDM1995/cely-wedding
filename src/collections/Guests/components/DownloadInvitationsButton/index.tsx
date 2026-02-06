'use client'

import { QRLayout, renderQR } from '@/globals/Personalization/fields/InvitationDesigner/utils'
import { Button } from '@payloadcms/ui'
import jsPDF from 'jspdf'
import React, { useState } from 'react'
import { FaFilePdf } from 'react-icons/fa'

// Helper to convert Blob to Data URL
const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Helper to load image from data URL
const loadImageFromUrl = (dataUrl: string): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = dataUrl
  })
}

export const DownloadInvitationsButton: React.FC = () => {
  const [opened, setOpened] = useState(false)
  const open = () => setOpened(true)
  const close = () => setOpened(false)

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [progressVal, setProgressVal] = useState(0)
  const [totalVal, setTotalVal] = useState(0)

  const [config, setConfig] = useState<{
    pageSize: string
    qrSize: number
    margin: number
    fontSize: number
    showText: boolean
    text: string
  }>({
    pageSize: 'a4',
    qrSize: 50, // mm (Width)
    margin: 10, // mm
    fontSize: 10, // pt
    showText: true,
    text: '',
  })
  
  // Simple textual query params input for now
  const [extraParams, setExtraParams] = useState('')


  const generatePDF = async () => {
    setLoading(true)
    setProgress('Fetching data...')
    setProgressVal(0)
    setTotalVal(0)

    try {
      // 1. Fetch Personalization Global (Source of Truth for Settings) with depth=1 for Media
      const globalRes = await fetch('/api/globals/personalization?depth=1')
      const personalization = await globalRes.json()
      
      const qrLayoutSettings = personalization.qrLayout || {}

      // 2. Fetch Guests
      const res = await fetch('/api/guests?limit=1000&depth=0')
      const data = await res.json()

      if (!data.docs || data.docs.length === 0) {
        alert('No guests found')
        setLoading(false)
        return
      }

      const guests = data.docs
      setTotalVal(guests.length)

      // Prefer env variable for host
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin

      const doc = new jsPDF({
        format: config.pageSize,
        unit: 'mm',
      })

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      const targetWidth = Number(config.qrSize)
      const margin = Number(config.margin)
      const fontSize = Number(config.fontSize)
      const textSpace = config.showText ? fontSize / 2 + 5 : 0 // Approx space for text

      // We will track position dynamically
      let x = margin
      let y = margin
      // Track max height in current row
      let currentRowMaxHeight = 0

      for (let i = 0; i < guests.length; i++) {
        setProgressVal(i + 1)
        const guest = guests[i]

        setProgress(`Generating ${i + 1}/${guests.length}: ${guest.name}`)

        // --- 1. Construct URL (Slug) ---
        // Using slug as identifier
        let identifier = guest.slug || guest.id
        
        let url = `${appUrl}/${identifier}`

        // Append Query Params
        if (extraParams) {
           if (url.includes('?')) {
             url += `&${extraParams}`
           } else {
             url += `?${extraParams}`
           }
        }

        // --- 2. Build QRLayout and Generate Image using renderQR ---
        // Get background image URL from global
        let bgImageUrl = ''
        if (qrLayoutSettings.backgroundImage && typeof qrLayoutSettings.backgroundImage === 'object') {
          bgImageUrl = qrLayoutSettings.backgroundImage.url || ''
        } else if (qrLayoutSettings.backgroundImage && typeof qrLayoutSettings.backgroundImage === 'string') {
          // Fallback if somehow we get a string ID despite depth=1, or for robustness
        }

        // Build QRLayout object
        const qrLayoutObj: QRLayout = {
          url,
          dots: {
            type: qrLayoutSettings.dotsType || 'square',
            color: qrLayoutSettings.color || '#000000',
          },
          cornersSquare: {
            type: qrLayoutSettings.cornersSquareType || 'square',
            color: qrLayoutSettings.cornersSquareColor || qrLayoutSettings.color || '#000000',
          },
          cornersDot: {
            type: qrLayoutSettings.cornersDotType || 'square',
            color:
              qrLayoutSettings.cornersDotColor ||
              qrLayoutSettings.cornersSquareColor ||
              qrLayoutSettings.color ||
              '#000000',
          },
          background: {
            image: bgImageUrl,
            qrSize: qrLayoutSettings.qrSize || 300,
            qrX: qrLayoutSettings.qrX || 0,
            qrY: qrLayoutSettings.qrY || 0,
          },
          logo: {
            show: qrLayoutSettings.logo?.show ?? false, // Not in global yet but present in type
            image: '', // Logo not fully implemented in global yet based on snippet
            size: 20,
          },
        }

        // Generate QR image using renderQR
        const blob = await renderQR(qrLayoutObj)
        const imgData = await blobToDataURL(blob)

        // --- 3. Calculate dimensions ---
        // If background image exists, we need to determine aspect ratio
        let finalAspectRatio = 1
        if (bgImageUrl) {
          // Load image to get aspect ratio
          const img = await loadImageFromUrl(imgData)
          if (img) {
            finalAspectRatio = img.width / img.height
          }
        }

        const renderWidth = targetWidth
        const renderHeight = targetWidth / finalAspectRatio

        const cellHeight = renderHeight + textSpace + 5
        const cellWidth = renderWidth + 5

        // Wrap logic
        if (x + renderWidth > pageWidth - margin) {
          x = margin
          y += currentRowMaxHeight > 0 ? currentRowMaxHeight : 0
          currentRowMaxHeight = 0

          // Check Page Wrap
          if (y + cellHeight > pageHeight - margin) {
            doc.addPage()
            y = margin
            x = margin
            currentRowMaxHeight = 0
          }
        }

        if (cellHeight > currentRowMaxHeight) currentRowMaxHeight = cellHeight

        doc.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight)

        if (config.showText) {
          doc.setFontSize(fontSize)
          const name = guest.name || 'Guest'
          const splitText = doc.splitTextToSize(name, renderWidth)
          doc.text(splitText, x, y + renderHeight + 5)
        }

        x += cellWidth

        // Breathe
        await new Promise((r) => setTimeout(r, 0))
      }

      setProgress('Saving PDF...')
      doc.save(`guests-invitations-${config.pageSize}-${new Date().toISOString().split('T')[0]}.pdf`)
      close()
    } catch (e) {
      console.error('Error generating PDF', e)
      alert('Error generating PDF. Check console.')
    } finally {
      setLoading(false)
      setProgress('')
    }
  }

  // Styles (adapted from snippet)
  const modalStyles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: 'var(--theme-elevation-50)',
      padding: '24px',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '450px',
      boxShadow: 'var(--theme-shadow-lg)',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
      color: 'var(--theme-text)',
    },
    header: {
      fontSize: '1.25rem',
      fontWeight: 600,
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    row: {
      display: 'flex',
      gap: '16px',
    },
    field: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    label: {
      fontSize: '12px',
      fontWeight: 500,
      color: 'var(--theme-text-secondary)',
    },
    input: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid var(--theme-elevation-200)',
      fontSize: '14px',
      width: '100%',
      backgroundColor: 'var(--theme-input-bg)',
      color: 'var(--theme-text)',
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '16px',
    },
  }

  return (
    <>
      {opened && (
        <div
          style={modalStyles.overlay}
          onClick={(e) => e.target === e.currentTarget && !loading && close()}
        >
          <div style={modalStyles.modal}>
            <div style={modalStyles.header}>
              <FaFilePdf /> Configure PDF
            </div>

            <div style={modalStyles.row}>
              <div style={modalStyles.field}>
                <label style={modalStyles.label}>Page Size</label>
                <select
                  style={modalStyles.input}
                  value={config.pageSize}
                  onChange={(e) => setConfig({ ...config, pageSize: e.target.value })}
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
              <div style={modalStyles.field}>
                <label style={modalStyles.label}>QR Width (mm)</label>
                <input
                  type="number"
                  style={modalStyles.input}
                  value={config.qrSize}
                  onChange={(e) => setConfig({ ...config, qrSize: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={modalStyles.row}>
              <div style={modalStyles.field}>
                <label style={modalStyles.label}>Page Margin (mm)</label>
                <input
                  type="number"
                  style={modalStyles.input}
                  value={config.margin}
                  onChange={(e) => setConfig({ ...config, margin: Number(e.target.value) })}
                />
              </div>
              <div style={modalStyles.field}>
                <label style={modalStyles.label}>Font Size (pt)</label>
                <input
                  type="number"
                  style={modalStyles.input}
                  value={config.fontSize}
                  onChange={(e) => setConfig({ ...config, fontSize: Number(e.target.value) })}
                  disabled={!config.showText}
                />
              </div>
            </div>
            
            <div style={modalStyles.field}>
                 <label style={modalStyles.label}>Extra URL Params (e.g. source=qr)</label>
                 <input
                   type="text"
                   style={modalStyles.input}
                   value={extraParams}
                   onChange={(e) => setExtraParams(e.target.value)}
                   placeholder="key=value&key2=value2"
                 />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={config.showText}
                  onChange={(e) => setConfig({ ...config, showText: e.target.checked })}
                  style={{ cursor: 'pointer' }}
                />
                <label style={modalStyles.label} onClick={() => setConfig({ ...config, showText: !config.showText })}>
                   Show Guest Name
                </label>
            </div>

            {loading && (
              <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <div>{progress}</div>
                {totalVal > 0 && <div>{Math.round((progressVal / totalVal) * 100)}%</div>}
              </div>
            )}

            <div style={modalStyles.footer}>
              <Button buttonStyle="secondary" onClick={close} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={generatePDF} disabled={loading}>
                {loading ? 'Generating...' : 'Generate PDF'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button buttonStyle="pill" onClick={open}>
        Download Invitations
      </Button>
    </>
  )
}
