// Define the type for the email object if needed, or just return inferred type
export const generateInvitationEmail = (guestName: string, guestEmail: string, invitationLink: string) => {
  return {
    to: guestEmail,
    subject: '¡Estás invitado a nuestra boda!',
    html: `
    <div style="font-family: sans-serif; text-align: center; padding: 20px;">
      <h1>¡Hola ${guestName}!</h1>
      <p>Nos hace muy felices invitarte a nuestra boda.</p>
      <p>Hemos preparado una invitación especial para ti.</p>
      <br/>
      <a href="${invitationLink}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Ver Invitación
      </a>
      <br/><br/>
      <p>Si el botón no funciona, copia y pega este enlace:</p>
      <p>${invitationLink}</p>
    </div>
  `
  }
}
