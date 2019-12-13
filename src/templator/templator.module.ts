import { Module } from '@nestjs/common';
import { TemplatorService } from './templator.service';

@Module({
  providers: [TemplatorService],
  exports: [TemplatorService],
})
export class TemplatorModule {}
