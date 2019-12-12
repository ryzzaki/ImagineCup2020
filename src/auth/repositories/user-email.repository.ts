import { Repository, EntityRepository } from 'typeorm';
import { UserEmailIdentity } from '../entities/user-email-identity.entity';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { NotFoundException, Logger, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

@EntityRepository(UserEmailIdentity)
export class UserEmailRepository extends Repository<UserEmailIdentity> {
  private logger = new Logger('UserEmailRepository');

  async createEmailIdentity(user: User, password: string): Promise<void> {
    const emailIdentity = new UserEmailIdentity();
    emailIdentity.user = user;
    emailIdentity.password = await this.hashPassword(password);
    try {
      await this.save(emailIdentity);
    } catch (error) {
      this.logger.error(`Email Identity creation FAILED on error: ${error}`);
      throw new InternalServerErrorException(`Email Identity creation FAILED on error: ${error}`);
    }
    this.logger.verbose(`Email Identity CREATED for User ID: ${user.id}`);
    return;
  }

  async isValidPassword(user: User, inputPassword: string): Promise<boolean> {
    const identity = await this.findOne({ where: [{ user }] });
    if (identity == null) {
      this.logger.error(`Email Identity NOT FOUND for User ID: ${user.id}`);
      throw new NotFoundException(`Email Identity NOT FOUND for User ID: ${user.id}`);
    }
    if (!await bcrypt.compare(inputPassword, identity.password)) {
      this.logger.log('BCrypt comparison is false');
      throw new UnauthorizedException('BCrypt comparison is false');
    }
    return true;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
