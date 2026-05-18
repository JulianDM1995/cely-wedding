export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export interface EmailAdapter {
  sendEmail(options: SendEmailOptions): Promise<void>;
}
