import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    destinationEmail: string,
    subject: string,
    message: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: destinationEmail,
        subject: subject,
        template: 'email',
        // text: message,
      });
      // console.log('Email sent successfully to:', destinationEmail);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
