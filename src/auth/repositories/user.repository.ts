import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { BadRequestException, Logger, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserRoleEnums } from '../enums/user-roles.enum';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private existingUser: User;
  private logger = new Logger('UserRepository');

  async signUpEmail(email: string, displayName: string): Promise<User> {
    if (await this.isAnExistingUser(email)) {
      this.logger.error('User already exists');
      throw new BadRequestException('User already exists');
    }
    return await this.createUser(email, displayName, UserRoleEnums.USER);
  }

  async externalAuthentication(email: string, displayName: string): Promise<User> {
    if (await this.isAnExistingUser(email)) {
      return this.existingUser;
    }
    return await this.createUser(email, displayName, UserRoleEnums.USER);
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return await this.findOneOrFail({ where: { email } });
    } catch (error) {
      this.logger.log(`Failed to find user given email: ${email}`);
      throw new UnauthorizedException('Failed to find user');
    }
  }

  async findUserByIdToken(id: number, tokenVer: number): Promise<User> {
    try {
      return await this.findOneOrFail({ where: { id, tokenVer } });
    } catch (error) {
      this.logger.log(`Failed to find user given id: ${id} and token ver: ${tokenVer}`);
      throw new UnauthorizedException('Failed to find user');
    }
  }

  async findUserById(id: number): Promise<User> {
    try {
      return await this.findOneOrFail({ where: { id } });
    } catch (error) {
      this.logger.log(`Failed to find user given id: ${id}`);
      throw new UnauthorizedException('Failed to find user');
    }
  }

  async updateUserRole(id: number, updatedRole: UserRoleEnums) {
    try {
      await this.update(id, { role: updatedRole });
    } catch (error) {
      this.logger.error(`Failed to update user role for: ${id} on error: ${error}`);
      throw new InternalServerErrorException('Failed to update user role');
    }
  }

  private async createUser(email: string, displayName: string, role: UserRoleEnums): Promise<User> {
    const user = new User();
    user.email = email;
    user.displayName = displayName;
    user.role = role;
    user.profilePicture = 'https://i.imgur.com/rI9bwCOt.jpg';
    user.tokenVer = 1;
    try {
      await this.save(user);
    } catch (error) {
      this.logger.error(`User Entity creation FAILED on error: ${error}`);
      throw new InternalServerErrorException(`User Entity creation FAILED on error: ${error}`);
    }
    return user;
  }

  private async isAnExistingUser(email: string): Promise<boolean> {
    const user = await this.findOne({ where: { email } });
    if (user == null) {
      return false;
    }
    this.existingUser = user;
    return true;
  }
}
