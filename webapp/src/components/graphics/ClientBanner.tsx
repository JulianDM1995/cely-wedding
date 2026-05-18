'use client'

import { APP_NAME } from '@/constants'
import React from 'react'

const ClientBanner: React.FC = () => {

    return (
        <img
            src="/images/branding/banner.png"
            alt={`${APP_NAME} Banner`}
            style={{ maxWidth: '100%', height: 'auto', }}
        />
    )
}

export default ClientBanner
