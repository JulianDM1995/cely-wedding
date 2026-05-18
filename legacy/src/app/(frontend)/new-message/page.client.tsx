'use client'

import type { Guest } from '@/payload-types'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaImage, FaPaperPlane } from 'react-icons/fa'
import { submitGuestMessage } from './actions'

export const NewMessageClient = ({ guest, token }: { guest: Guest, token: string }) => {
    const [message, setMessage] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            setPreview(URL.createObjectURL(selectedFile))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return

        setSubmitting(true)
        const formData = new FormData()
        formData.append('message', message)
        if (file) {
            formData.append('media', file)
        }

        const res = await submitGuestMessage(formData, token)
        setSubmitting(false)

        if (res.success) {
            setSuccess(true)
        } else {
            alert(res.error || 'Failed to submit message')
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50">
                <h1 className="text-3xl font-serif mb-4">Thank you, {guest.name}!</h1>
                <p className="text-lg text-gray-600 mb-8">Your message has been received.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-blue-600 underline"
                >
                    Send another message
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-serif">Leave a Note</h1>
                    <p className="text-gray-500 mt-2">Writing as <b>{guest.name}</b></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Message Input */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Message
                        </label>
                        <textarea
                            id="message"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                            placeholder="Share a memory or wish..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add a Photo (optional)
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FaImage className="w-8 h-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">Click to upload</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                        {file && (
                            <button
                                type="button"
                                onClick={() => { setFile(null); setPreview(null); }}
                                className="text-xs text-red-500 mt-2 hover:underline"
                            >
                                Remove photo
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${submitting ? 'bg-gray-400 cursor-wait' : 'bg-black hover:bg-gray-800'
                            }`}
                    >
                        {submitting ? 'Sending...' : <><FaPaperPlane /> Send Message</>}
                    </button>
                </form>
            </div>
        </div>
    )
}
