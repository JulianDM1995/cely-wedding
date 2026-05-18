'use client'

import { useMapEvents } from 'react-leaflet'

export default function MapEventHandler({ onClick }: { onClick: (latlng: { lat: number, lng: number }) => void }) {
    useMapEvents({
        click: (e) => {
            onClick(e.latlng)
        }
    })
    return null
}
