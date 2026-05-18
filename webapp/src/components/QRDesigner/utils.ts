import QRCodeStyling, { CornerDotType, CornerSquareType, DotType, Options } from 'qr-code-styling'

const getSafeFontString = (font: string) => {
  if (font.includes(',') || font.includes(' ')) {
    return font.split(',').map(f => {
      const trimmed = f.trim()
      if (trimmed.includes(' ') && !trimmed.startsWith("'") && !trimmed.startsWith('"')) {
        return "'" + trimmed + "'"
      }
      return trimmed
    }).join(', ')
  }
  return font
}

export const resolveLogoSizePercentage = (sizeVal: number | undefined, errorLevel: string | undefined): number => {
  const ecl = errorLevel || 'Q';
  const maxSafeLimit = ecl === 'L' ? 25 : ecl === 'M' ? 35 : ecl === 'Q' ? 50 : 54;
  
  if (!sizeVal) return maxSafeLimit * 0.5 / 100;
  
  let level = sizeVal;
  if (sizeVal > 5) {
    const ratios = [0.3, 0.5, 0.7, 0.85, 1.0];
    const targetRatio = sizeVal / maxSafeLimit;
    level = ratios.reduce((closestIndex, ratio, index) => {
       return Math.abs(ratio - targetRatio) < Math.abs(ratios[closestIndex] - targetRatio) ? index : closestIndex;
    }, 0) + 1;
  }

  const fractionMap: Record<number, number> = { 1: 0.3, 2: 0.5, 3: 0.7, 4: 0.85, 5: 1.0 };
  const fraction = fractionMap[level] || 0.5;
  return (maxSafeLimit * fraction) / 100;
};

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
    bgColor?: string
    fitMode?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    rotation?: number
    roundness?: number
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
    text?: string
    rotation?: number
    hasSavedCoordinates?: boolean
  }
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

