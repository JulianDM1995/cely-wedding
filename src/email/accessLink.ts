import { APP_NAME } from '@/constants'

export const generateAccessLinkEmail = ({
  guestName,
  guestEmail,
  accessLink,
}: {
  guestName: string
  guestEmail: string
  accessLink: string
}) => {
  return {
    to: guestEmail,
    subject: `Leave a message for ${APP_NAME}`,
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Leave a message for ${APP_NAME}</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #000; margin-bottom: 10px;">Hello, ${guestName}</h1>
        <p style="font-size: 16px; color: #666;">
            We're so glad you're here! Click the button below to leave a message in our guestbook.
        </p>
    </div>

    <div style="text-align: center; margin: 40px 0;">
        <a href="${accessLink}" 
           style="background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            Access Guestbook
        </a>
    </div>

    <div style="text-align: center; font-size: 12px; color: #999; margin-top: 40px;">
        <p>If the button doesn't work, copy and paste this link:</p>
        <p><a href="${accessLink}" style="color: #666;">${accessLink}</a></p>
    </div>
</body>
</html>
`
  }
}
