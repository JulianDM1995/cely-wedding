import { EmailAdapter, SendEmailOptions } from '../types'

export class ConsoleEmailAdapter implements EmailAdapter {
  async sendEmail(options: SendEmailOptions): Promise<void> {
    console.log('\n================== EMAIL MOCK ==================')
    console.log(`From:    ${options.from || 'Default Sender'}`)
    console.log(`To:      ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`)
    console.log(`Subject: ${options.subject}`)
    console.log('------------------ CONTENT ---------------------')
    console.log(options.html)
    console.log('================================================\n')
  }
}