export async function renderQR(qrLayout: QRLayout, productPhotoUrl?: string): Promise<Blob> {
  const layout = {
    ...qrLayout,
    logo: {
      ...qrLayout.logo,
      show: qrLayout.logo.show ?? false,
    },
  }

  let finalLogoUrl = layout.logo.show ? layout.logo.image : undefined
  if (finalLogoUrl && layout.logo.strokeWidth && layout.logo.strokeWidth > 0) {
    const logoPercentage = resolveLogoSizePercentage(layout.logo.size, layout.errorCorrectionLevel)
    const logoDrawnWidth = layout.background.qrSize * logoPercentage
    finalLogoUrl = await createStrokedLogoUrl(finalLogoUrl, layout.logo.strokeWidth, layout.dots.color || '#000000', logoDrawnWidth)
  }

  // Create QR code options
  const qrOptions: Options = {
    type: 'canvas',
    data: layout.url,
    image: finalLogoUrl,
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
      imageSize: resolveLogoSizePercentage(layout.logo.size, layout.errorCorrectionLevel),
    },
    qrOptions: {
      errorCorrectionLevel: layout.errorCorrectionLevel || 'Q',
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

  // Draw QR code at specified position with rotation
  let qrX = layout.background.qrX || 0
  let qrY = layout.background.qrY || 0
  const qrSize = layout.background.qrSize || 300
  const qrRot = layout.background.qrRotation || 0
  
  if (qrX === 0 && qrY === 0) {
    qrX = (bgImage.naturalWidth - qrSize) / 2;
    qrY = (bgImage.naturalHeight - qrSize) / 2;
  }

  ctx.save()
  if (qrRot) {
    ctx.translate(qrX + qrSize / 2, qrY + qrSize / 2)
    ctx.rotate((qrRot * Math.PI) / 180)
    ctx.translate(-(qrX + qrSize / 2), -(qrY + qrSize / 2))
  }
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)
  ctx.restore()

  // (Optional) Draw Product Photo PlaceHolder/Image if provided and enabled
  if (layout.productPhoto?.show && productPhotoUrl) {
    try {
      const pImage = await loadImage(productPhotoUrl)
      // Save context
      ctx.save()
      
      let dx = Number(layout.productPhoto.x) || 0
      let dy = Number(layout.productPhoto.y) || 0
      const dw = Number(layout.productPhoto.width) || 150
      const dh = Number(layout.productPhoto.height) || 150
      
      if (dx === 0 && dy === 0) {
        dx = (bgImage.naturalWidth - dw) / 2;
        dy = (bgImage.naturalHeight - dh) / 2;
      }
      const rotation = Number(layout.productPhoto.rotation) || 0
      const roundness = Number(layout.productPhoto.roundness) || 0

      // Move context to center, apply rotation
      if (rotation) {
        ctx.translate(dx + dw / 2, dy + dh / 2)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.translate(-(dx + dw / 2), -(dy + dh / 2))
      }

      // Apply border-radius clipping
      if (roundness > 0) {
        ctx.beginPath()
        const radius = Math.min(dw, dh) * (roundness / 100)
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(dx, dy, dw, dh, radius)
        } else {
          ctx.rect(dx, dy, dw, dh)
        }
        ctx.clip()
      }

      if (layout.productPhoto.bgColor) {
        ctx.fillStyle = layout.productPhoto.bgColor
        ctx.fillRect(dx, dy, dw, dh)
      }
      
      let sx = 0, sy = 0, sw = pImage.naturalWidth, sh = pImage.naturalHeight
      let targetW = dw, targetH = dh, targetX = dx, targetY = dy
      
      const fitMode = layout.productPhoto.fitMode || 'cover'
      if (fitMode === 'cover') {
        const scale = Math.max(dw / sw, dh / sh)
        sw = dw / scale
        sh = dh / scale
        sx = (pImage.naturalWidth - sw) / 2
        sy = (pImage.naturalHeight - sh) / 2
      } else if (fitMode === 'contain' || fitMode === 'scale-down') {
        const scale = Math.min(dw / sw, dh / sh)
        targetW = sw * scale
        targetH = sh * scale
        if (fitMode === 'scale-down' && scale > 1) {
          targetW = sw
          targetH = sh
        }
        targetX = dx + (dw - targetW) / 2
        targetY = dy + (dh - targetH) / 2
      } else if (fitMode === 'none') {
        targetW = sw
        targetH = sh
        targetX = dx + (dw - targetW) / 2
        targetY = dy + (dh - targetH) / 2
        ctx.beginPath()
        ctx.rect(dx, dy, dw, dh)
        ctx.clip()
      }

      ctx.drawImage(pImage, sx, sy, sw, sh, targetX, targetY, targetW, targetH)
      
      ctx.restore()
    } catch (error) {
      console.warn('Failed to load product photo for QR composite', error)
    }
  }

  // (Optional) Draw Garment Name if provided and enabled
  if (layout.garmentName?.show) {
    ctx.save()
    const { 
      fontFamily = 'Inter, sans-serif', 
      fontSize = 24, 
      fontWeight = '600', 
      fontColor = '#000000',
      textAlign = 'center',
      x = 0, y = 0, width = 200, height = 50 
    } = layout.garmentName
    
    let textOriginX = x;
    let textOriginY = y;
    if (x === 0 && y === 0) {
      textOriginX = (bgImage.naturalWidth - width) / 2;
      textOriginY = (bgImage.naturalHeight - height) / 2;
    }

    ctx.font = `${fontWeight} ${fontSize}px ${getSafeFontString(fontFamily)}`
    ctx.fillStyle = fontColor
    ctx.textAlign = textAlign as CanvasTextAlign
    const verticalAlign = layout.garmentName.textVerticalAlign || 'middle'
    ctx.textBaseline = verticalAlign as CanvasTextBaseline

    const rotation = layout.garmentName.rotation || 0
    if (rotation) {
      ctx.translate(textOriginX + width / 2, textOriginY + height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-(textOriginX + width / 2), -(textOriginY + height / 2))
    }

    // Calculate X placement based on alignment inside the bounding box
    let textX = textOriginX
    if (textAlign === 'center') textX = textOriginX + width / 2
    else if (textAlign === 'right') textX = textOriginX + width
    
    // Calculate Y placement based on vertical alignment
    let textY = textOriginY
    if (verticalAlign === 'middle') textY = textOriginY + height / 2
    else if (verticalAlign === 'bottom') textY = textOriginY + height

    // Draw text limited to the width of the bounding box
    ctx.fillText(layout.garmentName.text || 'Garment Name', textX, textY, width)

    ctx.restore()
  }

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

