import QRCodeStyling, { CornerDotType, CornerSquareType, DotType, Options } from 'qr-code-styling'

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
  }
  logo: {
    show: boolean
    image: string
    size: number
  }
}

export async function renderQR(qrLayout: QRLayout): Promise<Blob> {
  const layout = {
    ...qrLayout,
    logo: {
      ...qrLayout.logo,
      show: qrLayout.logo.show ?? false,
    },
  }

  // Create QR code options
  const qrOptions: Options = {
    type: 'canvas',
    data: layout.url,
    image: layout.logo.show ? layout.logo.image : undefined,
    width: layout.background.image ? layout.background.qrSize : 1024,
    height: layout.background.image ? layout.background.qrSize : 1024,
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

  // Case 1: No background - return just the QR code at 1024x1024
  if (!layout.background.image) {
    const qrCode = new QRCodeStyling(qrOptions)
    const blob = await qrCode.getRawData('png')
    if (!blob) throw new Error('Failed to generate QR code')
    if (!(blob instanceof Blob)) throw new Error('QR code data is not a Blob')
    return blob
  }

  // Case 2: With background - composite QR onto background
  // First, generate the QR code
  const qrCode = new QRCodeStyling(qrOptions)
  const qrBlob = await qrCode.getRawData('png')
  if (!qrBlob) throw new Error('Failed to generate QR code')
  if (!(qrBlob instanceof Blob)) throw new Error('QR code data is not a Blob')

  // Load background image
  const bgImage = await loadImage(layout.background.image)

  // Create canvas with background dimensions
  const canvas = document.createElement('canvas')
  canvas.width = bgImage.naturalWidth
  canvas.height = bgImage.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get canvas context')

  // Draw background
  ctx.drawImage(bgImage, 0, 0)

  // Load QR image
  const qrImage = await loadImage(URL.createObjectURL(qrBlob))

  // Draw QR code at specified position
  ctx.drawImage(
    qrImage,
    layout.background.qrX,
    layout.background.qrY,
    layout.background.qrSize,
    layout.background.qrSize,
  )

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Failed to convert canvas to blob'))
      }
    }, 'image/png')
  })
}

export async function renderQRSVG(qrLayout: QRLayout): Promise<Blob> {
  const layout = {
    ...qrLayout,
    logo: {
      ...qrLayout.logo,
      show: qrLayout.logo.show ?? false,
    },
  }

  // Create QR code options for SVG
  const qrOptions: Options = {
    type: 'svg',
    data: layout.url,
    image: layout.logo.show ? layout.logo.image : undefined,
    width: layout.background.image ? layout.background.qrSize : 1024,
    height: layout.background.image ? layout.background.qrSize : 1024,
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

  // Case 1: No background - return just the QR code as SVG
  if (!layout.background.image) {
    const qrCode = new QRCodeStyling(qrOptions)
    const blob = await qrCode.getRawData('svg')
    if (!blob) throw new Error('Failed to generate QR code')
    if (!(blob instanceof Blob)) throw new Error('QR code data is not a Blob')
    return blob
  }

  // Case 2: With background - composite QR SVG onto background
  // Generate the QR code as SVG
  const qrCode = new QRCodeStyling(qrOptions)
  const qrSvgBlob = await qrCode.getRawData('svg')
  if (!qrSvgBlob) throw new Error('Failed to generate QR code')
  if (!(qrSvgBlob instanceof Blob)) throw new Error('QR code data is not a Blob')

  // Get QR SVG as text
  const qrSvgText = await qrSvgBlob.text()

  // Load background image to get dimensions
  const bgImage = await loadImage(layout.background.image)

  // Convert background image to base64
  const bgBase64 = await getBase64FromImage(bgImage)

  // Create composite SVG
  const compositeSvg = `<svg width="${bgImage.naturalWidth}" height="${bgImage.naturalHeight}" viewBox="0 0 ${bgImage.naturalWidth} ${bgImage.naturalHeight}" xmlns="http://www.w3.org/2000/svg">
  <image href="${bgBase64}" width="${bgImage.naturalWidth}" height="${bgImage.naturalHeight}" />
  <g transform="translate(${layout.background.qrX}, ${layout.background.qrY})">
    ${qrSvgText
      .replace(/<\?xml[^?]*\?>/, '')
      .replace(/<svg[^>]*>/, '')
      .replace(/<\/svg>/, '')}
  </g>
</svg>`

  return new Blob([compositeSvg], { type: 'image/svg+xml' })
}

// Helper function to load an image
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Helper function to convert image to base64
function getBase64FromImage(img: HTMLImageElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('Failed to get canvas context'))
      return
    }
    ctx.drawImage(img, 0, 0)
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to convert image to blob'))
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  })
}
