import { Module } from '@nestjs/common';
import { NotificatorService } from './notificator.service';
import { NotificatorController } from './notificator.controller';
import { LocatorModule } from '../locator/locator.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [LocatorModule, AuthModule],
  providers: [NotificatorService],
  controllers: [NotificatorController],
})
export class NotificatorModule {}
