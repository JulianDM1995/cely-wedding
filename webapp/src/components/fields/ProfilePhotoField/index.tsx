'use client'

import { useField } from '@payloadcms/ui'
// removed next/image
import React, { useCallback, useRef, useState } from 'react'
import { FaCamera, FaTrash, FaUser } from 'react-icons/fa6'

const ProfilePhotoField: React.FC<{ path?: string }> = ({ path }) => {
  const fieldPath = path || 'profilePhoto'
  const { value, setValue } = useField<string | { id: string; url?: string }>({
    path: fieldPath,
  })

  // Local state for the preview URL to show immediately after upload/selection
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => {
    if (value && typeof value === 'object' && 'url' in value) {
      return value.url || null
    }
    return null
  })

  // Ensure preview updates if value changes externally
  React.useEffect(() => {
    if (value && typeof value === 'object' && 'url' in value) {
      setPreviewUrl(value.url || null)
    } else if (!value) {
      setPreviewUrl(null)
    }
  }, [value])

  // Fetch image URL if value is just an ID (string)
  React.useEffect(() => {
    const fetchImage = async () => {
      if (typeof value === 'string' && value) {
        setIsFetching(true) // Ensure it is true when starting fetch
        try {
          const res = await fetch(`/api/media/${value}`)
          if (res.ok) {
            const doc = await res.json()
            if (doc.url) {
              setPreviewUrl(doc.url)
            }
          }
        } catch (error) {
          console.error('Error fetching image:', error)
        } finally {
          setIsFetching(false) // Turn off when done
        }
      } else {
        // If value is not a string (e.g. null or object), we are not fetching
        setIsFetching(false)
      }
    }

    if (value && typeof value === 'string' && !previewUrl) {
      fetchImage()
    } else {
      // If we have an object or no value, make sure loading is off
      setIsFetching(false)
    }
  }, [value, previewUrl])

  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  // Initialize isFetching to true if value is a string (ID), to show skeleton immediately on mount
  const [isFetching, setIsFetching] = useState(() => typeof value === 'string' && !!value)

  const isLoading = isUploading || isFetching

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setIsUploading(true)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('_payload_token', 'null')

        const res = await fetch('/api/media', {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        })

        if (!res.ok) throw new Error('Upload failed')

        const json = await res.json()
        const newDoc = json.doc

        // Update the field with the new ID
        setValue(newDoc.id)
        setPreviewUrl(newDoc.url)
        console.log('Profile photo updated')
      } catch (err) {
        console.error(err)
        console.error('Error uploading photo')
      } finally {
        setIsUploading(false)
        // Reset input
        if (inputRef.current) inputRef.current.value = ''
      }
    },
    [setValue],
  )

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setValue(null)
      setPreviewUrl(null)
    },
    [setValue],
  )

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    inputRef.current?.click()
  }

  return (
    <div
      style={{
        marginBottom: '2rem',
        marginTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ position: 'relative' }}>
        {/* Main Avatar - Static / Non-interactive container */}
        <div
          style={{
            position: 'relative',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid var(--theme-elevation-0)', // White/Background border
            backgroundColor: 'var(--theme-elevation-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // No cursor pointer, no hover effects on the image itself
          }}
        >
          {/* Image, Skeleton, or Icon */}
          {isLoading ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--theme-elevation-150)',
                animation: 'pulse 1.5s infinite ease-in-out',
              }}
            />
          ) : previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
<img
              src={previewUrl}
              alt="Profile"
              width={160}
              height={160}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <FaUser size={64} color="var(--theme-elevation-400)" style={{ opacity: 0.5 }} />
          )}

          {/* Loading Overlay (only for upload, effectively covered by skeleton but kept for safety) */}
          <style>{`
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          `}</style>
        </div>

        {/* Floating Edit Button (Bottom-Right) - The ONLY upload trigger */}
        <div
          onClick={handleUploadClick}
          style={{
            position: 'absolute',
            bottom: '5px',
            right: '5px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--theme-elevation-800)',
            color: 'var(--theme-elevation-0)', // White icon
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            border: '3px solid var(--theme-elevation-0)',
            transition: 'all 0.2s',
            zIndex: 20,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.backgroundColor = 'var(--theme-elevation-900)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.backgroundColor = 'var(--theme-elevation-800)'
          }}
          title="Change Photo"
        >
          <FaCamera size={16} />
        </div>

        {/* Floating Remove Button (Top-Right) - Only visible if value exists */}
        {value && (
          <div
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              width: '32px', // Slightly smaller
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#ef4444', // Red 500
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              border: '3px solid var(--theme-elevation-0)',
              transition: 'all 0.2s',
              zIndex: 20,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.backgroundColor = '#dc2626' // Red 600
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.backgroundColor = '#ef4444'
            }}
            title="Remove Photo"
          >
            <FaTrash size={12} />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={inputRef}
        onChange={handleUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default ProfilePhotoField
