import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import appConfig from '../config/configuration.config';

@Injectable()
export class MailerService {
  private logger = new Logger('MailerService');

  private async setUp(user: string): Promise<any> {
    return nodemailer.createTransport({
      // setup SendGrid here
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user, // generated ethereal user
        pass: appConfig.mailerSettings.password, // generated ethereal password
      },
    });
  }

  async sendEmail(sender: string, recipients: string[], emailSubject: string, htmlTemplate: string): Promise<void> {
    const transporter = await this.setUp(sender);
    await transporter.sendMail(
      {
        // from: 'Leafy Support <support@leafy.cz>',
        from: sender,
        to: recipients,
        subject: emailSubject,
        html: htmlTemplate,
      },
      (error, info) => {
        if (error) {
          this.logger.error(error.message);
        }
        this.logger.verbose(info);
      },
    );
    return;
  }
}
