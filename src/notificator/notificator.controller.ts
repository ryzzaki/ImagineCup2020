import { Controller, Post, Body, ValidationPipe, UseGuards } from '@nestjs/common';
import { NotificatorService } from './notificator.service';
import { OriginDto } from './dto/origin.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AllowedRoles } from '../auth/decorators/allowed-roles.decorator';
import { UserRoleEnums } from '../auth/enums/user-roles.enum';

@Controller('/api/notificator')
@UseGuards(AuthGuard(), RolesGuard)
export class NotificatorController {
  constructor(private readonly notificatorService: NotificatorService) {}

  @Post('/requireAssistance')
  @AllowedRoles(UserRoleEnums.ADMIN, UserRoleEnums.DISPATCHER)
  requireAssistance(@Body(ValidationPipe) originDto: OriginDto): Promise<void> {
    this.notificatorService.requireAssistance(originDto);
    return;
  }
}
