'use client'

import { useForm, useFormFields, useTranslation } from '@payloadcms/ui'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamically import CSS to avoid SSR issues
import 'leaflet/dist/leaflet.css'

// Dynamically import react-leaflet components 
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false })

// Helper component for map events that needs to be dynamically loaded too
const MapEvents = dynamic(() => import('./MapEventHandler'), { ssr: false })

export const LocationMapField: React.FC<{ path?: string; field?: Record<string, unknown> & { label?: string | Record<string, string> } }> = ({ path, field }) => {
    const { dispatchFields } = useForm()
    const { t, i18n } = useTranslation()

    const latPath = path ? `${path}.latitude` : 'latitude'
    const lngPath = path ? `${path}.longitude` : 'longitude'

    const latField = useFormFields(([fields]) => fields[latPath])
    const lngField = useFormFields(([fields]) => fields[lngPath])

    const lat = latField?.value as number | undefined
    const lng = lngField?.value as number | undefined

    const [isMounted, setIsMounted] = useState(false)
    const [customIcon, setCustomIcon] = useState<import('leaflet').Icon | null>(null)

    useEffect(() => {
        setIsMounted(true)
        
        // Load leaflet and create icon only on the client side
        import('leaflet').then((L) => {
            const icon = new L.Icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
            })
            setCustomIcon(icon)
        })
    }, [])

    const handleMapClick = (latlng: { lat: number, lng: number }) => {
        dispatchFields({
            type: 'UPDATE',
            path: latPath,
            value: latlng.lat
        })
        dispatchFields({
            type: 'UPDATE',
            path: lngPath,
            value: latlng.lng
        })
    }

    if (!isMounted || !customIcon) return <div className="h-[300px] w-full bg-neutral-800 animate-pulse rounded mb-6"></div>

    const defaultCenter = [4.6097, -74.0817] // Bogota

    const translatedLabel = field?.label && typeof field.label === 'object' 
        ? (field.label[i18n.language] || field.label['en'] || field.label['es']) 
        : field?.label;

    return (
        <div className="field-type w-full mb-6 relative z-0">
            <label className="field-label px-0 mb-2 block">{translatedLabel as React.ReactNode || 'Location Map (Click to set pin)'}</label>
            <div className="h-[300px] w-full rounded border border-neutral-700 overflow-hidden relative z-0">
                <MapContainer
                    center={lat && lng ? [lat, lng] : (defaultCenter as [number, number])}
                    zoom={lat && lng ? 15 : 5}
                    style={{ height: '300px', width: '100%', zIndex: 0 }}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    {lat && lng && (
                        <Marker position={[lat, lng]} icon={customIcon} />
                    )}
                    <MapEvents onClick={handleMapClick} />
                </MapContainer>
            </div>
            {(lat && lng) ? (
                <p className="text-xs text-neutral-400 mt-2 font-mono">Selected: {lat.toFixed(6)}, {lng.toFixed(6)}</p>
            ) : (
                <p className="text-xs text-neutral-400 mt-2">Click on the map to set delivery coordinates manually.</p>
            )}
        </div>
    )
}
