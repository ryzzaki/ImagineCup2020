import { SetMetadata } from '@nestjs/common';
import { UserRoleEnums } from '../enums/user-roles.enum';

export const AllowedRoles = (...userRoles: UserRoleEnums[]) => SetMetadata('allowedRoles', userRoles);
