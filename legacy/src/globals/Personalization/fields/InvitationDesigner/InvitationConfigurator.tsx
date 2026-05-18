'use client'

import { useField } from '@payloadcms/ui'
import React, { useState } from 'react'
import { FaChevronDown, FaTimes } from 'react-icons/fa'

const SWATCHES = [
  '#000000',
  '#ffffff',
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
  '#607D8B',
]

const panelStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  color: '#333',
  width: '100%',
  maxWidth: '360px',
  height: '100%',
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 200,
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--font-body, sans-serif)',
  overflowY: 'auto',
}

const headerStyle: React.CSSProperties = {
  padding: '24px',
  borderBottom: '1px solid rgba(0,0,0,0.06)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 600,
  fontSize: '1.1rem',
  color: '#1a1a1a',
}

const sectionStyle: React.CSSProperties = {
  padding: '12px 0',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

/* Helper Components */
const ShapeIcon = ({ type }: { type: string }) => {
  const commonStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    backgroundColor: 'currentColor',
    transition: 'all 0.2s',
  }

  // dots
  if (type === 'dots' || type === 'dot') {
    return <div style={{ ...commonStyle, borderRadius: '50%' }} />
  }
  // rounded
  if (type === 'rounded') {
    return <div style={{ ...commonStyle, borderRadius: '4px' }} />
  }
  // extra-rounded
  if (type === 'extra-rounded') {
    return <div style={{ ...commonStyle, borderRadius: '8px' }} />
  }
  // classy
  if (type === 'classy') {
    return <div style={{ ...commonStyle, borderRadius: '50% 50% 0 50%' }} />
  }
  // classy-rounded
  if (type === 'classy-rounded') {
    return <div style={{ ...commonStyle, borderRadius: '50% 50% 4px 50%' }} />
  }
  // square default
  return <div style={{ ...commonStyle, borderRadius: '0px' }} />
}

const ShapeSelector = ({
  value,
  options,
  onChange,
}: {
  value: string
  options: { value: string; label: string }[]
  onChange: (val: string) => void
}) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
    {options.map((opt) => {
      const isSelected = value === opt.value
      return (
        <div
          key={opt.value}
          onClick={() => onChange(opt.value)}
          role="button"
          tabIndex={0}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 4px',
            backgroundColor: isSelected ? '#333' : '#fff',
            color: isSelected ? '#fff' : '#333',
            border: isSelected ? '1px solid #333' : '1px solid #e2e8f0',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            gap: '6px',
          }}
          title={opt.label}
        >
          <ShapeIcon type={opt.value} />
          <span
            style={{ fontSize: '0.65rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.1 }}
          >
            {opt.label}
          </span>
        </div>
      )
    })}
  </div>
)

const CustomSelect = ({
  value,
  options,
  onChange,
}: {
  value: string
  options: { value: string; label: string }[]
  onChange: (val: string) => void
}) => (
  <div style={{ position: 'relative' }}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        backgroundColor: '#fff',
        color: '#333',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        fontSize: '0.9rem',
        cursor: 'pointer',
        appearance: 'none',
        WebkitAppearance: 'none',
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <div
      style={{
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        color: '#64748b',
      }}
    >
      <FaChevronDown size={10} />
    </div>
  </div>
)

const CustomColorInput = ({
  value,
  onChange,
  swatches,
}: {
  value: string
  onChange: (val: string) => void
  swatches?: string[]
}) => (
  <div>
    {swatches && (
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 8 }}>
        {swatches.slice(0, 14).map((c) => {
          const hex = c === 'dark' ? '#222' : c === 'gray' ? '#888' : c.startsWith('#') ? c : '#888' // simplified fallback
          return (
            <div
              key={c}
              onClick={() => onChange(c.startsWith('#') ? c : hex)} // primitive fallback
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: hex,
                cursor: 'pointer',
                border: value === c ? '2px solid #333' : '1px solid transparent',
              }}
              title={c}
            />
          )
        })}
      </div>
    )}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        padding: '4px 8px',
        backgroundColor: '#fff',
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: value || '#000000',
          marginRight: '8px',
          border: '1px solid rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            padding: 0,
            border: 'none',
            cursor: 'pointer',
            opacity: 0,
          }}
        />
      </div>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          color: '#333',
          fontSize: '0.9rem',
          fontFamily: 'monospace',
        }}
        placeholder="#000000"
      />
    </div>
  </div>
)

