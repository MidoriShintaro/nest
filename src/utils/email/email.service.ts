import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, context: any) {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: context,
    });
  }
}
