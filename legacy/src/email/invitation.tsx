import { Button, Link, Text } from '@react-email/components'
import { render } from '@react-email/render'
import { EmailTemplate } from './components/EmailTemplate'

export const generateInvitationEmail = async (guestName: string, guestEmail: string, invitationLink: string, coupleNames: string) => {
  const emailHtml = await render(
    <EmailTemplate
      previewText={`¡Hola ${guestName}! Estás invitado a nuestra boda.`}
      heading={`¡Hola ${guestName}!`}
      coupleNames={coupleNames}
    >
      <Text className="text-slate-600 text-base leading-relaxed mb-6 text-center">
        Nos hace muy felices invitarte a nuestra boda.
      </Text>
      <Text className="text-slate-600 text-base leading-relaxed mb-8 text-center">
        Hemos preparado una invitación especial para ti.
      </Text>

      <div className="text-center mb-8">
        <Button
          href={invitationLink}
          className="bg-black text-white font-bold py-3 px-6 rounded-md no-underline inline-block"
        >
          Ver Invitación
        </Button>
      </div>

      <Text className="text-slate-400 text-xs text-center mt-8 border-t pt-4 border-gray-100">
        Si el botón no funciona, copia y pega este enlace:
        <br />
        <Link href={invitationLink} className="text-slate-500 underline break-all">
          {invitationLink}
        </Link>
      </Text>
    </EmailTemplate>
  )

  return {
    to: guestEmail,
    from: `${coupleNames} <${process.env.RESEND_FROM_EMAIL}>`,
    subject: '¡Estás invitado a nuestra boda!',
    html: emailHtml
  }
}
