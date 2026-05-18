'use client'

import { useField } from '@payloadcms/ui'
import React, { useState, useRef, useEffect } from 'react'
import { FaChevronDown, FaUpload, FaTrash } from 'react-icons/fa'

const FONTS = [
  { value: 'Inter, sans-serif', label: 'Inter (Modern Sans)' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Lato, sans-serif', label: 'Lato' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Poppins, sans-serif', label: 'Poppins (Geometric)' },
  { value: 'Nunito, sans-serif', label: 'Nunito (Rounded)' },
  { value: 'Raleway, sans-serif', label: 'Raleway (Elegant Sans)' },
  { value: 'Oswald, sans-serif', label: 'Oswald (Condensed)' },
  { value: 'Space Grotesk, sans-serif', label: 'Space Grotesk (Tech)' },
  { value: 'Outfit, sans-serif', label: 'Outfit (Modern)' },
  { value: 'Syne, sans-serif', label: 'Syne (Artistic / Fashion)' },
  { value: 'Merriweather, serif', label: 'Merriweather (Classic Serif)' },
  { value: 'Playfair Display, serif', label: 'Playfair (Display Serif)' },
  { value: 'Lora, serif', label: 'Lora (Contemporary Serif)' },
  { value: 'Courier New, monospace', label: 'Courier New (Mono)' },
]

export const FieldWrapper = ({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) => (
  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '16px', ...style }}>{children}</div>
)

export const PAYLOAD_LABEL: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  lineHeight: '20px',
  color: 'var(--theme-text)',
  marginBottom: '5px',
  padding: 0,
}

const ShapeIcon = ({ type }: { type: string }) => {
  const commonStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    backgroundColor: 'currentColor',
    transition: 'all 0.2s',
  }
  if (type === 'dots' || type === 'dot') return <div style={{ ...commonStyle, borderRadius: '50%' }} />
  if (type === 'rounded') return <div style={{ ...commonStyle, borderRadius: '4px' }} />
  if (type === 'extra-rounded') return <div style={{ ...commonStyle, borderRadius: '8px' }} />
  if (type === 'classy') return <div style={{ ...commonStyle, borderRadius: '50% 50% 0 50%' }} />
  if (type === 'classy-rounded') return <div style={{ ...commonStyle, borderRadius: '50% 50% 4px 50%' }} />
  return <div style={{ ...commonStyle, borderRadius: '0px' }} />
}

const ShapeSelector = ({ value, options, onChange }: { value: string, options: { value: string; label: string }[], onChange: (val: string) => void }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '2px' }}>
    {options.map((opt) => {
      const isSelected = value === opt.value
      return (
        <div
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '10px 4px', backgroundColor: 'var(--theme-elevation-0)',
            color: isSelected ? 'var(--theme-text)' : 'var(--theme-elevation-500)',
            border: isSelected ? '1px solid var(--theme-text)' : '1px solid var(--theme-elevation-150)',
            boxShadow: isSelected ? '0 0 0 1px var(--theme-text)' : 'none',
            borderRadius: '4px', cursor: 'pointer', transition: 'all 0.15s ease', gap: '6px',
          }}
        >
          <ShapeIcon type={opt.value} />
          <span style={{ fontSize: '11px', fontWeight: 500, textAlign: 'center', lineHeight: 1.1 }}>{opt.label}</span>
        </div>
      )
    })}
  </div>
)

const TextMatrixIcon = ({ v, h }: { v: string; h: string }) => {
  const alignX = h === 'left' ? 'flex-start' : h === 'right' ? 'flex-end' : 'center'
  const alignY = v === 'top' ? 'flex-start' : v === 'bottom' ? 'flex-end' : 'center'
  return (
    <div style={{ width: '20px', height: '20px', border: '1.5px solid currentColor', borderRadius: '3px', display: 'flex', flexDirection: 'column', alignItems: alignX, justifyContent: alignY, padding: '3px', gap: '2.5px', boxSizing: 'border-box' }}>
      <div style={{ width: '10px', height: '1.5px', backgroundColor: 'currentColor', borderRadius: '1px' }} />
      <div style={{ width: '6px', height: '1.5px', backgroundColor: 'currentColor', borderRadius: '1px' }} />
    </div>
  )
}

