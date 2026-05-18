/* eslint-disable @next/next/no-img-element */
import QRCodeStyling, { CornerDotType, CornerSquareType, DotType, Options } from 'qr-code-styling'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaRobot } from 'react-icons/fa'
import { TransformBox } from './TransformBox'
import { resolveLogoSizePercentage } from './utils'

export interface QRLayout {
  url: string
  dots: {
    type: string
    color: string
  }
  cornersSquare: {
    type: string
    color: string
  }
  cornersDot: {
    type: string
    color: string
  }
  background: {
    image: string
    qrSize: number
    qrX: number
    qrY: number
    qrRotation?: number
  }
  logo: {
    show: boolean
    image: string
    size: number
    strokeWidth?: number
  }
  productPhoto?: {
    show: boolean
    width: number
    height: number
    x: number
    y: number
    rotation?: number
    roundness?: number
    bgColor?: string
    fitMode?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    hasSavedCoordinates?: boolean
  }
  garmentName?: {
    show: boolean
    width: number
    height: number
    x: number
    y: number
    fontFamily: string
    fontSize: number
    fontColor: string
    fontWeight: string
    textAlign: 'left' | 'center' | 'right'
    textVerticalAlign?: 'top' | 'middle' | 'bottom'
    rotation?: number
    text?: string
    hasSavedCoordinates?: boolean
  }
  errorCorrectionLevel?: string
}

