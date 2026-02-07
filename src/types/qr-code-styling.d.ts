declare module 'qr-code-styling' {
  export type Options = {
    width?: number
    height?: number
    type?: 'canvas' | 'svg'
    data?: string
    image?: string
    margin?: number
    qrOptions?: {
      typeNumber?: number
      mode?: 'Numeric' | 'Alphanumeric' | 'Byte' | 'Kanji'
      errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
    }
    imageOptions?: {
      hideBackgroundDots?: boolean
      imageSize?: number
      crossOrigin?: string
      margin?: number
      saveAsBlob?: boolean
    }
    dotsOptions?: {
      type?: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'
      color?: string
      gradient?: {
        type: 'linear' | 'radial'
        rotation?: number
        colorStops?: { offset: number; color: string }[]
      }
    }
    backgroundOptions?: {
      color?: string
      gradient?: {
        type: 'linear' | 'radial'
        rotation?: number
        colorStops?: { offset: number; color: string }[]
      }
    }
    cornersSquareOptions?: {
      type?: 'square' | 'extra-rounded' | 'dot'
      color?: string
      gradient?: {
        type: 'linear' | 'radial'
        rotation?: number
        colorStops?: { offset: number; color: string }[]
      }
    }
    cornersDotOptions?: {
      type?: 'square' | 'dot'
      color?: string
      gradient?: {
        type: 'linear' | 'radial'
        rotation?: number
        colorStops?: { offset: number; color: string }[]
      }
    }
  }

  export type DotType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'
  export type CornerSquareType = 'square' | 'extra-rounded' | 'dot'
  export type CornerDotType = 'square' | 'dot'

  export default class QRCodeStyling {
    constructor(options?: Options)
    append(container: HTMLElement): void
    update(options?: Options): void
    getRawData(extension?: string): Promise<Blob | null>
    download(downloadOptions?: { name?: string; extension?: 'png' | 'jpeg' | 'webp' | 'svg' }): Promise<void>
  }
}