const NineGridAlignSelector = ({ horizontal, vertical, onChange }: { horizontal: string, vertical: string, onChange: (h: string, v: string) => void }) => {
  const options = [
    { v: 'top', h: 'left' }, { v: 'top', h: 'center' }, { v: 'top', h: 'right' },
    { v: 'middle', h: 'left' }, { v: 'middle', h: 'center' }, { v: 'middle', h: 'right' },
    { v: 'bottom', h: 'left' }, { v: 'bottom', h: 'center' }, { v: 'bottom', h: 'right' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '2px' }}>
      {options.map((opt) => {
        const isSelected = horizontal === opt.h && vertical === opt.v
        return (
          <div key={opt.v + '-' + opt.h} onClick={() => onChange(opt.h, opt.v)} style={{ padding: '12px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--theme-elevation-0)', color: isSelected ? 'var(--theme-text)' : 'var(--theme-elevation-500)', border: isSelected ? '1px solid var(--theme-text)' : '1px solid var(--theme-elevation-150)', boxShadow: isSelected ? '0 0 0 1px var(--theme-text)' : 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.15s ease' }}>
            <TextMatrixIcon v={opt.v} h={opt.h} />
          </div>
        )
      })}
    </div>
  )
}

const CustomFontDropdown = ({ value, options, onChange, dropdownWidth = '100%' }: { value: string, options: { value: string, label: string }[], onChange: (val: string) => void, dropdownWidth?: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [hasOpened, setHasOpened] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (isOpen && !hasOpened) setTimeout(() => setHasOpened(true), 0) }, [isOpen, hasOpened])
  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
  const selectedLabel = (options.find((o) => o.value === value)?.label || 'Select Font').split(' (')[0].trim()
  const fontsToLoad = hasOpened ? options : options.filter((o) => o.value === value)
  const fontUrl = `https://fonts.googleapis.com/css2?${fontsToLoad.map((f) => `family=${f.value.split(',')[0].replace(/['"]/g, '').trim().replace(/ /g, '+')}`).join('&')}&display=swap`

  return (
    <div style={{ position: 'relative', padding: '2px' }} ref={dropdownRef}>
      <link href={fontUrl} rel="stylesheet" />
      <div onClick={() => setIsOpen(!isOpen)} style={{ width: '100%', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)', padding: '8px 15px', borderRadius: '3px', border: '1px solid var(--theme-elevation-200)', fontSize: '14px', fontFamily: value, height: '40px', lineHeight: '20px', cursor: 'pointer', boxSizing: 'border-box', boxShadow: 'rgba(0,0,0,0.1) 0 2px 2px -1px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{selectedLabel}</span>
        <FaChevronDown size={10} style={{ color: 'var(--theme-elevation-500)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>
      {isOpen && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: dropdownWidth, backgroundColor: 'var(--theme-elevation-0)', border: '1px solid var(--theme-elevation-200)', borderRadius: '4px', boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px', zIndex: 100, maxHeight: '300px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '8px', borderBottom: '1px solid var(--theme-elevation-100)', backgroundColor: 'var(--theme-bg)' }}>
            <input autoFocus placeholder="Search fonts..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--theme-elevation-200)', backgroundColor: 'var(--theme-elevation-0)', color: 'var(--theme-text)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
            {filtered.map((opt) => (
              <div key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); setSearch(''); }} style={{ padding: '10px 15px', cursor: 'pointer', fontSize: '15px', fontFamily: opt.value, backgroundColor: value === opt.value ? 'var(--theme-elevation-100)' : 'transparent', color: 'var(--theme-text)', borderLeft: value === opt.value ? '3px solid var(--theme-text)' : '3px solid transparent' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-elevation-50)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = value === opt.value ? 'var(--theme-elevation-100)' : 'transparent'}>
                {opt.label.split(' (')[0]} <span style={{ fontSize: '12px', opacity: 0.5, fontStyle: 'italic' }}>{opt.label.includes('(') ? `(${opt.label.split('(')[1]}` : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const CustomCombobox = ({ value, options, onChange, type = 'text', min, max }: { value: string | number, options: { value: string | number, label: string }[], onChange: (val: string | number) => void, type?: string, min?: number, max?: number }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])
  return (
    <div style={{ position: 'relative', width: '100%', padding: '2px', boxSizing: 'border-box' }} ref={dropdownRef}>
      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
        <input type={type} min={min} max={max} step="1" value={value === undefined || value === null ? '' : value} onChange={(e) => { const v = e.target.value; onChange(type === 'number' ? (v === '' ? '' : Number(v)) : v); setIsOpen(true) }} onClick={() => setIsOpen(true)} style={{ width: '100%', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)', padding: '8px 24px 8px 12px', borderRadius: '3px', border: '1px solid var(--theme-elevation-200)', fontSize: '13px', height: '40px', boxSizing: 'border-box', boxShadow: 'rgba(0,0,0,0.1) 0 2px 2px -1px', outline: 'none' }} />
        <div onClick={() => setIsOpen(!isOpen)} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--theme-elevation-500)' }}><FaChevronDown size={10} /></div>
      </div>
      {isOpen && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: 'var(--theme-elevation-0)', border: '1px solid var(--theme-elevation-200)', borderRadius: '4px', boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px', zIndex: 100, maxHeight: '200px', overflowY: 'auto' }}>
          {options.map((opt) => (
            <div key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }} style={{ padding: '10px 15px', cursor: 'pointer', fontSize: '13px', backgroundColor: String(value) === String(opt.value) ? 'var(--theme-elevation-100)' : 'transparent', color: 'var(--theme-text)' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-elevation-50)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = String(value) === String(opt.value) ? 'var(--theme-elevation-100)' : 'transparent'}>{opt.label}</div>
          ))}
        </div>
      )}
    </div>
  )
}

const CustomSegmentedControl = ({ value, options, onChange }: { value: any, options: { value: any, label: string }[], onChange: (val: any) => void }) => (
  <div style={{ display: 'flex', backgroundColor: 'var(--theme-elevation-50)', border: '1px solid var(--theme-elevation-200)', borderRadius: '3px', padding: '2px', gap: '2px', boxSizing: 'border-box', width: '100%' }}>
    {options.map((opt) => (
      <div key={opt.value} onClick={() => onChange(opt.value)} style={{ flex: 1, padding: '6px 12px', backgroundColor: value === opt.value ? 'var(--theme-elevation-0)' : 'transparent', color: value === opt.value ? 'var(--theme-text)' : 'var(--theme-elevation-500)', borderRadius: '4px', boxShadow: value === opt.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', border: value === opt.value ? '1px solid var(--theme-elevation-200)' : '1px solid transparent', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s ease', fontWeight: 500, textAlign: 'center' }}>{opt.label}</div>
    ))}
  </div>
)

const CustomSliderControl = ({ value, options, onChange }: { value: any, options: { value: any, label: string }[], onChange: (val: any) => void }) => {
  const incomingIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const [localIndex, setLocalIndex] = useState(incomingIndex);
  useEffect(() => setLocalIndex(incomingIndex), [incomingIndex]);
  const handleCommit = () => onChange(options[localIndex].value);
  return (
    <div style={{ padding: '4px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', width: '100%', height: '24px', display: 'flex', alignItems: 'center' }}>
        <input type="range" min="0" max={options.length - 1} step="1" value={localIndex} onChange={(e) => setLocalIndex(parseInt(e.target.value))} onMouseUp={handleCommit} onTouchEnd={handleCommit} style={{ width: '100%', margin: 0, zIndex: 2, accentColor: 'var(--theme-text)', cursor: 'pointer' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', color: 'var(--theme-elevation-500)', fontSize: '11px', fontWeight: 500 }}>
        {options.map((opt) => (
          <span key={opt.value} style={{ color: value === opt.value ? 'var(--theme-text)' : 'var(--theme-elevation-400)', fontWeight: value === opt.value ? 700 : 500 }}>{opt.label}</span>
        ))}
      </div>
    </div>
  )
}

const CustomColorInput = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '6px 15px', backgroundColor: 'var(--theme-bg)', border: '1px solid var(--theme-elevation-200)', borderRadius: '3px', boxShadow: 'rgba(0,0,0,0.1) 0 2px 2px -1px', boxSizing: 'border-box', minHeight: '40px' }}>
       <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: value || '#000000', marginRight: '8px', border: '1px solid var(--theme-elevation-200)', position: 'relative', overflow: 'hidden', cursor: 'pointer', flexShrink: 0 }}>
         <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', padding: 0, border: 'none', cursor: 'pointer', opacity: 0 }} />
       </div>
       <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', color: 'var(--theme-text)', fontSize: '13px', fontFamily: 'monospace', backgroundColor: 'transparent' }} placeholder="#000000" />
    </div>
  )
}

