import { EmailAdapter, SendEmailOptions } from './types'
import { ConsoleEmailAdapter } from './adapters/ConsoleEmailAdapter'

export class EmailService {
  private adapter: EmailAdapter

  constructor() {
    // TODO: implement ResendEmailAdapter
    // const useResend = process.env.EMAIL_ADAPTER === 'resend'
    this.adapter = new ConsoleEmailAdapter()
  }

  async send(options: SendEmailOptions): Promise<void> {
    return this.adapter.sendEmail({
      ...options,
      from: options.from || process.env.EMAIL_FROM || 'invitaciones@boda.com',
    })
  }
}

export const emailService = new EmailService()
