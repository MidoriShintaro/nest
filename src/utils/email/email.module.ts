import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: 'sandbox.smtp.mailtrap.io',
          port: 2525,
          secure: false, // Adjust based on your email service
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
