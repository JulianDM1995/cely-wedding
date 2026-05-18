'use client'

import { ShimmerEffect, useField, useForm, useTranslation } from '@payloadcms/ui'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MdAdd, MdClose } from 'react-icons/md'
import { VscLoading } from 'react-icons/vsc'

type PayloadPhoto = { id: string; url?: string; alt?: string }

export const PhotosArrayField: React.FC<{ path?: string; field?: Record<string, unknown> & { label?: string | Record<string, string>, required?: boolean, admin?: { custom?: { relationTo?: string } } } }> = ({ path, field }) => {
  const { value, setValue, showError, errorMessage } = useField<(string | PayloadPhoto)[]>({ path: path || '' })
  const { submit } = useForm()
  const { i18n } = useTranslation()
  const photos = useMemo(() => Array.isArray(value) ? value : [], [value])

  const [populatedPhotos, setPopulatedPhotos] = useState<PayloadPhoto[]>([])
  const [isFetchingPhotos, setIsFetchingPhotos] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photoCache = useRef<Record<string, PayloadPhoto>>({})

  useEffect(() => {
    setIsMac(typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0)
  }, [])

  const relationTo = field?.admin?.custom?.relationTo || (field as any)?.custom?.relationTo || 'media'

  useEffect(() => {
    let active = true
    const fetchPhotos = async () => {
      let missing = false
      photos.forEach(p => {
        const id = typeof p === 'string' ? p : p.id
        if (id && !photoCache.current[id]) missing = true
      })
      if (missing) setIsFetchingPhotos(true)

      const fetched = await Promise.all(
        photos.map(async (photo) => {
          const id = typeof photo === 'string' ? photo : photo.id
          if (id && photoCache.current[id]) return photoCache.current[id]

          if (typeof photo === 'string') {
            try {
              const res = await fetch(`/api/${relationTo}/${photo}`)
              if (res.ok) {
                 const data = await res.json()
                 if (id) photoCache.current[id] = data
                 return data
              }
            } catch (e) {
              console.error(e)
            }
            return null
          }
          if (id) photoCache.current[id] = photo
          return photo
        })
      )
      if (active) {
        setPopulatedPhotos(fetched.filter(Boolean))
        setIsFetchingPhotos(false)
      }
    }

    fetchPhotos()
    return () => { active = false }
  }, [photos, relationTo])

  const uploadFile = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('_payload', JSON.stringify({ alt: file.name || 'Garment Photo' }))

    try {
      const res = await fetch(`/api/${relationTo}`, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const doc = await res.json()
        const newId = doc.doc.id

        const currentIds = photos.map(p => typeof p === 'string' ? p : p.id)
        const combined = [...new Set([...currentIds, newId])]
        setValue(combined)
        setTimeout(() => submit(), 100)
      } else {
        console.error('[Upload Error]', await res.text())
      }
    } catch (err) {
      console.error('[Upload Exception]', err)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (file) uploadFile(file)
        e.preventDefault()
        return
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (draggedIdx !== null) {
      if (draggedIdx !== photos.length - 1) {
        const newPhotos = [...photos]
        const [movedItem] = newPhotos.splice(draggedIdx, 1)
        newPhotos.push(movedItem)
        setValue(newPhotos.map(p => typeof p === 'string' ? p : p.id))
        setTimeout(() => submit(), 100)
      }
      setDraggedIdx(null)
      setDragOverIdx(null)
      return
    }

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      uploadFile(file)
    }
  }

  const handleRemove = async (idToRemove: string) => {
    try {
      await fetch(`/api/${relationTo}/${idToRemove}`, { method: 'DELETE' })
    } catch (e) {
      console.error('Failed to delete media', e)
    }

    setValue(photos.filter(p => {
      const id = typeof p === 'string' ? p : p.id
      return id !== idToRemove
    }))

    setTimeout(() => submit(), 100)
  }

  const [expandedPhoto, setExpandedPhoto] = useState<{ url: string, alt: string } | null>(null)

  return (
    <div className="field-type GarmentVariantPhotosField" style={{ marginBottom: '24px' }}>
      <label className="field-label" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', margin: '0 0 4px 0' }}>
        <span style={{ lineHeight: 1 }}>
          {(field?.label && typeof field.label === 'object' ? (field.label[i18n.language] || field.label['en'] || field.label['es']) : field?.label) as React.ReactNode || 'Photos'}
          {field?.required && <span className="required">*</span>}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--theme-elevation-400)', fontWeight: 400, lineHeight: 1 }}>
          {i18n.language === 'es' ? `Puedes pegar (${isMac ? '⌘V' : 'Ctrl+V'}) o arrastrar imágenes aquí` : `You can paste (${isMac ? '⌘V' : 'Ctrl+V'}) or drag images here`}
        </span>
      </label>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*"
      />

      <div
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ 
          display: 'flex', 
          gap: '12px', 
          overflowX: 'auto', 
          padding: '8px',
          borderRadius: '4px',
          border: showError
            ? '1px solid var(--theme-error-400)'
            : isDragging 
              ? '1px dashed var(--theme-elevation-400)' 
              : isFocused 
                ? '1px solid var(--theme-elevation-400)' 
                : '1px solid var(--theme-elevation-150)',
          background: showError ? 'rgba(234, 58, 61, 0.05)' : isDragging ? 'var(--theme-elevation-50)' : 'var(--theme-bg)',
          outline: 'none',
          transition: 'all 0.2s ease',
          boxShadow: showError ? '0 0 0 1px var(--theme-error-400)' : isFocused ? '0 0 0 1px var(--theme-elevation-400)' : 'none'
        }}
      >
        {isFetchingPhotos && photos.length > 0 ? (
          // Render a skeleton for each photo ID we are fetching
          photos.map((_, i) => (
            <div
              key={`skeleton-${i}`}
              style={{
                width: '160px', height: '240px', flexShrink: 0,
                borderRadius: 'var(--style-radius-m, 8px)', overflow: 'hidden',
                background: 'var(--theme-elevation-50)', border: '1px solid var(--theme-elevation-150)',
              }}
            >
              <ShimmerEffect />
            </div>
          ))
        ) : (
          populatedPhotos.map((photo, index) => (
            <React.Fragment key={photo.id || Math.random().toString()}>
              {dragOverIdx === index && draggedIdx !== index && (
                <div style={{
                  width: '4px', height: '240px', borderRadius: '4px',
                  backgroundColor: 'var(--theme-elevation-800)', flexShrink: 0,
                  transition: 'all 0.2s ease'
                }} />
              )}
              <div
                onClick={() => setExpandedPhoto({ url: photo.url || '', alt: photo.alt || '' })}
                draggable={true}
                onDragStart={(e) => {
                  e.stopPropagation()
                  setTimeout(() => setDraggedIdx(index), 0)
                  e.dataTransfer.effectAllowed = 'move'
                  e.dataTransfer.setData('text/plain', index.toString())
                }}
                onDragEnd={(e) => {
                  e.stopPropagation()
                  setDraggedIdx(null)
                  setDragOverIdx(null)
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (draggedIdx !== null && dragOverIdx !== index) {
                    setDragOverIdx(index)
                  }
                }}
                onDragLeave={() => {
                  if (dragOverIdx === index) {
                    setDragOverIdx(null)
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setDragOverIdx(null)

                  if (draggedIdx === null) {
                    const file = e.dataTransfer.files?.[0]
                    if (file && file.type.startsWith('image/')) {
                      uploadFile(file)
                    }
                    return
                  }

                  if (draggedIdx === index) return
                  
                  const newPhotos = [...photos]
                  const [movedItem] = newPhotos.splice(draggedIdx, 1)
                  newPhotos.splice(index, 0, movedItem)
                  
                  setValue(newPhotos.map(p => typeof p === 'string' ? p : p.id))
                  setTimeout(() => submit(), 100)
                  setDraggedIdx(null)
                }}
                style={{
                  position: 'relative',
                  width: '160px',
                  height: '240px',
                  flexShrink: 0,
                  borderRadius: 'var(--style-radius-m, 8px)',
                  overflow: 'hidden',
                  background: 'var(--theme-elevation-50)',
                  border: '1px solid var(--theme-elevation-150)',
                  cursor: draggedIdx !== null ? 'grabbing' : 'grab',
                  opacity: draggedIdx === index ? 0.5 : 1,
                  transform: draggedIdx === index ? 'scale(0.95)' : 'scale(1)',
                  transition: 'transform 0.2s ease, opacity 0.2s ease',
                }}
              onMouseEnter={(e) => {
                if (draggedIdx !== null) return
                const actions = e.currentTarget.querySelector('.photo-actions') as HTMLDivElement
                if (actions) actions.style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                const actions = e.currentTarget.querySelector('.photo-actions') as HTMLDivElement
                if (actions) actions.style.opacity = '0'
              }}
            >
              {photo.url ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={photo.alt || 'Garment Photo'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </>
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShimmerEffect />
                </div>
              )}
              <div
                className="photo-actions"
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
                  padding: '10px', display: 'flex', justifyContent: 'flex-end',
                  opacity: 0, transition: 'opacity 200ms ease',
                }}
              >
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(photo.id) }}
                  style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
                >
                  <MdClose size={20} />
                </button>
              </div>
            </div>
          </React.Fragment>
          ))
        )}
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          style={{
            width: '160px', height: '240px', flexShrink: 0,
            borderRadius: 'var(--style-radius-m, 8px)',
            background: isDragging ? 'var(--theme-elevation-100)' : showError ? 'rgba(234, 58, 61, 0.05)' : 'var(--theme-elevation-50)',
            border: isDragging ? '2px dashed var(--theme-elevation-500)' : showError ? '1px dashed var(--theme-error-400)' : '1px dashed var(--theme-elevation-200)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '8px', 
            color: showError ? 'var(--theme-error-500)' : 'var(--theme-elevation-500)',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            transition: 'all 200ms ease',
            opacity: isUploading ? 0.7 : 1,
            transform: isDragging ? 'scale(1.02)' : 'scale(1)',
          }}
          onMouseEnter={(e) => {
            if (isUploading || isDragging) return
            e.currentTarget.style.background = showError ? 'rgba(234, 58, 61, 0.1)' : 'var(--theme-elevation-100)'
            e.currentTarget.style.color = showError ? 'var(--theme-error-600)' : 'var(--theme-elevation-800)'
          }}
          onMouseLeave={(e) => {
            if (isUploading || isDragging) return
            e.currentTarget.style.background = showError ? 'rgba(234, 58, 61, 0.05)' : 'var(--theme-elevation-50)'
            e.currentTarget.style.color = showError ? 'var(--theme-error-500)' : 'var(--theme-elevation-500)'
          }}
        >
          {isUploading ? (
            <>
              <VscLoading size={32} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{i18n.language === 'es' ? 'Subiendo...' : 'Uploading...'}</span>
            </>
          ) : (
            <>
              <MdAdd size={32} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>
                {isDragging ? (i18n.language === 'es' ? 'Suelta la Foto Aquí' : 'Drop Photo Here') : (i18n.language === 'es' ? 'Agregar Foto' : 'Add Photo')}
              </span>
            </>
          )}
        </button>
      </div>

      {showError && errorMessage && (
        <div style={{ color: 'var(--theme-error-400)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 500 }}>
          {errorMessage}
        </div>
      )}

      {expandedPhoto && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setExpandedPhoto(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setExpandedPhoto(null)}
              style={{
                position: 'absolute', top: '4px', right: '4px',
                background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                color: 'white', cursor: 'pointer', width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
              }}
            >
              <MdClose size={18} />
            </button>
            <div style={{ position: 'relative', width: '90vw', height: '90vh', maxWidth: '1200px', maxHeight: '1200px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={expandedPhoto.url}
                alt={expandedPhoto.alt}
                style={{
                  width: '100%', height: '100%', objectFit: 'contain',
                  borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', display: 'block',
                }}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default PhotosArrayField
