import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LocatorModule } from './locator/locator.module';
import { NotificatorModule } from './notificator/notificator.module';
import { TemplatorModule } from './templator/templator.module';
import { MailerModule } from './mailer/mailer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { RedisModule } from 'nestjs-redis';
import { redisModuleConfig } from './config/redis.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    RedisModule.register(redisModuleConfig),
    AuthModule,
    LocatorModule,
    NotificatorModule,
    TemplatorModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