export async function renderQRSVG(qrLayout: QRLayout, productPhotoUrl?: string): Promise<Blob> {
  const layout = {
    ...qrLayout,
    logo: {
      ...qrLayout.logo,
      show: qrLayout.logo.show ?? false,
    },
  }

  let finalLogoUrl = layout.logo.show ? layout.logo.image : undefined
  if (finalLogoUrl && layout.logo.strokeWidth && layout.logo.strokeWidth > 0) {
    const logoPercentage = resolveLogoSizePercentage(layout.logo.size, layout.errorCorrectionLevel)
    const logoDrawnWidth = layout.background?.qrSize ? layout.background.qrSize * logoPercentage : 1024 * logoPercentage
    finalLogoUrl = await createStrokedLogoUrl(finalLogoUrl, layout.logo.strokeWidth, layout.dots.color || '#000000', logoDrawnWidth)
  }

  // Create QR code options for SVG
  const qrOptions: Options = {
    type: 'svg',
    data: layout.url,
    image: finalLogoUrl,
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
      imageSize: resolveLogoSizePercentage(layout.logo.size, layout.errorCorrectionLevel),
    },
    qrOptions: {
      errorCorrectionLevel: layout.errorCorrectionLevel || 'Q',
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
  let productPhotoSvg = ''

  if (layout.productPhoto?.show && productPhotoUrl) {
    try {
      const pImage = await loadImage(productPhotoUrl)
      const pBase64 = await getBase64FromImage(pImage)
      
      let dx = Number(layout.productPhoto.x) || 0
      let dy = Number(layout.productPhoto.y) || 0
      const dw = Number(layout.productPhoto.width) || 150
      const dh = Number(layout.productPhoto.height) || 150

      if (dx === 0 && dy === 0) {
        dx = (bgImage.naturalWidth - dw) / 2;
        dy = (bgImage.naturalHeight - dh) / 2;
      }

      let bgRectSvg = ''
      if (layout.productPhoto.bgColor) {
        bgRectSvg = `<rect x="${dx}" y="${dy}" width="${dw}" height="${dh}" fill="${layout.productPhoto.bgColor}" />`
      }
      
      let preserveAspectRatio = 'xMidYMid slice'
      const fitMode = layout.productPhoto.fitMode || 'cover'
      if (fitMode === 'contain' || fitMode === 'scale-down') preserveAspectRatio = 'xMidYMid meet'
      else if (fitMode === 'fill' || fitMode === 'none') preserveAspectRatio = 'none'

      let clipPathDef = ''
      let clipPathAttr = ''
      if (fitMode === 'none') {
        clipPathDef = `<clipPath id="noneClip"><rect x="${dx}" y="${dy}" width="${dw}" height="${dh}"/></clipPath>`
        clipPathAttr = ` clip-path="url(#noneClip)"`
      }
      
      let imageX = dx
      let imageY = dy
      let imageW = dw
      let imageH = dh
      if (fitMode === 'none' || fitMode === 'scale-down') {
         if (fitMode === 'none') {
           imageW = pImage.naturalWidth
           imageH = pImage.naturalHeight
           imageX = dx + (dw - imageW) / 2
           imageY = dy + (dh - imageH) / 2
         } else if (fitMode === 'scale-down') {
           const scale = Math.min(dw / pImage.naturalWidth, dh / pImage.naturalHeight)
           if (scale > 1) {
             imageW = pImage.naturalWidth
             imageH = pImage.naturalHeight
             imageX = dx + (dw - imageW) / 2
             imageY = dy + (dh - imageH) / 2
             preserveAspectRatio = 'xMidYMid slice' 
           }
         }
      }

      const roundness = Number(layout.productPhoto.roundness) || 0
      let photoClipDef = clipPathDef
      let photoClipAttr = clipPathAttr
      
      if (roundness > 0) {
        const radius = Math.min(dw, dh) * (roundness / 100)
        photoClipDef += `<clipPath id="photoRoundClip"><rect x="${dx}" y="${dy}" width="${dw}" height="${dh}" rx="${radius}" ry="${radius}"/></clipPath>`
        photoClipAttr += ` clip-path="url(#photoRoundClip)"`
      }

      const rotation = Number(layout.productPhoto.rotation) || 0
      let transformAttr = ''
      if (rotation) {
        transformAttr = ` transform="rotate(${rotation} ${dx + dw / 2} ${dy + dh / 2})"`
      }

      productPhotoSvg = `${photoClipDef}${bgRectSvg}<image href="${pBase64}" x="${imageX}" y="${imageY}" width="${imageW}" height="${imageH}" preserveAspectRatio="${preserveAspectRatio}"${photoClipAttr} />`
      if (transformAttr) {
        productPhotoSvg = `<g${transformAttr}>${productPhotoSvg}</g>`
      }
    } catch (e) {
      console.warn('Failed to encode product photo for SVG composite', e)
    }
  }

  let garmentNameSvg = ''
  if (layout.garmentName?.show) {
    const { 
      fontFamily = 'Inter, sans-serif', 
      fontSize = 24, 
      fontWeight = '600', 
      fontColor = '#000000',
      textAlign = 'center',
      x = 0, y = 0, width = 200, height = 50 
    } = layout.garmentName

    let textOriginX = x;
    let textOriginY = y;
    if (x === 0 && y === 0) {
      textOriginX = (bgImage.naturalWidth - width) / 2;
      textOriginY = (bgImage.naturalHeight - height) / 2;
    }

    let textAnchor = 'middle'
    let textX = textOriginX + width / 2
    if (textAlign === 'left') {
      textAnchor = 'start'
      textX = textOriginX
    } else if (textAlign === 'right') {
      textAnchor = 'end'
      textX = textOriginX + width
    }
    const textY = textOriginY + height / 2

    const safeFont = getSafeFontString(fontFamily).replace(/"/g, "'") // SVG attrs strictly prefer single quotes wrapping primary font.

    const textToDraw = layout.garmentName.text || 'Garment Name'
    
    const rotation = layout.garmentName.rotation || 0
    let transformAttr = ''
    if (rotation) {
      transformAttr = ` transform="rotate(${rotation} ${textX} ${textY})"`
    }

    garmentNameSvg = `<text x="${textX}" y="${textY}" font-family="${safeFont}" font-size="${fontSize}px" font-weight="${fontWeight}" fill="${fontColor}" text-anchor="${textAnchor}" dominant-baseline="middle"${transformAttr}>${textToDraw}</text>`
  }

  let qrX = layout.background.qrX || 0
  let qrY = layout.background.qrY || 0
  const qrSize = layout.background.qrSize || 300
  const qrRot = layout.background.qrRotation || 0

  if (qrX === 0 && qrY === 0) {
    qrX = (bgImage.naturalWidth - qrSize) / 2;
    qrY = (bgImage.naturalHeight - qrSize) / 2;
  }
  
  let qrTransform = `translate(${qrX}, ${qrY})`
  if (qrRot) {
    qrTransform += ` rotate(${qrRot} ${qrSize / 2} ${qrSize / 2})`
  }

  const compositeSvg = `<svg width="${bgImage.naturalWidth}" height="${bgImage.naturalHeight}" viewBox="0 0 ${bgImage.naturalWidth} ${bgImage.naturalHeight}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image href="${bgBase64}" width="${bgImage.naturalWidth}" height="${bgImage.naturalHeight}" />
  <g transform="${qrTransform}">
    ${qrSvgText
      .replace(/<\?xml[^?]*\?>/, '')
      .replace(/<svg[^>]*>/, '')
      .replace(/<\/svg>/, '')}
  </g>
  ${productPhotoSvg}
  ${garmentNameSvg}
</svg>`

  return new Blob([compositeSvg], { type: 'image/svg+xml' })
}

// Helper function to load an image safely avoiding strict CORS blocks for local assets
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    // Only apply crossOrigin anonymous if it is absolutely an external domain
    if (src.startsWith('http')) {
      try {
        const urlObj = new URL(src)
        if (urlObj.origin !== window.location.origin) {
          img.crossOrigin = 'anonymous'
        }
      } catch (_e) {
        // Fallback for parsing errors
        img.crossOrigin = 'anonymous'
      }
    }
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image: ' + src))
    img.src = src
  })
}

// Helper function to create a base64 SVG that embeds an image with an SVG filter for the stroke outline
async function createStrokedLogoUrl(imageUrl: string, strokeWidth: number, outlineColor: string, logoDrawnWidth: number): Promise<string> {
  try {
    const img = await loadImage(imageUrl)
    const base64Img = await getBase64FromImage(img)
    const w = img.naturalWidth || 100
    const h = img.naturalHeight || 100
    
    // Scale strokeWidth from CSS pixels to SVG intrinsic units
    // Avoid division by zero by using a fallback drawn width
    const drawnW = logoDrawnWidth || 100
    const adjustedStroke = strokeWidth * (w / drawnW)
    
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <filter id="outline" x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology in="SourceAlpha" operator="dilate" radius="${adjustedStroke}" result="dilated" />
            <feFlood flood-color="${outlineColor}" flood-opacity="1" result="color" />
            <feComposite in="color" in2="dilated" operator="in" result="outline" />
            <feMerge>
              <feMergeNode in="outline" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <image href="${base64Img}" width="${w}" height="${h}" filter="url(#outline)" />
      </svg>
    `
    // Convert to data URI
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
  } catch (err) {
    console.error('Failed to create stroked logo', err)
    return imageUrl // Fallback to original image if failed
  }
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
