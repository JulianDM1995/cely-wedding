'use client'

import QRCodeStyling, { CornerDotType, CornerSquareType, DotType, Options } from 'qr-code-styling'
import React, { useEffect, useRef, useState } from 'react'
import { Rnd } from 'react-rnd'

import { InvitationLayout } from './utils'

export const InvitationComposer = ({
  invitationLayout,
  setQrSize,
  setQrPosition,
}: {
  invitationLayout: InvitationLayout
  setQrSize?: (size: number) => void
  setQrPosition?: (x: number, y: number) => void
}) => {
  const qrRef = useRef<HTMLDivElement>(null)
  const qrCode = useRef<QRCodeStyling | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [isSelected, setIsSelected] = useState(false)
  const [imageScale, setImageScale] = useState(1)

  const layout = {
    ...invitationLayout,
    logo: {
      ...invitationLayout.logo,
      show: invitationLayout.logo.show ?? false,
    },
  }

  useEffect(() => {
    const options: Options = {
      type: 'svg',
      data: layout.url,
      image: layout.logo.show ? layout.logo.image : undefined,
      dotsOptions: {
        color: layout.dots.color || '#000000',
        type: (layout.dots.type as DotType) || 'square',
      },
      cornersSquareOptions: {
        color: layout.cornersSquare.color || layout.dots.color || '#000000',
        type: (layout.cornersSquare.type as CornerSquareType) || 'square',
      },
      cornersDotOptions: {
        color:
          layout.cornersDot.color || layout.cornersSquare.color || layout.dots.color || '#000000',
        type: (layout.cornersDot.type as CornerDotType) || 'square',
      },
      backgroundOptions: {
        color: 'transparent',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5,
        saveAsBlob: true,
        imageSize: (layout.logo.size || 20) / 100,
      },
    }

    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling(options)
    } else {
      qrCode.current.update(options)
    }

    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qrCode.current.append(qrRef.current)

      const svg = qrRef.current.querySelector('svg')
      if (svg) {
        svg.style.width = '100%'
        svg.style.height = '100%'
      }
    }
  }, [layout])

  // Calculate scale when image loads
  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const updateScale = () => {
      if (img.naturalWidth && img.clientWidth) {
        const scale = img.clientWidth / img.naturalWidth
        setImageScale(scale)
      }
    }

    img.addEventListener('load', updateScale)
    updateScale() // In case already loaded

    return () => img.removeEventListener('load', updateScale)
  }, [layout.background.image])

  const QR = <div ref={qrRef} style={{ width: '100%', height: '100%' }} />

  // CASE 1: Background Image exists
  if (!!layout.background.image) {
    // Calculate scaled positions and size
    const scaledSize = layout.background.qrSize * imageScale
    const scaledX = layout.background.qrX * imageScale
    const scaledY = layout.background.qrY * imageScale

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          overflow: 'visible',
          position: 'relative',
          gap: '8px',
        }}
        onClick={() => setIsSelected(false)}
      >
        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            userSelect: 'none',
          }}
        >
          {/* Render Background Image */}
          <img
            ref={imgRef}
            src={layout.background.image}
            alt="QR Background"
            style={{
              height: '100%',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              pointerEvents: 'none',
            }}
          />

          {/* Render QR Code */}
          {setQrSize && setQrPosition ? (
            <Rnd
              size={{ width: scaledSize, height: scaledSize }}
              position={{ x: scaledX, y: scaledY }}
              onDragStop={(_e: any, d: any) => {
                // Convert back to original image coordinates
                const originalX = d.x / imageScale
                const originalY = d.y / imageScale
                setQrPosition(Math.round(originalX), Math.round(originalY))
              }}
              onResizeStop={(_e: any, _direction: any, ref: any, _delta: any, position: any) => {
                // Convert back to original image coordinates
                const newSize = parseInt(ref.style.width, 10) / imageScale
                const originalX = position.x / imageScale
                const originalY = position.y / imageScale
                setQrSize(Math.round(newSize))
                setQrPosition(Math.round(originalX), Math.round(originalY))
              }}
              lockAspectRatio={true}
              bounds="parent"
              disableDragging={!isSelected}
              enableResizing={
                isSelected
                  ? {
                      bottomRight: true,
                      bottomLeft: true,
                      topRight: true,
                      topLeft: true,
                    }
                  : false
              }
              resizeHandleStyles={
                isSelected
                  ? {
                      bottomRight: {
                        width: '12px',
                        height: '12px',
                        backgroundColor: 'var(--theme-primary-500, #0069ff)',
                        border: '2px solid white',
                        borderRadius: '50%',
                        right: '-6px',
                        bottom: '-6px',
                      },
                      bottomLeft: {
                        width: '12px',
                        height: '12px',
                        backgroundColor: 'var(--theme-primary-500, #0069ff)',
                        border: '2px solid white',
                        borderRadius: '50%',
                        left: '-6px',
                        bottom: '-6px',
                      },
                      topRight: {
                        width: '12px',
                        height: '12px',
                        backgroundColor: 'var(--theme-primary-500, #0069ff)',
                        border: '2px solid white',
                        borderRadius: '50%',
                        right: '-6px',
                        top: '-6px',
                      },
                      topLeft: {
                        width: '12px',
                        height: '12px',
                        backgroundColor: 'var(--theme-primary-500, #0069ff)',
                        border: '2px solid white',
                        borderRadius: '50%',
                        left: '-6px',
                        top: '-6px',
                      },
                    }
                  : undefined
              }
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                setIsSelected(true)
              }}
              style={{
                outline: isSelected ? '2px solid var(--theme-primary-500, #0069ff)' : 'none',
                cursor: isSelected ? 'move' : 'pointer',
                position: 'absolute',
                top: 0,
                left: 0,
                boxSizing: 'border-box',
                userSelect: 'none',
              }}
            >
              {QR}
            </Rnd>
          ) : (
            // Read-only view
            <div
              style={{
                position: 'absolute',
                top: `${scaledY}px`,
                left: `${scaledX}px`,
                width: `${scaledSize}px`,
                height: `${scaledSize}px`,
              }}
            >
              {QR}
            </div>
          )}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: 'var(--theme-text, #333)',
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          {layout.url}
        </div>
      </div>
    )
  }

  // CASE 2: No Background (Full Size QR)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      <div
        style={{
          height: '100%',
          aspectRatio: '1/1',
          backgroundColor: '#fff',
          borderRadius: 'var(--style-radius-s)',
          padding: '4px',
        }}
      >
        {QR}
      </div>
      <div
        style={{
          fontSize: '12px',
          color: 'var(--theme-text, #333)',
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        {layout.url}
      </div>
    </div>
  )
}
