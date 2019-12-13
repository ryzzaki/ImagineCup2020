import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { renderFile } from 'ejs';
import { resolve } from 'path';

@Injectable()
export class TemplatorService {
  private logger = new Logger('TemplaterService');

  async generateVerificationEmail(sender: string, name: string, verificationLink: string): Promise<string> {
    try {
      return await renderFile(
        resolve('./src/templator/html-templates/emailVerification.ejs'),
        { sender, name, verificationLink },
        null,
      );
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  async generatePasswordReset(sender: string, name: string, resetLink: string): Promise<string> {
    try {
      return await renderFile(
        resolve('./src/templator/html-templates/resetPassword.ejs'),
        { sender, name, resetLink },
        null,
      );
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
