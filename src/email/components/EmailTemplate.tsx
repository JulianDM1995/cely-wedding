import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text
} from '@react-email/components'
import * as React from 'react'

export interface EmailTemplateProps {
    previewText: string
    heading?: string
    children: React.ReactNode
    baseUrl?: string
    coupleNames?: string
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
    previewText,
    heading,
    children,
    baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://cely-wedding.vercel.app', // Fallback to production URL
    coupleNames = 'Juan & Tatiana',
}) => {
    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-[#f4f4f4] font-sans py-10">
                    <Container className="mx-auto max-w-[600px] bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                        {/* Header with Banner */}
                        <Section className="text-center bg-gray-50 border-b border-gray-100 py-6">
                            <Img
                                src={`${baseUrl}/images/branding/banner.png`}
                                width="280"
                                height="auto"
                                alt={coupleNames}
                                className="mx-auto"
                            />
                        </Section>

                        {/* Main Content */}
                        <Section className="p-8">
                            {heading && (
                                <Heading className="text-2xl font-serif text-slate-800 text-center mb-6">
                                    {heading}
                                </Heading>
                            )}

                            <div className="text-slate-600 text-base leading-relaxed">
                                {children}
                            </div>
                        </Section>

                        {/* Footer */}
                        <Section className="bg-gray-50 py-6 px-8 text-center border-t border-gray-100">
                            <Text className="text-slate-400 text-xs m-0">
                                © {new Date().getFullYear()} {coupleNames} using {process.env.NEXT_PUBLIC_APP_NAME || 'Wedding App'}.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default EmailTemplate
