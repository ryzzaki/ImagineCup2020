import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LocatorModule } from './locator/locator.module';
import { NotificatorModule } from './notificator/notificator.module';
import { EmailerModule } from './emailer/emailer.module';
import { TemplatorModule } from './templator/templator.module';
import { MailerService } from './mailer/mailer.service';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [AuthModule, LocatorModule, NotificatorModule, EmailerModule, TemplatorModule, MailerModule],
  controllers: [AppController],
  providers: [AppService, MailerService],
})
export class AppModule {}
