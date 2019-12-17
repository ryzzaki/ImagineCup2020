import { Module } from '@nestjs/common';
import { LocatorService } from './locator.service';
import { LocatorController } from './locator.controller';
import { LocationRepository } from './repositories/location.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([LocationRepository]), AuthModule],
  providers: [LocatorService],
  controllers: [LocatorController],
  exports: [LocatorService],
})
export class LocatorModule {}
