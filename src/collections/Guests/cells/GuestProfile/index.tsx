'use client'

import { useConfig } from '@payloadcms/ui'
import Link from 'next/link'
import React from 'react'
import { FaUser } from 'react-icons/fa'
import './index.scss'

export const GuestProfileCell: React.FC<any> = (props) => {
    const { rowData, cellData } = props
    const { config } = useConfig()

    const profilePicture = rowData.profilePicture
    const name = cellData // Assuming this is attached to the 'name' field
    const token = rowData.token

    // Construct URL to admin detail view
    const href = `/admin/collections/guests/${rowData.id}`

    const [imageUrl, setImageUrl] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (profilePicture && typeof profilePicture === 'object' && 'url' in profilePicture) {
            setImageUrl(profilePicture.url)
        } else if (typeof profilePicture === 'string') {
            // Fetch media if it's an ID
            const fetchMedia = async () => {
                try {
                    const res = await fetch(`/api/media/${profilePicture}`)
                    if (res.ok) {
                        const data = await res.json()
                        setImageUrl(data.url)
                    }
                } catch (err) {
                    console.error('Error fetching guest profile picture:', err)
                }
            }
            fetchMedia()
        }
    }, [profilePicture])

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', height: '100%' }}>
            {/* Avatar */}
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--theme-elevation-100)', // themed background
                    borderColor: 'var(--theme-elevation-200)', // themed border
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    overflow: 'hidden',
                    flexShrink: 0,
                    width: '28px', // reduced size
                    height: '28px', // reduced size
                    borderRadius: '50%',
                }}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={typeof name === 'string' ? name : 'Guest'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <FaUser style={{ color: '#aaa', fontSize: '14px' }} />
                )}
            </div>

            {/* Name Link */}
            <Link
                href={href}
                onClick={(e) => e.stopPropagation()} // Prevent row click
                className="guest-profile-link"
            >
                {name}
            </Link>
        </div>
    )
}
