'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { QRComposer } from './QRComposer'
import { StandaloneQRConfigurator } from './QRConfigurator'
import { ConfigSplitLayout } from '@/components/payload/ConfigSplitLayout'

const QRDesigner: React.FC = () => {
  const { setValue: setQrSize } = useField<number>({ path: 'qrLayout.qrSize' })
  const { setValue: setQrX } = useField<number>({ path: 'qrLayout.qrX' })
  const { setValue: setQrY } = useField<number>({ path: 'qrLayout.qrY' })
  const { setValue: setQrRotation } = useField<number>({ path: 'qrLayout.qrRotation' })

  const { setValue: setProductPhotoWidth } = useField<number>({ path: 'qrLayout.productPhotoWidth' })
  const { setValue: setProductPhotoHeight } = useField<number>({ path: 'qrLayout.productPhotoHeight' })
  const { setValue: setProductPhotoX } = useField<number>({ path: 'qrLayout.productPhotoX' })
  const { setValue: setProductPhotoY } = useField<number>({ path: 'qrLayout.productPhotoY' })
  const { setValue: setProductPhotoRoundness } = useField<number>({ path: 'qrLayout.productPhotoRoundness' })

  const { setValue: setGarmentNameWidth } = useField<number>({ path: 'qrLayout.garmentNameWidth' })
  const { setValue: setGarmentNameHeight } = useField<number>({ path: 'qrLayout.garmentNameHeight' })
  const { setValue: setGarmentNameX } = useField<number>({ path: 'qrLayout.garmentNameX' })
  const { setValue: setGarmentNameY } = useField<number>({ path: 'qrLayout.garmentNameY' })

  const { value: backgroundImageValue } = useField<any>({ path: 'qrLayout.backgroundImage' })

  const formLayout = useFormFields(([fields]) => {
    const getVal = (path: string) => fields[path]?.value
    return {
      dotsType: getVal('qrLayout.dotsType') as string,
      color: getVal('qrLayout.color') as string,
      cornersSquareType: getVal('qrLayout.cornersSquareType') as string,
      cornersDotType: getVal('qrLayout.cornersDotType') as string,
      errorCorrectionLevel: getVal('qrLayout.errorCorrectionLevel') as string,
      qrSize: getVal('qrLayout.qrSize') as number,
      qrX: getVal('qrLayout.qrX') as number,
      qrY: getVal('qrLayout.qrY') as number,
      qrRotation: getVal('qrLayout.qrRotation') as number,
      
      logoImage: getVal('qrLayout.logo.image') as any,
      logoSize: getVal('qrLayout.logo.size') as number,
      logoStrokeWidth: getVal('qrLayout.logo.strokeWidth') as number,

      includeProductPhoto: getVal('qrLayout.includeProductPhoto') as boolean,
      productPhotoWidth: getVal('qrLayout.productPhotoWidth') as number || 150,
      productPhotoHeight: getVal('qrLayout.productPhotoHeight') as number || 150,
      productPhotoX: getVal('qrLayout.productPhotoX') as number,
      productPhotoY: getVal('qrLayout.productPhotoY') as number,
      productPhotoRoundness: getVal('qrLayout.productPhotoRoundness') as number,
      productPhotoBgColor: '#E5E7EB',

      includeGarmentName: getVal('qrLayout.includeGarmentName') as boolean,
      garmentNameWidth: getVal('qrLayout.garmentNameWidth') as number || 300,
      garmentNameHeight: getVal('qrLayout.garmentNameHeight') as number || 50,
      garmentNameX: getVal('qrLayout.garmentNameX') as number,
      garmentNameY: getVal('qrLayout.garmentNameY') as number,
      garmentNameFontFamily: getVal('qrLayout.garmentNameFontFamily') as string || 'Inter, sans-serif',
      garmentNameFontSize: getVal('qrLayout.garmentNameFontSize') as number || 32,
      garmentNameFontColor: getVal('qrLayout.garmentNameFontColor') as string || '#000000',
      garmentNameFontWeight: getVal('qrLayout.garmentNameFontWeight') as string || '600',
      garmentNameTextAlign: getVal('qrLayout.garmentNameTextAlign') as string || 'center',
      garmentNameTextVerticalAlign: getVal('qrLayout.garmentNameTextVerticalAlign') as string || 'middle',
    }
  })

  const [bgUrl, setBgUrl] = useState<string>('')
  const [logoUrl, setLogoUrl] = useState<string>('')
  
  const backgroundImageId = useMemo(() => backgroundImageValue, [backgroundImageValue])
  const logoImageId = useMemo(() => formLayout.logoImage, [formLayout.logoImage])

  useEffect(() => {
    const fetchMedia = async (id: any, setter: (val: string) => void) => {
      if (!id) { setter(''); return }
      if (typeof File !== 'undefined' && id instanceof File) { setter(URL.createObjectURL(id)); return }
      if (typeof id === 'object') {
        if ('url' in id) { setter(id.url as string); return }
        if (id.file instanceof File) { setter(URL.createObjectURL(id.file)); return }
      }
      try {
        const res = await fetch(`/api/media/${id}`)
        if (res.ok) { const data = await res.json(); setter(data.url) }
      } catch (error) { console.error('Error fetching media:', error) }
    }
    
    fetchMedia(backgroundImageId, setBgUrl)
    fetchMedia(logoImageId, setLogoUrl)
  }, [backgroundImageId, logoImageId])

  const finalQrLayout = {
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:2026'}/invitation?token=DEMO_TOKEN`,
    dots: {
      type: formLayout.dotsType,
      color: formLayout.color,
    },
    cornersSquare: {
      type: formLayout.cornersSquareType,
      color: formLayout.color,
    },
    cornersDot: {
      type: formLayout.cornersDotType,
      color: formLayout.color,
    },
    errorCorrectionLevel: formLayout.errorCorrectionLevel || 'Q',
    background: {
      image: bgUrl,
      qrSize: formLayout.qrSize,
      qrX: formLayout.qrX,
      qrY: formLayout.qrY,
      qrRotation: formLayout.qrRotation,
    },
    logo: {
      show: !!logoUrl,
      image: logoUrl,
      size: formLayout.logoSize || 3,
      strokeWidth: formLayout.logoStrokeWidth || 0,
    },
    productPhoto: {
      show: formLayout.includeProductPhoto,
      width: formLayout.productPhotoWidth,
      height: formLayout.productPhotoHeight,
      x: formLayout.productPhotoX,
      y: formLayout.productPhotoY,
      roundness: formLayout.productPhotoRoundness ?? 100,
      bgColor: formLayout.productPhotoBgColor,
      hasSavedCoordinates: typeof formLayout.productPhotoX === 'number'
    },
    garmentName: {
      show: formLayout.includeGarmentName,
      width: formLayout.garmentNameWidth,
      height: formLayout.garmentNameHeight,
      x: formLayout.garmentNameX,
      y: formLayout.garmentNameY,
      fontFamily: formLayout.garmentNameFontFamily,
      fontSize: formLayout.garmentNameFontSize,
      fontColor: formLayout.garmentNameFontColor,
      fontWeight: formLayout.garmentNameFontWeight,
      textAlign: formLayout.garmentNameTextAlign,
      textVerticalAlign: formLayout.garmentNameTextVerticalAlign,
      text: 'Guest Name',
      hasSavedCoordinates: typeof formLayout.garmentNameX === 'number'
    }
  }

  const handleSetQrPosition = (x: number, y: number) => {
    setQrX(x)
    setQrY(y)
  }
  
  const handleSetProductPhotoPosition = (x: number, y: number) => {
    setProductPhotoX(x)
    setProductPhotoY(y)
  }
  
  const handleSetGarmentNamePosition = (x: number, y: number) => {
    setGarmentNameX(x)
    setGarmentNameY(y)
  }

  return (
    <div style={{ height: 'calc(100vh - 120px)', minHeight: '600px', width: '100%', marginBottom: '24px' }}>
      <ConfigSplitLayout
        previewContent={
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'var(--theme-elevation-50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <QRComposer
              qrLayout={finalQrLayout as any}
              setQrSize={setQrSize}
              setQrPosition={handleSetQrPosition}
              setQrRotation={setQrRotation}
              setProductPhotoWidth={setProductPhotoWidth}
              setProductPhotoHeight={setProductPhotoHeight}
              setProductPhotoPosition={handleSetProductPhotoPosition}
              setProductPhotoRoundness={setProductPhotoRoundness}
              setGarmentNameWidth={setGarmentNameWidth}
              setGarmentNameHeight={setGarmentNameHeight}
              setGarmentNamePosition={handleSetGarmentNamePosition}
              fallbackPhotoIcon={
                <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', borderRadius: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '12px' }}>
                  Guest Photo
                </div>
              }
            />
          </div>
        }
        sidebarTabs={[
          {
            id: 'design',
            label: 'Master Design',
            content: <StandaloneQRConfigurator />
          }
        ]}
      />
    </div>
  )
}

export default QRDesigner
