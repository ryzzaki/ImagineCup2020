import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleEnums } from '../enums/user-roles.enum';
import { User } from '../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<UserRoleEnums[]>('allowedRoles', context.getHandler());
    if (!allowedRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;
    const permission: boolean = allowedRoles.includes(user.role);
    return permission;
  }
}
