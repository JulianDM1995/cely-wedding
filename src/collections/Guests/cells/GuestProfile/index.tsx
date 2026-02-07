'use client'

import { useConfig } from '@payloadcms/ui'
import Link from 'next/link'
import React from 'react'

export const GuestProfileCell: React.FC<any> = (props) => {
  const { rowData, cellData } = props
  const { config } = useConfig()

  const profilePicture = rowData.profilePicture
  const name = cellData // Assuming this is attached to the 'name' field
  const token = rowData.token
  
  // Construct URL
  // If token is available, use it. Otherwise fall back to ID or handle error.
  // Since token is hidden in admin, it might not be in rowData.
  // We'll check this assumption. If missing, we might need a server action or config change.
  // For now, let's assume we can get it or we'll simply link to the ID and handle redirect? 
  // No, the user wants the invitation link (/[token]).
  
  const href = token ? `${process.env.NEXT_PUBLIC_APP_URL}/${token}` : '#'

  // Handle profile picture
  // In list view, simple relationships are often IDs. 
  // But for uploads, Payload constructs the object if it can?
  // If it's just an ID, we can't show the image easily without fetching.
  // Let's assume for now we try to get the URL.
  
  let imageUrl: string | null = null
  
  if (profilePicture && typeof profilePicture === 'object' && 'url' in profilePicture) {
      imageUrl = profilePicture.url
  }

  return (
    <div className="flex items-center gap-3">
        {/* Avatar */}
        <div 
            style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#eee',
                flexShrink: 0,
                border: '1px solid #ddd'
            }}
        >
            {imageUrl ? (
                <img 
                    src={imageUrl} 
                    alt={name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '10px' }}>
                    N/A
                </div>
            )}
        </div>
        
        {/* Name Link */}
        <Link 
            href={href} 
            target="_blank"
            onClick={(e) => e.stopPropagation()} // Prevent row click
            className="hover:underline font-medium text-theme-primary"
            style={{ textDecoration: 'none', color: 'inherit' }}
        >
            {name}
        </Link>
    </div>
  )
}
