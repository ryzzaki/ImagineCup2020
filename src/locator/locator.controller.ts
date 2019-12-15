import { Controller, Post, Body, ValidationPipe, Put, UseGuards } from '@nestjs/common';
import { LocationDto } from './dto/location.dto';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { LocatorService } from './locator.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AllowedRoles } from 'src/auth/decorators/allowed-roles.decorator';
import { UserRoleEnums } from 'src/auth/enums/user-roles.enum';

@Controller('/api/locator')
// @UseGuards(AuthGuard(), RolesGuard)
@UseGuards(AuthGuard())
export class LocatorController {
  constructor(private readonly locatorService: LocatorService) {}

  @Post('/create')
  // @AllowedRoles(UserRoleEnums.ADMIN, UserRoleEnums.USER)
  createUserLocation(@Body(ValidationPipe) locationDto: LocationDto, @GetUser() user: User): Promise<void> {
    return this.locatorService.createLocation(locationDto, user);
  }

  @Put('/update')
  // @AllowedRoles(UserRoleEnums.ADMIN, UserRoleEnums.USER)
  updateLocation(@Body(ValidationPipe) locationDto: LocationDto, @GetUser() user: User): Promise<void> {
    return this.locatorService.updateLocation(locationDto, user);
  }
}
