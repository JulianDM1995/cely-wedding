'use client'

import type { Guest } from '@/payload-types'
import { useState } from 'react'
import { FaSearch, FaUser } from 'react-icons/fa'
import { sendGuestAccessEmail } from './actions'

export const SelectGuestClient = ({ guests }: { guests: Guest[] }) => {
    const [query, setQuery] = useState('')
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
    const [sending, setSending] = useState(false)
    const [success, setSuccess] = useState(false)

    const filteredGuests = guests.filter(guest =>
        guest.name.toLowerCase().includes(query.toLowerCase()) ||
        (guest.email && guest.email.toLowerCase().includes(query.toLowerCase()))
    )

    const handleSend = async () => {
        if (!selectedGuest) return
        setSending(true)
        const res = await sendGuestAccessEmail(selectedGuest.id)
        setSending(false)
        if (res.success) {
            setSuccess(true)
        } else {
            alert(res.error || 'Error sending email')
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50">
                <h1 className="text-2xl font-bold mb-4">Check your email!</h1>
                <p className="mb-4">We sent a link to <b>{selectedGuest?.email}</b>.</p>
                <p className="text-gray-500">Please open that link to verify it's you and leave your message.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-4">
            <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-6 my-8">
                <h1 className="text-2xl font-serif text-center mb-6">Find your name</h1>

                {/* Search */}
                <div className="relative mb-6">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* List */}
                <div className="max-h-[60vh] overflow-y-auto space-y-2 mb-6">
                    {filteredGuests.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No guests found</p>
                    )}
                    {filteredGuests.map(guest => (
                        <div
                            key={guest.id}
                            onClick={() => setSelectedGuest(guest)}
                            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${selectedGuest?.id === guest.id ? 'bg-black text-white' : 'hover:bg-gray-100'
                                }`}
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                {guest.profilePicture && typeof guest.profilePicture === 'object' && 'url' in guest.profilePicture ? (
                                    <img src={guest.profilePicture.url as string} alt={guest.name} className="w-full h-full object-cover" />
                                ) : (
                                    <FaUser className="text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{guest.name}</p>
                                <p className={`text-xs truncate ${selectedGuest?.id === guest.id ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {guest.email}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action */}
                <button
                    onClick={handleSend}
                    disabled={!selectedGuest || sending}
                    className={`w-full py-3 rounded-lg font-bold transition-all ${!selectedGuest
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : sending
                                ? 'bg-gray-800 text-white cursor-wait'
                                : 'bg-black text-white hover:bg-gray-900'
                        }`}
                >
                    {sending ? 'Sending...' : selectedGuest ? `Send Access Link to ${selectedGuest.email}` : 'Select your name'}
                </button>
            </div>
        </div>
    )
}
