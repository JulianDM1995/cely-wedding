import React, { useState, useRef, useEffect } from 'react'

interface QueryParam {
  key: string
  value: string
}

interface QueryParamsInputProps {
  value: QueryParam[]
  onChange: (value: QueryParam[]) => void
  label?: string
  collapsible?: boolean
}

// Reused perfectly matched icons from CustomUI Context Prompts
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
      color: 'var(--theme-elevation-400)',
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ opacity: 0.5, marginLeft: '10px' }}
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
)

const TrashIcon = ({ onClick }: { onClick: (e: React.MouseEvent) => void }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      background: 'none',
      border: 'none',
      padding: '4px',
      cursor: 'pointer',
      color: 'var(--theme-elevation-400)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'color 0.2s',
      marginRight: '8px',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--theme-elevation-400)')}
    title="Remove Parameter"
  >
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  </button>
)

// Reused perfectly matched input style
export const PAYLOAD_INPUT: React.CSSProperties = {
  backgroundColor: 'var(--theme-bg)',
  border: '1px solid var(--theme-elevation-200)',
  borderRadius: '3px',
  boxShadow: 'rgba(0,0,0,0.1) 0 2px 2px -1px',
  color: 'var(--theme-text)',
  fontSize: '13px',
  height: '40px',
  lineHeight: '20px',
  padding: '8px 15px',
  boxSizing: 'border-box',
  width: '100%',
  fontFamily: 'inherit',
  outline: 'none',
}

const QueryParamRow = ({ 
  p, 
  idx, 
  isLast, 
  handleChange, 
  handleRemove 
}: { 
  p: QueryParam, 
  idx: number, 
  isLast: boolean,
  handleChange: (index: number, field: keyof QueryParam, newValue: string) => void,
  handleRemove: (index: number) => void
}) => {
  const [isOpen, setIsOpen] = useState(!p.key && !p.value)
  const [isEditing, setIsEditing] = useState(!p.key && !p.value)
  const [isHovered, setIsHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  return (
    <div
      style={{
        backgroundColor: 'var(--theme-elevation-0)',
        position: 'relative',
        zIndex: isOpen ? 2 : 1,
        borderBottom: isLast ? 'none' : '1px solid var(--theme-elevation-200)',
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0 16px',
          height: '48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          backgroundColor: isOpen ? 'var(--theme-elevation-50)' : 'transparent',
          borderBottom: isOpen ? '1px solid var(--theme-elevation-200)' : 'none',
          transition: 'background-color 0.2s',
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', flex: 1, marginRight: '16px', height: '100%' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={p.key || ''}
              onChange={(e) => handleChange(idx, 'key', e.target.value.replace(/\s+/g, '_'))}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditing(false)
              }}
              onClick={(e) => e.stopPropagation()}
              placeholder={`Parameter ${idx + 1}`}
              style={{
                fontWeight: 400,
                color: 'var(--theme-text)',
                fontSize: '14px',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                cursor: 'text',
                padding: '0',
                borderBottom: '1px solid var(--theme-elevation-200)',
              }}
            />
          ) : (
            <div
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'text',
                flex: 1,
                height: '100%',
              }}
            >
              <span style={{ fontWeight: 400, color: 'var(--theme-text)', fontSize: '14px' }}>
                {p.key || `Parameter ${idx + 1}`}
              </span>
              {isHovered && <EditIcon />}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TrashIcon
            onClick={(e) => {
              e.stopPropagation()
              handleRemove(idx)
            }}
          />
          <ChevronIcon isOpen={isOpen} />
        </div>
      </div>

      {isOpen && (
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Value (e.g. source, value)"
              value={p.value}
              onChange={(e) => handleChange(idx, 'value', e.target.value)}
              style={PAYLOAD_INPUT}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export const QueryParamsInput: React.FC<QueryParamsInputProps> = ({
  value = [],
  onChange,
  label = 'URL Params',
}) => {
  const handleChange = (index: number, field: keyof QueryParam, newValue: string) => {
    const next = [...value]
    next[index] = { ...next[index], [field]: newValue }
    onChange(next)
  }

  const handleRemove = (index: number) => {
    const next = [...value]
    next.splice(index, 1)
    onChange(next)
  }

  const handleAdd = () => {
    onChange([...value, { key: '', value: '' }])
  }

  return (
    <div style={{ width: '100%', marginTop: '8px', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '5px',
        }}
      >
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 400, lineHeight: '20px', color: 'var(--theme-text)', marginBottom: 0, padding: 0 }}>
          {label}
        </label>
        <button
          type="button"
          onClick={handleAdd}
          style={{
            width: '28px',
            height: '28px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            color: 'var(--theme-text)',
            fontSize: '20px',
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
          title="Add Parameter"
        >
          +
        </button>
      </div>

      {value.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            borderRadius: '6px',
            border: '1px solid var(--theme-elevation-200)',
            overflow: 'hidden',
          }}
        >
          {value.map((p, idx) => (
            <QueryParamRow
              key={idx}
              p={p}
              idx={idx}
              isLast={idx === value.length - 1}
              handleChange={handleChange}
              handleRemove={handleRemove}
            />
          ))}
        </div>
      )}
      
      {value.length === 0 && (
        <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--theme-elevation-400)', fontSize: '13px', border: '1px dashed var(--theme-elevation-200)', borderRadius: '4px' }}>
          No URL parameters configured yet.
        </div>
      )}
    </div>
  )
}
