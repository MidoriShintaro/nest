import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: { user: 'a3bcdcfec65900', pass: 'eca599876f7825' },
      },
    }),
  ],
  providers: [EmailService],
})
export class EmailModule {}