const NativeImageUpload = ({ value, onChange, label, aspect }: { value: any, onChange: (val: any) => void, label: string, aspect?: string }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(typeof value === 'string' && !!value)

  useEffect(() => {
    if (value && typeof value === 'object' && value.url) {
      setPreviewUrl(value.url)
    } else if (typeof value === 'string' && value) {
      setIsFetching(true)
      fetch(`/api/media/${value}`)
        .then(res => res.json())
        .then(doc => { if(doc.url) setPreviewUrl(doc.url) })
        .finally(() => setIsFetching(false))
    } else {
      setPreviewUrl(null)
    }
  }, [value])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/media', { method: 'POST', body: formData })
      if (res.ok) { const data = await res.json(); onChange(data.doc.id); setPreviewUrl(data.doc.url); }
    } catch (e) { console.error(e) } finally { setIsUploading(false); if (fileInputRef.current) fileInputRef.current.value = '' }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(null)
    setPreviewUrl(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={PAYLOAD_LABEL}>{label}</label>
      <div style={{ position: 'relative', width: '100%', margin: '0' }}>
        <div 
          onClick={() => { if (!value) fileInputRef.current?.click() }}
          style={{ 
            position: 'relative', width: '100%', height: '200px', 
            backgroundColor: 'var(--theme-elevation-50)', 
            border: value ? '4px solid var(--theme-elevation-100)' : '2px dashed var(--theme-elevation-200)', 
            borderRadius: '8px', overflow: 'hidden', display: 'flex', 
            alignItems: 'center', justifyContent: 'center',
            cursor: value ? 'default' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {isFetching || isUploading ? (
            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--theme-elevation-150)', animation: 'pulse 1.5s infinite ease-in-out' }} />
          ) : previewUrl ? (
            <img src={previewUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Preview" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--theme-elevation-400)' }}>
               <FaUpload size={24} />
               <span style={{ fontSize: '13px', fontWeight: 500 }}>Upload Image</span>
            </div>
          )}
          
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleUpload} style={{ display: 'none' }} />
        </div>
        
        {value && (
          <>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ position: 'absolute', bottom: '8px', right: '8px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--theme-elevation-800)', color: 'var(--theme-elevation-0)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', border: '2px solid var(--theme-elevation-0)', zIndex: 20, transition: 'all 0.2s' }}
              title="Change Photo"
            >
              <FaUpload size={14} />
            </div>
            <div
              onClick={handleRemove}
              style={{ position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', border: '2px solid var(--theme-elevation-0)', zIndex: 20, transition: 'all 0.2s' }}
              title="Remove Photo"
            >
              <FaTrash size={12} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export const StandaloneQRConfigurator: React.FC = () => {
  const { value: dotsType, setValue: setDotsType } = useField<string>({ path: 'qrLayout.dotsType' })
  const { value: color, setValue: setColor } = useField<string>({ path: 'qrLayout.color' })
  const { value: cornersSquareType, setValue: setCornersSquareType } = useField<string>({ path: 'qrLayout.cornersSquareType' })
  const { value: cornersDotType, setValue: setCornersDotType } = useField<string>({ path: 'qrLayout.cornersDotType' })
  const { value: backgroundImageValue, setValue: setBackgroundImage } = useField<any>({ path: 'qrLayout.backgroundImage' })
  const { value: errorCorrectionLevel, setValue: setErrorCorrectionLevel } = useField<string>({ path: 'qrLayout.errorCorrectionLevel' })
  const { value: logoImage, setValue: setLogoImage } = useField<any>({ path: 'qrLayout.logo.image' })
  const { value: logoSize, setValue: setLogoSize } = useField<number>({ path: 'qrLayout.logo.size' })
  const { value: logoStrokeWidth, setValue: setLogoStrokeWidth } = useField<number>({ path: 'qrLayout.logo.strokeWidth' })

  const { value: includeProductPhoto, setValue: setIncludeProductPhoto } = useField<boolean>({ path: 'qrLayout.includeProductPhoto' })
  const { value: productPhotoRoundness, setValue: setProductPhotoRoundness } = useField<number>({ path: 'qrLayout.productPhotoRoundness' })
  const { value: includeGarmentName, setValue: setIncludeGarmentName } = useField<boolean>({ path: 'qrLayout.includeGarmentName' })

  const { value: garmentNameFontFamily, setValue: setGarmentNameFontFamily } = useField<string>({ path: 'qrLayout.garmentNameFontFamily' })
  const { value: garmentNameFontSize, setValue: setGarmentNameFontSize } = useField<number>({ path: 'qrLayout.garmentNameFontSize' })
  const { value: garmentNameFontWeight, setValue: setGarmentNameFontWeight } = useField<string>({ path: 'qrLayout.garmentNameFontWeight' })
  const { value: garmentNameFontColor, setValue: setGarmentNameFontColor } = useField<string>({ path: 'qrLayout.garmentNameFontColor' })
  const { value: garmentNameTextAlign, setValue: setGarmentNameTextAlign } = useField<string>({ path: 'qrLayout.garmentNameTextAlign' })
  const { value: garmentNameTextVerticalAlign, setValue: setGarmentNameTextVerticalAlign } = useField<string>({ path: 'qrLayout.garmentNameTextVerticalAlign' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' }}>
      
      <FieldWrapper>
        <NativeImageUpload value={backgroundImageValue} onChange={setBackgroundImage} label="Background Image" />
      </FieldWrapper>

      {backgroundImageValue && (
        <>
          <FieldWrapper>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
              <div 
                onClick={() => setIncludeProductPhoto(!includeProductPhoto)}
                style={{
                  width: '18px', height: '18px', 
                  backgroundColor: includeProductPhoto ? 'var(--theme-success-500)' : 'transparent',
                  border: includeProductPhoto ? '1px solid var(--theme-success-500)' : '1px solid var(--theme-elevation-300)',
                  borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.1s'
                }}
              >
                {includeProductPhoto && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <label onClick={() => setIncludeProductPhoto(!includeProductPhoto)} style={{ ...PAYLOAD_LABEL, marginBottom: 0, cursor: 'pointer' }}>Include Guest Photo</label>
            </div>
          </FieldWrapper>
          <FieldWrapper>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
              <div 
                onClick={() => setIncludeGarmentName(!includeGarmentName)}
                style={{
                  width: '18px', height: '18px', 
                  backgroundColor: includeGarmentName ? 'var(--theme-success-500)' : 'transparent',
                  border: includeGarmentName ? '1px solid var(--theme-success-500)' : '1px solid var(--theme-elevation-300)',
                  borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.1s'
                }}
              >
                {includeGarmentName && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <label onClick={() => setIncludeGarmentName(!includeGarmentName)} style={{ ...PAYLOAD_LABEL, marginBottom: 0, cursor: 'pointer' }}>Include Guest Name</label>
            </div>
          </FieldWrapper>

          {includeGarmentName && (
            <>
              <FieldWrapper>
                <div style={{ display: 'flex', gap: '8px', width: '100%', alignItems: 'flex-end' }}>
                  <div style={{ flex: '2', minWidth: 0 }}>
                    <label style={{ ...PAYLOAD_LABEL, marginBottom: '6px' }}>Typography</label>
                    <CustomFontDropdown value={garmentNameFontFamily || 'Inter, sans-serif'} options={FONTS} onChange={setGarmentNameFontFamily} dropdownWidth="calc(200% + 16px)" />
                  </div>
                  <div style={{ flex: '1', minWidth: 0 }}>
                    <label style={{ ...PAYLOAD_LABEL, marginBottom: '6px' }}>Size</label>
                    <CustomCombobox type="number" min={8} max={300} value={garmentNameFontSize || 48} onChange={(v) => setGarmentNameFontSize(Number(v))} options={[{ label: '16', value: 16 }, { label: '32', value: 32 }, { label: '48', value: 48 }, { label: '64', value: 64 }]} />
                  </div>
                  <div style={{ flex: '1', minWidth: 0 }}>
                    <label style={{ ...PAYLOAD_LABEL, marginBottom: '6px' }}>Weight</label>
                    <CustomCombobox type="text" value={garmentNameFontWeight || '600'} onChange={(v) => setGarmentNameFontWeight(String(v))} options={[{ label: '300', value: '300' }, { label: '400', value: '400' }, { label: '600', value: '600' }, { label: '800', value: '800' }]} />
                  </div>
                </div>
              </FieldWrapper>
              <FieldWrapper>
                <label style={PAYLOAD_LABEL}>Text Color</label>
                <CustomColorInput value={garmentNameFontColor || '#000000'} onChange={setGarmentNameFontColor} />
              </FieldWrapper>
              <FieldWrapper>
                <label style={PAYLOAD_LABEL}>Text Alignment</label>
                <NineGridAlignSelector horizontal={garmentNameTextAlign || 'center'} vertical={garmentNameTextVerticalAlign || 'middle'} onChange={(h, v) => { setGarmentNameTextAlign(h); setGarmentNameTextVerticalAlign(v) }} />
              </FieldWrapper>
            </>
          )}
        </>
      )}

      <hr style={{ border: 'none', borderTop: '1px solid var(--theme-elevation-200)', margin: '8px 0' }} />

      <FieldWrapper>
        <label style={PAYLOAD_LABEL}>QR Color</label>
        <CustomColorInput value={color || '#000000'} onChange={setColor} />
      </FieldWrapper>

      <FieldWrapper>
        <label style={PAYLOAD_LABEL}>Data Pattern Shape (Dots)</label>
        <ShapeSelector value={dotsType || 'square'} options={[{ label: 'Rounded', value: 'rounded' }, { label: 'Dots', value: 'dots' }, { label: 'Classy', value: 'classy' }, { label: 'Classy R', value: 'classy-rounded' }, { label: 'Square', value: 'square' }, { label: 'Extra R', value: 'extra-rounded' }]} onChange={setDotsType} />
      </FieldWrapper>

      <FieldWrapper>
        <label style={PAYLOAD_LABEL}>Outer Corner Shape</label>
        <ShapeSelector value={cornersSquareType || 'square'} options={[{ label: 'Dot', value: 'dot' }, { label: 'Square', value: 'square' }, { label: 'Extra R', value: 'extra-rounded' }]} onChange={setCornersSquareType} />
      </FieldWrapper>

      <FieldWrapper>
        <label style={PAYLOAD_LABEL}>Inner Corner Shape</label>
        <ShapeSelector value={cornersDotType || 'square'} options={[{ label: 'Dot', value: 'dot' }, { label: 'Square', value: 'square' }]} onChange={setCornersDotType} />
      </FieldWrapper>

      <FieldWrapper>
        <NativeImageUpload value={logoImage} onChange={setLogoImage} label="Embedded Logo" />
      </FieldWrapper>

      {logoImage && (
        <>
          <FieldWrapper>
            <label style={PAYLOAD_LABEL}>Error Correction</label>
            <CustomSegmentedControl options={[{ label: 'Low', value: 'L' }, { label: 'Medium', value: 'M' }, { label: 'Quartile', value: 'Q' }, { label: 'High', value: 'H' }]} value={errorCorrectionLevel || 'Q'} onChange={setErrorCorrectionLevel} />
          </FieldWrapper>
          <FieldWrapper>
            <label style={PAYLOAD_LABEL}>Logo Size</label>
            <CustomSliderControl options={[{ label: 'XS', value: 1 }, { label: 'SM', value: 2 }, { label: 'MD', value: 3 }, { label: 'LG', value: 4 }, { label: 'XL', value: 5 }]} value={logoSize || 3} onChange={setLogoSize} />
          </FieldWrapper>
          <FieldWrapper>
            <label style={PAYLOAD_LABEL}>Outline Thickness</label>
            <CustomSliderControl options={[{ label: '0px', value: 0 }, { label: '2px', value: 2 }, { label: '4px', value: 4 }, { label: '6px', value: 6 }, { label: '8px', value: 8 }, { label: '10px', value: 10 }]} value={logoStrokeWidth ?? 3} onChange={setLogoStrokeWidth} />
          </FieldWrapper>
        </>
      )}

    </div>
  )
}
