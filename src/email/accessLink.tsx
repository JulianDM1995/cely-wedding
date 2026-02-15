import { Button, Link, Text } from '@react-email/components'
import { render } from '@react-email/render'
import { EmailTemplate } from './components/EmailTemplate'

export const generateAccessLinkEmail = async ({
  guestName,
  guestEmail,
  accessLink,
  coupleNames,
}: {
  guestName: string
  guestEmail: string
  accessLink: string
  coupleNames: string
}) => {
  const emailHtml = await render(
    <EmailTemplate
      previewText={`Leave a message for ${coupleNames}`}
      heading={`Hello, ${guestName}`}
      coupleNames={coupleNames}
    >
      <Text className="text-slate-600 text-base leading-relaxed mb-6 text-center">
        We're so glad you're here! Click the button below to leave a message in our guestbook.
      </Text>

      <div className="text-center mb-8">
        <Button
          href={accessLink}
          className="bg-black text-white font-bold py-3 px-6 rounded-md no-underline inline-block"
        >
          Access Guestbook
        </Button>
      </div>

      <Text className="text-slate-400 text-xs text-center mt-8 border-t pt-4 border-gray-100">
        If the button doesn't work, copy and paste this link:
        <br />
        <Link href={accessLink} className="text-slate-500 underline break-all">
          {accessLink}
        </Link>
      </Text>
    </EmailTemplate>
  )

  return {
    to: guestEmail,
    from: `${coupleNames} <${process.env.RESEND_FROM_EMAIL}>`,
    subject: `Leave a message for ${coupleNames}`,
    html: emailHtml
  }
}