export const QRComposer = ({
  qrLayout,
  agentPhotoUrl,
  fallbackPhotoIcon,
  lockProductPhotoAspectRatio = true,
  setQrSize,
  setQrPosition,
  setQrRotation,
  setProductPhotoWidth,
  setProductPhotoHeight,
  setProductPhotoPosition,
  setProductPhotoRotation,
  setProductPhotoRoundness,
  setGarmentNameWidth,
  setGarmentNameHeight,
  setGarmentNamePosition,
  setGarmentNameRotation,
  showOutlinesInReadOnly = true,
}: {
  qrLayout: QRLayout
  agentPhotoUrl?: string
  fallbackPhotoIcon?: React.ReactNode
  showOutlinesInReadOnly?: boolean
  lockProductPhotoAspectRatio?: boolean
  setQrSize?: (size: number) => void
  setQrPosition?: (x: number, y: number) => void
  setQrRotation?: (rotation: number) => void
  setProductPhotoWidth?: (width: number) => void
  setProductPhotoHeight?: (height: number) => void
  setProductPhotoPosition?: (x: number, y: number) => void
  setProductPhotoRotation?: (rotation: number) => void
  setProductPhotoRoundness?: (roundness: number) => void
  setGarmentNameWidth?: (width: number) => void
  setGarmentNameHeight?: (height: number) => void
  setGarmentNamePosition?: (x: number, y: number) => void
  setGarmentNameRotation?: (rotation: number) => void
}) => {
  const qrRef = useRef<HTMLDivElement>(null)
  const qrCode = useRef<QRCodeStyling | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const workspaceRef = useRef<HTMLDivElement>(null)

  const [selectedElement, setSelectedElement] = useState<
    'qr' | 'productPhoto' | 'garmentName' | null
  >(null)
  const [imageScale, setImageScale] = useState(1)
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null)

  // Snap lines & drag state
  type SnapLine = { axis: 'x' | 'y'; pos: number; targetType: 'canvas' | 'object'; span?: [number, number]; featureSpan?: [number, number]; point?: { x: number, y: number } }
  const [snapLines, setSnapLines] = useState<SnapLine[]>([])
  const SNAP_THRESHOLD = 10 // Magnetic distance in pixels
  const CANVAS_PADDING = 14 // Padding around the workspace in pixels

  const productPhotoNodeRef = useRef<HTMLDivElement | null>(null)
  const garmentNameNodeRef = useRef<HTMLDivElement | null>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const dragValuesRef = useRef<{
    productPhotoRoundness?: number
  }>({})

  const layout = useMemo<QRLayout>(
    () => ({
      ...qrLayout,
      logo: {
        ...qrLayout.logo,
        show: qrLayout.logo?.show ?? false,
        strokeWidth: qrLayout.logo?.strokeWidth ?? 3,
      },
      productPhoto: {
        ...qrLayout.productPhoto,
        show: qrLayout.productPhoto?.show ?? false,
        width: qrLayout.productPhoto?.width ?? 150,
        height: qrLayout.productPhoto?.height ?? 150,
        x: qrLayout.productPhoto?.x ?? 0,
        y: qrLayout.productPhoto?.y ?? 0,
        rotation: qrLayout.productPhoto?.rotation ?? 0,
        roundness: qrLayout.productPhoto?.roundness ?? 0,
        bgColor: qrLayout.productPhoto?.bgColor,
        fitMode: qrLayout.productPhoto?.fitMode,
      },
    }),
    [qrLayout],
  )

  useEffect(() => {
    const options: Options = {
      type: 'svg',
      data: layout.url,
      // Generate a hole matching the downloaded QR code by passing a 1x1 transparent image when logo is enabled
      image: layout.logo.show && layout.logo.image ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' : undefined,
      imageOptions: {
        margin: 5,
        imageSize: resolveLogoSizePercentage(layout.logo.size, layout.errorCorrectionLevel),
      },
      qrOptions: {
        errorCorrectionLevel: (layout.errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H') || 'Q',
      },
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
        if (!svg.getAttribute('viewBox')) {
          const w = svg.getAttribute('width') || '300'
          const h = svg.getAttribute('height') || '300'
          svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
        }
      }
    }
  }, [layout, naturalSize])

  // Calculate scale when image loads and dimensions shift continuously
  useEffect(() => {
    const img = imgRef.current
    const workspace = workspaceRef.current
    if (!img || !workspace) return

    const updateScale = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })

        const rect = workspace.getBoundingClientRect()
        const paddingOffset = CANVAS_PADDING * 2
        const sw = (rect.width - paddingOffset) / img.naturalWidth
        const sh = (rect.height - paddingOffset) / img.naturalHeight
        setImageScale(Math.min(sw, sh))
      }
    }

    img.addEventListener('load', updateScale)
    updateScale() // Bootstrap

    // Bind native resize detection
    const ro = new ResizeObserver(() => {
      updateScale()
    })
    ro.observe(workspace)

    return () => {
      img.removeEventListener('load', updateScale)
      ro.disconnect()
    }
  }, [layout.background.image])

  // --- Auto-center newly enabled elements ---
  const prevPhotoShow = useRef(layout.productPhoto?.show)
  useEffect(() => {
    if (
      layout.productPhoto?.show &&
      !prevPhotoShow.current &&
      naturalSize &&
      setProductPhotoPosition &&
      !layout.productPhoto.hasSavedCoordinates
    ) {
      const w = layout.productPhoto.width || 150
      const h = layout.productPhoto.height || 150
      const newX = (naturalSize.w - w) / 2
      const newY = (naturalSize.h - h) / 2
      setProductPhotoPosition(Math.round(newX), Math.round(newY))
    }
    prevPhotoShow.current = layout.productPhoto?.show
  }, [
    layout.productPhoto?.show,
    naturalSize,
    setProductPhotoPosition,
    layout.productPhoto?.width,
    layout.productPhoto?.height,
    layout.productPhoto?.hasSavedCoordinates,
  ])

  const prevNameShow = useRef(layout.garmentName?.show)
  useEffect(() => {
    if (
      layout.garmentName?.show &&
      !prevNameShow.current &&
      naturalSize &&
      setGarmentNamePosition &&
      !layout.garmentName.hasSavedCoordinates
    ) {
      const w = layout.garmentName?.width || 200
      const h = layout.garmentName?.height || 50
      const newX = (naturalSize.w - w) / 2
      const newY = (naturalSize.h - h) / 2
      setGarmentNamePosition(Math.round(newX), Math.round(newY))
    }
    prevNameShow.current = layout.garmentName?.show
  }, [
    layout.garmentName?.show,
    naturalSize,
    setGarmentNamePosition,
    layout.garmentName?.width,
    layout.garmentName?.height,
    layout.garmentName?.hasSavedCoordinates,
  ])

  // Rotation is applied on inner wrapper divs, not on the Rnd element itself.
  // This avoids the conflict where react-rnd overwrites `transform: translate(x,y)`
  // and loses our `rotate(Xdeg)` since both target the same CSS property.

  const QR = <div ref={qrRef} style={{ width: '100%', height: '100%' }} />

  // --- SNAPPING LOGIC ---
  const getCorners = (x: number, y: number, w: number, h: number, rotation: number) => {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rad = rotation * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const rotatePoint = (px: number, py: number) => ({
      x: cx + (px - cx) * cos - (py - cy) * sin,
      y: cy + (px - cx) * sin + (py - cy) * cos
    });

    return [
      rotatePoint(x, y), // top-left
      rotatePoint(x + w, y), // top-right
      rotatePoint(x + w, y + h), // bottom-right
      rotatePoint(x, y + h) // bottom-left
    ];
  };

  const handleSnapDrag = (
    id: 'qr' | 'productPhoto' | 'garmentName',
    x: number,
    y: number,
    w: number,
    h: number,
    rotation: number = 0
  ) => {
    const parent = imgRef.current
    if (!parent) return { x, y }

    const canvasW = parent.clientWidth
    const canvasH = parent.clientHeight

    // Define target lines we can snap to.
    const xTargets: { val: number; type: 'canvas' | 'object'; span?: [number, number]; point?: { x: number, y: number } }[] = [
      { val: 0, type: 'canvas' }, // Canvas Left
      { val: canvasW / 2, type: 'canvas' }, // Canvas Center
      { val: canvasW, type: 'canvas' }, // Canvas Right
    ]
    const yTargets: { val: number; type: 'canvas' | 'object'; span?: [number, number]; point?: { x: number, y: number } }[] = [
      { val: 0, type: 'canvas' }, // Canvas Top
      { val: canvasH / 2, type: 'canvas' }, // Canvas Center
      { val: canvasH, type: 'canvas' }, // Canvas Bottom
    ]

    // Add other elements to targets
    const addElementTargets = (elX: number, elY: number, elW: number, elH: number, elRot: number) => {
      if (!elRot || elRot === 0) {
        xTargets.push({ val: elX, type: 'object', span: [elY, elY + elH] })
        xTargets.push({ val: elX + elW / 2, type: 'object', span: [elY, elY + elH] })
        xTargets.push({ val: elX + elW, type: 'object', span: [elY, elY + elH] })

        yTargets.push({ val: elY, type: 'object', span: [elX, elX + elW] })
        yTargets.push({ val: elY + elH / 2, type: 'object', span: [elX, elX + elW] })
        yTargets.push({ val: elY + elH, type: 'object', span: [elX, elX + elW] })
      } else {
        const corners = getCorners(elX, elY, elW, elH, elRot);
        const cx = elX + elW / 2;
        const cy = elY + elH / 2;
        
        // Add center
        xTargets.push({ val: cx, type: 'object', span: [Math.min(...corners.map(c => c.y)), Math.max(...corners.map(c => c.y))] });
        yTargets.push({ val: cy, type: 'object', span: [Math.min(...corners.map(c => c.x)), Math.max(...corners.map(c => c.x))] });
        
        // Add corners (as "points")
        corners.forEach(c => {
          xTargets.push({ val: c.x, type: 'object', point: { x: c.x, y: c.y } });
          yTargets.push({ val: c.y, type: 'object', point: { x: c.x, y: c.y } });
        });
      }
    }

    if (id !== 'qr')
      addElementTargets(
        layout.background.qrX * imageScale,
        layout.background.qrY * imageScale,
        layout.background.qrSize * imageScale,
        layout.background.qrSize * imageScale,
        layout.background.qrRotation || 0
      )
    if (id !== 'productPhoto' && layout.productPhoto?.show)
      addElementTargets(
        (layout.productPhoto.x || 0) * imageScale,
        (layout.productPhoto.y || 0) * imageScale,
        (layout.productPhoto.width || 150) * imageScale,
        (layout.productPhoto.height || 150) * imageScale,
        layout.productPhoto.rotation || 0
      )
    if (id !== 'garmentName' && layout.garmentName?.show)
      addElementTargets(
        (layout.garmentName.x || 0) * imageScale,
        (layout.garmentName.y || 0) * imageScale,
        (layout.garmentName.width || 200) * imageScale,
        (layout.garmentName.height || 50) * imageScale,
        layout.garmentName.rotation || 0
      )

    // Features of the dragging element
    let xFeatures: { type: string; val: number; span: [number, number]; point?: { x: number, y: number } }[] = []
    let yFeatures: { type: string; val: number; span: [number, number]; point?: { x: number, y: number } }[] = []

    if (!rotation || rotation === 0) {
      xFeatures = [
        { type: 'left', val: x, span: [y, y + h] },
        { type: 'center', val: x + w / 2, span: [y, y + h] },
        { type: 'right', val: x + w, span: [y, y + h] },
      ]
      yFeatures = [
        { type: 'top', val: y, span: [x, x + w] },
        { type: 'center', val: y + h / 2, span: [x, x + w] },
        { type: 'bottom', val: y + h, span: [x, x + w] },
      ]
    } else {
      const corners = getCorners(x, y, w, h, rotation)
      const cx = x + w / 2
      const cy = y + h / 2
      
      const spanX: [number, number] = [Math.min(...corners.map(c => c.y)), Math.max(...corners.map(c => c.y))]
      const spanY: [number, number] = [Math.min(...corners.map(c => c.x)), Math.max(...corners.map(c => c.x))]

      xFeatures.push({ type: 'center', val: cx, span: spanX })
      yFeatures.push({ type: 'center', val: cy, span: spanY })
      
      corners.forEach((c, i) => {
        xFeatures.push({ type: `corner${i}`, val: c.x, span: spanX, point: { x: c.x, y: c.y } })
        yFeatures.push({ type: `corner${i}`, val: c.y, span: spanY, point: { x: c.x, y: c.y } })
      })
    }

    let finalX = x
    let finalY = y
    const newSnapLines: SnapLine[] = []

    // Find closest X
    let minDiffX = SNAP_THRESHOLD
    let bestDeltaX = 0
    let foundX = false

    for (const target of xTargets) {
      for (const feat of xFeatures) {
        const diff = Math.abs(feat.val - target.val)
        if (diff < minDiffX) {
          minDiffX = diff
          bestDeltaX = target.val - feat.val
          foundX = true
        }
      }
    }

    if (foundX) {
      finalX = x + bestDeltaX
      for (const target of xTargets) {
        for (const feat of xFeatures) {
          const delta = target.val - feat.val
          if (Math.abs(delta - bestDeltaX) < 0.1) {
            const pt = target.point || (feat.point ? { x: target.val, y: feat.point.y } : undefined)
            newSnapLines.push({ 
              axis: 'x', pos: target.val, targetType: target.type, 
              span: target.span, featureSpan: feat.span, point: pt 
            })
          }
        }
      }
    }

    // Find closest Y
    let minDiffY = SNAP_THRESHOLD
    let bestDeltaY = 0
    let foundY = false

    for (const target of yTargets) {
      for (const feat of yFeatures) {
        const diff = Math.abs(feat.val - target.val)
        if (diff < minDiffY) {
          minDiffY = diff
          bestDeltaY = target.val - feat.val
          foundY = true
        }
      }
    }

    if (foundY) {
      finalY = y + bestDeltaY
      for (const target of yTargets) {
        for (const feat of yFeatures) {
          const delta = target.val - feat.val
          if (Math.abs(delta - bestDeltaY) < 0.1) {
            const pt = target.point || (feat.point ? { x: feat.point.x, y: target.val } : undefined)
            newSnapLines.push({ 
              axis: 'y', pos: target.val, targetType: target.type, 
              span: target.span, featureSpan: feat.span, point: pt 
            })
          }
        }
      }
    }

    setSnapLines(newSnapLines)
    return { x: finalX, y: finalY }
  }

  const handleDragEnd = (
    setPosition: (x: number, y: number) => void,
    finalX: number,
    finalY: number,
  ) => {
    setSnapLines([])
    setPosition(Math.round(finalX / imageScale), Math.round(finalY / imageScale))
  }
  // ----------------------

  // CASE 1: Background Image exists
  if (!!layout.background.image) {
    // Calculate scaled positions and size for QR
    const scaledSize = layout.background.qrSize * imageScale
    const scaledX = layout.background.qrX * imageScale
    const scaledY = layout.background.qrY * imageScale

    // Calculate scaled positions and size for Product Photo (if enabled)
    const productPhotoEnabled = layout.productPhoto?.show
    const scaledPhotoWidth = (layout.productPhoto?.width || 150) * imageScale
    const scaledPhotoHeight = (layout.productPhoto?.height || 150) * imageScale
    const scaledPhotoX = (layout.productPhoto?.x || 0) * imageScale
    const scaledPhotoY = (layout.productPhoto?.y || 0) * imageScale

    // Calculate scaled positions and size for Garment Name (if enabled)
    const garmentNameEnabled = layout.garmentName?.show
    const scaledNameWidth = (layout.garmentName?.width || 200) * imageScale
    const scaledNameHeight = (layout.garmentName?.height || 50) * imageScale
    const scaledNameX = (layout.garmentName?.x || 0) * imageScale
    const scaledNameY = (layout.garmentName?.y || 0) * imageScale
    const selectedFontFamily = layout.garmentName?.fontFamily || 'Inter, sans-serif'

    return (
      <div
        ref={workspaceRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          overflow: 'hidden',
          position: 'relative',
          gap: '8px',
          padding: `${CANVAS_PADDING}px`,
          boxSizing: 'border-box',
        }}
        onClick={(e) => {
          if (
            e.target === workspaceRef.current ||
            e.target === imgRef.current ||
            e.target === imageWrapperRef.current
          ) {
            setSelectedElement(null)
          }
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .garment-font-override {
            font-family: ${selectedFontFamily} !important;
          }
        `,
          }}
        />
        <svg
          key={`svg-filter-${layout.logo.strokeWidth ?? 3}`}
          width="0"
          height="0"
          style={{ position: 'absolute', pointerEvents: 'none' }}
        >
          <defs>
            <filter
              id={`qr-logo-outline-${layout.logo.strokeWidth ?? 3}`}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feMorphology
                in="SourceAlpha"
                operator="dilate"
                radius={layout.logo.strokeWidth ?? 3}
                result="dilated"
              />
              <feFlood
                floodColor={layout.dots.color || '#000000'}
                floodOpacity="1"
                result="color"
              />
              <feComposite in="color" in2="dilated" operator="in" result="outline" />
              <feMerge>
                <feMergeNode in="outline" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
        <div
          ref={imageWrapperRef}
          style={{
            position: 'relative',
            width: naturalSize ? `${naturalSize.w * imageScale}px` : '100%',
            height: naturalSize ? `${naturalSize.h * imageScale}px` : '100%',
            display: 'block',
            userSelect: 'none',
          }}
        >
          {/* Render Background Image */}
          <img
            ref={imgRef}
            src={layout.background.image}
            alt="QR Background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              pointerEvents: 'none',
            }}
          />

          {!!naturalSize && (
            <>
              {/* Snap Guides */}
              {snapLines.map((line, i) => {
                const isCanvas = line.targetType === 'canvas'
                const color = isCanvas ? 'var(--theme-warning-500, #FFD700)' : 'var(--theme-primary-500, #ff007b)'
                const baseThickness = isCanvas ? 2 : 1
                
                if (line.axis === 'x') {
                  return (
                    <React.Fragment key={`snap-x-${i}`}>
                      {/* Main full-length line */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: `${line.pos - (baseThickness > 1 ? 1 : 0)}px`,
                          width: `${baseThickness}px`,
                          backgroundColor: color,
                          zIndex: 5,
                          pointerEvents: 'none',
                          opacity: isCanvas ? 0.8 : 0.6,
                        }}
                      />
                      {/* Thicker intersection segment for object alignments */}
                      {!isCanvas && line.span && (
                        <div
                          style={{
                            position: 'absolute',
                            top: `${line.span[0]}px`,
                            height: `${line.span[1] - line.span[0]}px`,
                            left: `${line.pos - 1}px`,
                            width: '3px',
                            backgroundColor: color,
                            zIndex: 6,
                            pointerEvents: 'none',
                            opacity: 1,
                          }}
                        />
                      )}
                      {/* Thicker intersection segment for the dragging element */}
                      {!isCanvas && line.featureSpan && (
                        <div
                          style={{
                            position: 'absolute',
                            top: `${line.featureSpan[0]}px`,
                            height: `${line.featureSpan[1] - line.featureSpan[0]}px`,
                            left: `${line.pos - 1}px`,
                            width: '3px',
                            backgroundColor: color,
                            zIndex: 6,
                            pointerEvents: 'none',
                            opacity: 1,
                          }}
                        />
                      )}
                      {/* Point for rotated object corner snap */}
                      {!isCanvas && line.point && (
                        <div
                          style={{
                            position: 'absolute',
                            left: `${line.point.x - 3}px`,
                            top: `${line.point.y - 3}px`,
                            width: '7px',
                            height: '7px',
                            backgroundColor: color,
                            borderRadius: '50%',
                            zIndex: 7,
                            pointerEvents: 'none',
                          }}
                        />
                      )}
                    </React.Fragment>
                  )
                } else {
                  return (
                    <React.Fragment key={`snap-y-${i}`}>
                      {/* Main full-length line */}
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: `${line.pos - (baseThickness > 1 ? 1 : 0)}px`,
                          height: `${baseThickness}px`,
                          backgroundColor: color,
                          zIndex: 5,
                          pointerEvents: 'none',
                          opacity: isCanvas ? 0.8 : 0.6,
                        }}
                      />
                      {/* Thicker intersection segment for object alignments */}
                      {!isCanvas && line.span && (
                        <div
                          style={{
                            position: 'absolute',
                            left: `${line.span[0]}px`,
                            width: `${line.span[1] - line.span[0]}px`,
                            top: `${line.pos - 1}px`,
                            height: '3px',
                            backgroundColor: color,
                            zIndex: 6,
                            pointerEvents: 'none',
                            opacity: 1,
                          }}
                        />
                      )}
                      {/* Thicker intersection segment for the dragging element */}
                      {!isCanvas && line.featureSpan && (
                        <div
                          style={{
                            position: 'absolute',
                            left: `${line.featureSpan[0]}px`,
                            width: `${line.featureSpan[1] - line.featureSpan[0]}px`,
                            top: `${line.pos - 1}px`,
                            height: '3px',
                            backgroundColor: color,
                            zIndex: 6,
                            pointerEvents: 'none',
                            opacity: 1,
                          }}
                        />
                      )}
                      {/* Point for rotated object corner snap */}
                      {!isCanvas && line.point && (
                        <div
                          style={{
                            position: 'absolute',
                            left: `${line.point.x - 3}px`,
                            top: `${line.point.y - 3}px`,
                            width: '7px',
                            height: '7px',
                            backgroundColor: color,
                            borderRadius: '50%',
                            zIndex: 7,
                            pointerEvents: 'none',
                          }}
                        />
                      )}
                    </React.Fragment>
                  )
                }
              })}

              {/* Render QR Code */}
              {setQrSize && setQrPosition ? (
                <TransformBox
                  x={scaledX}
                  y={scaledY}
                  width={scaledSize}
                  height={scaledSize}
                  rotation={layout.background?.qrRotation || 0}
                  selected={selectedElement === 'qr'}
                  onSelect={() => setSelectedElement('qr')}
                  lockAspectRatio={true}
                  onDrag={(x, y) => handleSnapDrag('qr', x, y, scaledSize, scaledSize)}
                  onDragEnd={(x, y) => handleDragEnd(setQrPosition!, x, y)}
                  onResizeEnd={(w, h, x, y) => {
                    setQrSize!(Math.round(w / imageScale))
                    setQrPosition!(Math.round(x / imageScale), Math.round(y / imageScale))
                  }}
                  onRotateEnd={(deg) => setQrRotation?.(deg)}
                >
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    {QR}

                    {/* Custom Reimplemented Embedded Logo */}
                    {layout.logo.show &&
                      layout.logo.image &&
                      (() => {
                        let finalPercentage = 20
                        const sizeVal = layout.logo.size || 3
                        if (sizeVal > 5) {
                          finalPercentage = sizeVal
                        } else {
                          const ecl = layout.errorCorrectionLevel || 'Q'
                          const msl = ecl === 'L' ? 25 : ecl === 'M' ? 35 : ecl === 'Q' ? 50 : 54
                          const ratios = [0.3, 0.5, 0.7, 0.85, 1.0]
                          const index = Math.max(0, Math.min(4, sizeVal - 1))
                          finalPercentage = ratios[index] * msl
                        }

                        return (
                          <div
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: `${finalPercentage}%`,
                              height: `${finalPercentage}%`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 20,
                              pointerEvents: 'none', // Let clicks pass through to QR
                            }}
                          >
                            <img
                              src={layout.logo.image}
                              alt="QR Logo"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block',
                                filter: `url(#qr-logo-outline-${layout.logo.strokeWidth ?? 3})`,
                              }}
                            />
                          </div>
                        )
                      })()}
                  </div>
                </TransformBox>
              ) : (
                // Read-only view
                <div
                  style={{
                    position: 'absolute',
                    top: `${scaledY}px`,
                    left: `${scaledX}px`,
                    width: `${scaledSize}px`,
                    height: `${scaledSize}px`,
                    transform: `rotate(${layout.background?.qrRotation || 0}deg)`,
                    transformOrigin: 'center center',
                  }}
                >
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    {QR}
                    {layout.logo.show &&
                      layout.logo.image &&
                      (() => {
                        let finalPercentage = 20
                        const sizeVal = layout.logo.size || 3
                        if (sizeVal > 5) {
                          finalPercentage = sizeVal
                        } else {
                          const ecl = layout.errorCorrectionLevel || 'Q'
                          const msl = ecl === 'L' ? 25 : ecl === 'M' ? 35 : ecl === 'Q' ? 50 : 54
                          const ratios = [0.3, 0.5, 0.7, 0.85, 1.0]
                          const index = Math.max(0, Math.min(4, sizeVal - 1))
                          finalPercentage = ratios[index] * msl
                        }

                        return (
                          <div
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: `${finalPercentage}%`,
                              height: `${finalPercentage}%`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 20,
                            }}
                          >
                            <img
                              src={layout.logo.image}
                              alt="QR Logo"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block',
                                filter: `url(#qr-logo-outline-${layout.logo.strokeWidth ?? 3})`,
                              }}
                            />
                          </div>
                        )
                      })()}
                  </div>
                </div>
              )}

              {/* Render Product Photo Placeholder */}
              {productPhotoEnabled &&
                (setProductPhotoWidth && setProductPhotoHeight && setProductPhotoPosition ? (
                  <TransformBox
                    x={scaledPhotoX}
                    y={scaledPhotoY}
                    width={scaledPhotoWidth}
                    height={scaledPhotoHeight}
                    rotation={layout.productPhoto?.rotation || 0}
                    selected={selectedElement === 'productPhoto'}
                    onSelect={() => setSelectedElement('productPhoto')}
                    lockAspectRatio={lockProductPhotoAspectRatio ?? true}
                    onDrag={(x, y) =>
                      handleSnapDrag('productPhoto', x, y, scaledPhotoWidth, scaledPhotoHeight)
                    }
                    onDragEnd={(x, y) => handleDragEnd(setProductPhotoPosition!, x, y)}
                    onResize={(w, h) => {
                      if (productPhotoNodeRef.current) {
                        const roundness = layout.productPhoto?.roundness || 0
                        productPhotoNodeRef.current.style.borderRadius = `${Math.min(w, h) * (roundness / 100)}px`
                      }
                    }}
                    onResizeEnd={(w, h, x, y) => {
                      setProductPhotoWidth!(Math.round(w / imageScale))
                      setProductPhotoHeight!(Math.round(h / imageScale))
                      setProductPhotoPosition!(
                        Math.round(x / imageScale),
                        Math.round(y / imageScale),
                      )
                    }}
                    onRotateEnd={(deg) => setProductPhotoRotation?.(deg)}
                    customHandles={
                      <div
                        onMouseDown={(e) => {
                          e.stopPropagation()
                          const startRoundness = layout.productPhoto?.roundness || 0
                          
                          let centerX = 0
                          let centerY = 0
                          let startDist = 0
                          
                          if (productPhotoNodeRef.current) {
                            const rect = productPhotoNodeRef.current.getBoundingClientRect()
                            centerX = rect.left + rect.width / 2
                            centerY = rect.top + rect.height / 2
                            startDist = Math.sqrt((e.clientX - centerX) ** 2 + (e.clientY - centerY) ** 2)
                          }

                          const handleMouseMove = (moveEvent: MouseEvent) => {
                            let newRoundness = startRoundness
                            
                            if (productPhotoNodeRef.current && startDist > 0) {
                              const currentDist = Math.sqrt((moveEvent.clientX - centerX) ** 2 + (moveEvent.clientY - centerY) ** 2)
                              const dDist = startDist - currentDist // Positive means moved closer to center (inward)
                              newRoundness = startRoundness + dDist * 0.5 // Adjust sensitivity
                            }

                            if (newRoundness < 0) newRoundness = 0
                            if (newRoundness > 50) newRoundness = 50

                            if (productPhotoNodeRef.current) {
                              const minDim = Math.min(productPhotoNodeRef.current.clientWidth, productPhotoNodeRef.current.clientHeight)
                              productPhotoNodeRef.current.style.borderRadius = `${minDim * (newRoundness / 100)}px`
                            }
                            dragValuesRef.current.productPhotoRoundness = newRoundness
                          }

                          const handleMouseUp = () => {
                            window.removeEventListener('mousemove', handleMouseMove)
                            window.removeEventListener('mouseup', handleMouseUp)

                            const existing = document.getElementById('roundness-cursor-style')
                            if (existing) existing.remove()

                            if (dragValuesRef.current.productPhotoRoundness !== undefined) {
                              setProductPhotoRoundness?.(
                                dragValuesRef.current.productPhotoRoundness,
                              )
                            }

                            // Prevent stray clicks from deselecting the item
                            const captureClick = (evt: MouseEvent) => {
                              evt.stopPropagation()
                              window.removeEventListener('click', captureClick, true)
                            }
                            window.addEventListener('click', captureClick, true)
                            setTimeout(
                              () => window.removeEventListener('click', captureClick, true),
                              50,
                            )
                          }

                          let styleEl = document.getElementById('roundness-cursor-style')
                          if (!styleEl) {
                            styleEl = document.createElement('style')
                            styleEl.id = 'roundness-cursor-style'
                            document.head.appendChild(styleEl)
                          }
                          styleEl.innerHTML = `* { cursor: grabbing !important; }`

                          window.addEventListener('mousemove', handleMouseMove)
                          window.addEventListener('mouseup', handleMouseUp)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        title="Drag Up/Down to adjust Roundness"
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          width: '16px',
                          height: '16px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          cursor: 'grab',
                          zIndex: 100,
                          border: '2px solid var(--theme-primary-500, #0069ff)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      />
                    }
                  >
                    <div
                      ref={productPhotoNodeRef}
                      style={{
                        flex: 1,
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: layout.productPhoto?.bgColor || 'transparent',
                        overflow: 'hidden',
                        borderRadius: `${Math.min(scaledPhotoWidth, scaledPhotoHeight) * ((layout.productPhoto?.roundness || 0) / 100)}px`,
                      }}
                    >
                      {agentPhotoUrl ? (
                        <img
                          src={agentPhotoUrl}
                          alt="Agent"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: (layout.productPhoto?.fitMode as 'cover' | 'contain' | 'fill') || 'cover',
                            pointerEvents: 'none',
                          }}
                        />
                      ) : fallbackPhotoIcon ? (
                        fallbackPhotoIcon
                      ) : (
                        <FaRobot
                          size={Math.max(24, Math.min(scaledPhotoWidth, scaledPhotoHeight) * 0.3)}
                          color="rgba(255,255,255,0.8)"
                        />
                      )}
                    </div>
                  </TransformBox>
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      top: `${scaledPhotoY}px`,
                      left: `${scaledPhotoX}px`,
                      width: `${scaledPhotoWidth}px`,
                      height: `${scaledPhotoHeight}px`,
                      backgroundColor: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: showOutlinesInReadOnly ? '1px dashed #ffffff' : 'none',
                      boxShadow: showOutlinesInReadOnly ? '0 0 0 1px #000000' : 'none',
                      overflow: 'hidden',
                      transform: `rotate(${layout.productPhoto?.rotation || 0}deg)`,
                      transformOrigin: 'center center',
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: layout.productPhoto?.bgColor || 'transparent',
                        overflow: 'hidden',
                        borderRadius: `${Math.min(scaledPhotoWidth, scaledPhotoHeight) * ((layout.productPhoto?.roundness || 0) / 100)}px`,
                      }}
                    >
                      {agentPhotoUrl ? (
                        <img
                          src={agentPhotoUrl}
                          alt="Agent"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            pointerEvents: 'none',
                          }}
                        />
                      ) : (
                        <FaRobot
                          size={Math.max(24, Math.min(scaledPhotoWidth, scaledPhotoHeight) * 0.3)}
                          color="rgba(255,255,255,0.8)"
                        />
                      )}
                    </div>
                  </div>
                ))}

              {/* Render Garment Name Placeholder */}
              {garmentNameEnabled &&
                (setGarmentNameWidth && setGarmentNameHeight && setGarmentNamePosition ? (
                  <TransformBox
                    x={scaledNameX}
                    y={scaledNameY}
                    width={scaledNameWidth}
                    height={scaledNameHeight}
                    rotation={layout.garmentName?.rotation || 0}
                    selected={selectedElement === 'garmentName'}
                    onSelect={() => setSelectedElement('garmentName')}
                    onDrag={(x, y) =>
                      handleSnapDrag('garmentName', x, y, scaledNameWidth, scaledNameHeight)
                    }
                    onDragEnd={(x, y) => handleDragEnd(setGarmentNamePosition!, x, y)}
                    onResizeEnd={(w, h, x, y) => {
                      setGarmentNameWidth!(Math.round(w / imageScale))
                      setGarmentNameHeight!(Math.round(h / imageScale))
                      setGarmentNamePosition!(
                        Math.round(x / imageScale),
                        Math.round(y / imageScale),
                      )
                    }}
                    onRotateEnd={(deg) => setGarmentNameRotation?.(deg)}
                  >
                    <div
                      ref={garmentNameNodeRef}
                      style={{
                        padding: '0 8px',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems:
                          layout.garmentName?.textVerticalAlign === 'top'
                            ? 'flex-start'
                            : layout.garmentName?.textVerticalAlign === 'bottom'
                              ? 'flex-end'
                              : 'center',
                        justifyContent:
                          layout.garmentName?.textAlign === 'left'
                            ? 'flex-start'
                            : layout.garmentName?.textAlign === 'right'
                              ? 'flex-end'
                              : 'center',
                        textAlign: layout.garmentName?.textAlign || 'center',
                      }}
                    >
                      <span
                        className="garment-font-override"
                        style={{
                          fontSize: `${(layout.garmentName?.fontSize || 24) * imageScale}px`,
                          fontWeight: layout.garmentName?.fontWeight || '600',
                          color: layout.garmentName?.fontColor || '#000000',
                          lineHeight: 1.2,
                          display: 'inline-block',
                          padding: '4px 0',
                        }}
                      >
                        {layout.garmentName?.text || '[Garment Name]'}
                      </span>
                    </div>
                  </TransformBox>
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      top: `${scaledNameY}px`,
                      left: `${scaledNameX}px`,
                      width: `${scaledNameWidth}px`,
                      height: `${scaledNameHeight}px`,
                      transform: `rotate(${layout.garmentName?.rotation || 0}deg)`,
                      transformOrigin: 'center center',
                      display: 'flex',
                      alignItems:
                        layout.garmentName?.textVerticalAlign === 'top'
                          ? 'flex-start'
                          : layout.garmentName?.textVerticalAlign === 'bottom'
                            ? 'flex-end'
                            : 'center',
                      outline: showOutlinesInReadOnly ? '1px dashed #ffffff' : 'none',
                      boxShadow: showOutlinesInReadOnly ? '0 0 0 1px #000000' : 'none',
                      overflow: 'hidden',
                      justifyContent:
                        layout.garmentName?.textAlign === 'left'
                          ? 'flex-start'
                          : layout.garmentName?.textAlign === 'right'
                            ? 'flex-end'
                            : 'center',
                    }}
                  >
                    <div
                      style={{
                        padding: '0 8px',
                        width: '100%',
                        textAlign: layout.garmentName?.textAlign || 'center',
                      }}
                    >
                      <span
                        className="garment-font-override"
                        style={{
                          fontSize: `${(layout.garmentName?.fontSize || 24) * imageScale}px`,
                          fontWeight: layout.garmentName?.fontWeight || '600',
                          color: layout.garmentName?.fontColor || '#000000',
                          lineHeight: 1.2,
                          display: 'inline-block',
                          padding: '4px 0',
                        }}
                      >
                        {layout.garmentName?.text || '[Garment Name]'}
                      </span>
                    </div>
                  </div>
                ))}
            </>
          )}
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
    </div>
  )
}
