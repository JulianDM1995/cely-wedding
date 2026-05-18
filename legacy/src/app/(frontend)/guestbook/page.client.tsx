'use client'

import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getGuestbookToken, getGuestMessages, getNewGuestMessageGlobal } from './actions';
import { FeaturedMessage } from './components/FeaturedMessage';
import { MessageList } from './components/MessageList';
import { TypingIndicator } from './components/TypingIndicator';
import { ExtendedGuestMessage } from './types';

const fetcher = async () => {
    const [messages, global] = await Promise.all([
        getGuestMessages(),
        getNewGuestMessageGlobal()
    ])
    return { messages, global }
}

export const GuestbookClient = () => {
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

    // Poll Token every 5 minutes
    const { data: tokenData, error: tokenError } = useSWR('guestbook-token', getGuestbookToken, {
        refreshInterval: 5 * 60 * 1000,
        revalidateOnFocus: false,
    })

    // Poll Messages & Global every 1 second
    const { data: guestbookData } = useSWR('guestbook-data', fetcher, {
        refreshInterval: 1000,
        revalidateOnFocus: false,
    })

    const token = tokenData?.token
    const messages = (guestbookData?.messages || []) as ExtendedGuestMessage[]
    const global = guestbookData?.global

    const [highlightedState, setHighlightedState] = useState<any>(null)

    useEffect(() => {
        if (global) {
            const lastTimeRead = global.lastTimeRead ? new Date(global.lastTimeRead) : null
            const now = new Date()
            const fiveMinutes = 5 * 60 * 1000

            if (lastTimeRead && (now.getTime() - lastTimeRead.getTime() < fiveMinutes)) {
                if (global.lastMessage) {
                    setHighlightedState({ type: 'message', data: global.lastMessage })
                } else if (global.owner) {
                    setHighlightedState({ type: 'typing', owner: global.owner })
                } else {
                    setHighlightedState({ type: 'typing_unknown' })
                }
            } else {
                setHighlightedState(null)
            }
        }
    }, [global])

    useEffect(() => {
        if (token) {
            const url = `${process.env.NEXT_PUBLIC_APP_URL}/select-guest?token=${token}`
            QRCode.toDataURL(url, { width: 300, margin: 2 })
                .then(setQrDataUrl)
                .catch(console.error)
        }
    }, [token])

    if (tokenError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
                <p>Failed to retrieve access token.</p>
            </div>
        )
    }

    if (!token || !qrDataUrl) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p>Loading Guestbook...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-row min-h-screen bg-black text-white overflow-hidden">
            {/* Left Column: QR Code */}
            <div className="w-1/3 flex flex-col items-center justify-center p-8 border-r border-gray-800">
                <h1 className="text-4xl font-serif mb-8 text-center text-white">Guestbook</h1>
                <p className="text-xl mb-8 text-center text-gray-400">Scan to leave a message</p>

                {qrDataUrl ? (
                    <div className="bg-white p-4 rounded-xl shadow-2xl mb-8">
                        <img src={qrDataUrl} alt="Guestbook QR Code" className="w-[300px] h-[300px]" />
                    </div>
                ) : (
                    <div className="w-[300px] h-[300px] bg-gray-900 rounded-xl animate-pulse" />
                )}

                <p className="text-sm text-gray-500 text-center">
                    QR Code refreshes automatically.
                </p>
            </div>

            {/* Right Column: Feed */}
            <div className="w-2/3 p-8 overflow-y-auto h-screen relative">

                {/* Highlighted Section */}
                {highlightedState && (
                    <div className="mb-8">
                        {highlightedState.type === 'message' && (
                            <FeaturedMessage message={highlightedState.data} />
                        )}
                        {highlightedState.type === 'typing' && (
                            <TypingIndicator owner={highlightedState.owner} />
                        )}
                        {highlightedState.type === 'typing_unknown' && (
                            <TypingIndicator />
                        )}
                    </div>
                )}

                <h2 className="text-2xl font-serif mb-6 text-gray-400">Latest Messages</h2>
                <MessageList messages={messages} />
            </div>
        </div>
    )
}