/* Custom Accordion Implementation */
const CollapsibleSection = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div style={{ borderBottom: '1px solid #f1f5f9' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        style={{
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          backgroundColor: isOpen ? '#f8fafc' : 'transparent',
          transition: 'background-color 0.2s',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{title}</span>
        <div
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FaChevronDown size={12} />
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s ease-out',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div style={{ padding: '0 24px 24px 24px', backgroundColor: '#f8fafc' }}>{children}</div>
        </div>
      </div>
    </div>
  )
}

interface InvitationConfiguratorProps {
  opened: boolean
  onClose: () => void
}

export const InvitationConfigurator: React.FC<InvitationConfiguratorProps> = ({ opened, onClose }) => {
  // Fields (using Payload hooks)
  const { value: dotsType, setValue: setDotsType } = useField<string>({ path: 'qrLayout.dotsType' })
  const { value: color, setValue: setColor } = useField<string>({ path: 'qrLayout.color' })

  const { value: cornersSquareType, setValue: setCornersSquareType } = useField<string>({
    path: 'qrLayout.cornersSquareType',
  })
  const { value: cornersSquareColor, setValue: setCornersSquareColor } = useField<string>({
    path: 'qrLayout.cornersSquareColor',
  })

  const { value: cornersDotType, setValue: setCornersDotType } = useField<string>({
    path: 'qrLayout.cornersDotType',
  })
  const { value: cornersDotColor, setValue: setCornersDotColor } = useField<string>({
    path: 'qrLayout.cornersDotColor',
  })

  const { value: showLogo, setValue: setShowLogo } = useField<boolean>({
    path: 'qrLayout.logo.show',
  })
  const { value: logoSize, setValue: setLogoSize } = useField<number>({
    path: 'qrLayout.logo.size',
  })

  // if (!opened) return null // Removed to allow animation

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 150,
          opacity: opened ? 1 : 0,
          pointerEvents: opened ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />
      {/* Panel */}
      <div
        style={{
          ...panelStyle,
          transform: opened ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={headerStyle}>
          <span>Invitation Customization</span>
          <div
            onClick={onClose}
            role="button"
            tabIndex={0}
            style={{
              background: 'none',
              border: 'none',
              color: '#333',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaTimes size={18} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <CollapsibleSection title="Dots Style" defaultOpen>
            <div style={sectionStyle}>
              <label style={labelStyle}>Shape</label>
              <ShapeSelector
                value={dotsType || 'square'}
                options={[
                  { label: 'Rounded', value: 'rounded' },
                  { label: 'Dots', value: 'dots' },
                  { label: 'Classy', value: 'classy' },
                  { label: 'Classy R', value: 'classy-rounded' }, // Shortened label
                  { label: 'Square', value: 'square' },
                  { label: 'Extra R', value: 'extra-rounded' }, // Shortened label
                ]}
                onChange={setDotsType}
              />
            </div>
            <div style={sectionStyle}>
              <label style={labelStyle}>Color</label>
              <CustomColorInput
                value={color || '#000000'}
                onChange={setColor}
                swatches={undefined} // simplified for now, or re-add logic
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Corners Style">
            <div style={sectionStyle}>
              <label style={labelStyle}>Square Shape</label>
              <ShapeSelector
                value={cornersSquareType || 'square'}
                options={[
                  { label: 'Dot', value: 'dot' },
                  { label: 'Square', value: 'square' },
                  { label: 'Extra R', value: 'extra-rounded' },
                ]}
                onChange={setCornersSquareType}
              />
            </div>
            <div style={sectionStyle}>
              <label style={labelStyle}>Square Color</label>
              <CustomColorInput
                value={cornersSquareColor || '#000000'}
                onChange={setCornersSquareColor}
              />
            </div>

            <div style={{ ...sectionStyle, marginTop: 12 }}>
              <label style={labelStyle}>Inner Dot Shape</label>
              <ShapeSelector
                value={cornersDotType || 'square'}
                options={[
                  { label: 'Dot', value: 'dot' },
                  { label: 'Square', value: 'square' },
                ]}
                onChange={setCornersDotType}
              />
            </div>
            <div style={sectionStyle}>
              <label style={labelStyle}>Inner Dot Color</label>
              <CustomColorInput
                value={cornersDotColor || '#000000'}
                onChange={setCornersDotColor}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Logo Integration">
            <div style={sectionStyle}>
              <label
                style={{
                  ...labelStyle,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  textTransform: 'none',
                  color: '#333',
                  fontSize: '0.9rem',
                }}
              >
                <input
                  type="checkbox"
                  checked={showLogo || false}
                  onChange={(e) => setShowLogo(e.target.checked)}
                  style={{ accentColor: '#1e293b', width: 16, height: 16, cursor: 'pointer' }}
                />
                Show Logo
              </label>
            </div>
            {showLogo && (
              <div style={sectionStyle}>
                <label style={labelStyle}>Logo Size: {logoSize || 20}%</label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={logoSize || 20}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: '#1e293b',
                    cursor: 'pointer',
                    height: '4px',
                    borderRadius: '2px',
                  }}
                />
              </div>
            )}
          </CollapsibleSection>
        </div>
      </div>
    </>
  )
}
