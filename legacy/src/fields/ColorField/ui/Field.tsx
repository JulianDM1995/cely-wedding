'use client'

import { useField } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'
import React, { useEffect, useMemo, useState } from 'react'

const isValidCssColor = (color: string) => {
  if (typeof window === 'undefined') return true
  const s = new Option().style
  s.color = color
  return s.color !== ''
}

interface ColorFieldProps extends TextFieldClientProps {
  updateOnFinish?: boolean
  includeAlpha?: boolean
}

const toSafeHexForPicker = (val: unknown): string => {
  if (typeof val !== 'string' || !val) return '#000000'
  const c = val.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return c
  const m3 = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/.exec(c)
  if (m3) return `#${m3[1]}${m3[1]}${m3[2]}${m3[2]}${m3[3]}${m3[3]}`
  const m8 = /^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})$/.exec(c)
  if (m8) return `#${m8[1]}`
  return '#000000'
}

const getAlphaFromColor = (color: string): number => {
  const c = color.trim()
  const m8 = /^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})$/.exec(c)
  if (m8) {
    return parseInt(m8[2], 16) / 255
  }
  const rgbaMatch = /^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*(?:,\s*([0-9.]+)\s*)?\)$/i.exec(
    c,
  )
  if (rgbaMatch) {
    const alpha = rgbaMatch[4]
    return alpha != null ? Math.max(0, Math.min(1, parseFloat(alpha))) : 1
  }
  return 1
}

const setAlphaOnHex = (hex: string, alpha: number): string => {
  const clean = toSafeHexForPicker(hex)
  const clamped = Math.max(0, Math.min(1, alpha))
  const alphaByte = Math.round(clamped * 255)
  return `${clean}${alphaByte.toString(16).padStart(2, '0')}`
}

const Field = ({ path, field, updateOnFinish = false, includeAlpha = false }: ColorFieldProps) => {
  const { value: currentRaw, setValue } = useField<string | null>({ path })
  const current = typeof currentRaw === 'string' && currentRaw.length > 0 ? currentRaw : '#000000'
  const [tempColor, setTempColor] = useState<string>(current)
  const alphaValue = useMemo(() => Math.round(getAlphaFromColor(tempColor) * 100), [tempColor])

  useEffect(() => {
    setTempColor(typeof currentRaw === 'string' && currentRaw.length > 0 ? currentRaw : '#000000')
  }, [currentRaw])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setTempColor(newColor)
    if (!updateOnFinish && isValidCssColor(newColor)) setValue(newColor)
  }

  const handleTextBlur = () => {
    if (updateOnFinish && isValidCssColor(tempColor)) setValue(tempColor)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    const finalColor = includeAlpha ? setAlphaOnHex(newColor, alphaValue / 100) : newColor
    setTempColor(finalColor)
    if (!updateOnFinish && isValidCssColor(finalColor)) setValue(finalColor)
  }

  const handleColorBlur = () => {
    if (updateOnFinish && isValidCssColor(tempColor)) setValue(tempColor)
  }

  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextAlpha = Math.max(0, Math.min(100, Number(e.target.value)))
    const baseHex = toSafeHexForPicker(tempColor)
    const withAlpha = setAlphaOnHex(baseHex, nextAlpha / 100)
    setTempColor(withAlpha)
    if (!updateOnFinish && isValidCssColor(withAlpha)) setValue(withAlpha)
  }

  const isValid = isValidCssColor(tempColor)
  const safeHex = useMemo(() => toSafeHexForPicker(tempColor), [tempColor])

  return (
    <div
      className="field-type text"
      style={{
        width: '100%',
        flex: 1,
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      {typeof field.label === 'string' && (
        <label className="field-label" htmlFor={path}>
          {field.label}
          {field.required && <span className="required">*</span>}
        </label>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            minWidth: 0,
            boxSizing: 'border-box',
            border: isValid
              ? '1px solid var(--theme-elevation-150)'
              : '1px solid var(--theme-error-400)',
            borderRadius: 'var(--style-radius-s)',
            backgroundColor: isValid ? 'var(--theme-input-bg)' : 'var(--theme-error-100)',
            padding: '0 0.25rem 0 0.25rem',
            gap: '0.2rem',
          }}
        >
          {/* círculo visible */}
          <div
            style={{
              position: 'relative',
              width: 22,
              height: 22,
              flexShrink: 0,
              borderRadius: '50%',
              border: '1px solid var(--theme-elevation-300)',
              backgroundColor: isValid ? tempColor : 'transparent',
              marginLeft: '0.5rem', // ⬅️ aumentado en 4px
              boxShadow:
                'rgba(0, 0, 0, .1) 0 0 0 .0625rem inset, rgba(0, 0, 0, .15) 0 0 .25rem inset',
            }}
          >
            <input
              type="color"
              value={safeHex}
              onChange={handleColorChange}
              onBlur={handleColorBlur}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
                width: '100%',
                height: '100%',
              }}
              aria-label="Color picker"
            />
          </div>

          {/* input de texto */}
          <input
            type="text"
            value={typeof tempColor === 'string' ? tempColor : ''}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              fontSize: 14,
              backgroundColor: 'transparent',
              paddingLeft: 8,
            }}
            placeholder="#RRGGBB / red / rgb(23,45,34)"
            aria-invalid={!isValid}
          />
        </div>

        {includeAlpha && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--theme-elevation-500)' }}>Alpha</span>
            <input
              type="range"
              className="sliderInput"
              min={0}
              max={100}
              step={1}
              value={alphaValue}
              onChange={handleAlphaChange}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: 12, color: 'var(--theme-elevation-700)', width: 32, textAlign: 'right' }}>
              {alphaValue}%
            </span>
          </div>
        )}
      </div>

      <style jsx>{`
        .sliderInput {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          background: transparent;
          box-shadow: none;
          border: none;
        }

        .sliderInput::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          background: var(--theme-elevation-100);
          border-radius: 2px;
        }

        .sliderInput::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          margin-top: -6px;
          background: var(--theme-elevation-800);
          border-radius: 50%;
        }

        .sliderInput::-moz-range-track {
          width: 100%;
          height: 4px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 2px;
        }

        .sliderInput::-moz-range-thumb {
          height: 16px;
          width: 16px;
          background: #333;
          border-radius: 50%;
        }
      `}</style>
    </div>
  )
}

export default Field
