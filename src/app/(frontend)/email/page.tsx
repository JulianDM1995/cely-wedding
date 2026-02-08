import { generateAccessLinkEmail } from '@/email/accessLink'
import { generateInvitationEmail } from '@/email/invitation'
import React from 'react'

export default function EmailPreviewPage() {
    const invitationEmail = generateInvitationEmail(
        'Julian & Tatiana',
        'test@example.com',
        'https://cely-wedding.vercel.app/invitation/test-token',
    )
    const accessLinkEmail = generateAccessLinkEmail({
        guestName: 'Invitado Especial',
        guestEmail: 'guest@example.com',
        accessLink: 'https://cely-wedding.vercel.app/guestbook/access-token',
    })

    return (
        <div className="flex flex-col gap-12 p-8 bg-gray-100 min-h-screen font-sans">
            <div className="max-w-4xl mx-auto w-full space-y-12">
                <h1 className="text-3xl font-bold text-center text-gray-800">Email Previews</h1>

                <Section title="Invitation Email">
                    <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white">
                        <iframe
                            srcDoc={invitationEmail.html}
                            className="w-full h-[800px] border-0"
                            title="Invitation Email Preview"
                        />
                    </div>
                </Section>

                <Section title="Access Link Email">
                    <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white">
                        <iframe
                            srcDoc={accessLinkEmail.html}
                            className="w-full h-[600px] border-0"
                            title="Access Link Email Preview"
                        />
                    </div>
                </Section>
            </div>
        </div>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">{title}</h2>
            {children}
        </div>
    )
}
