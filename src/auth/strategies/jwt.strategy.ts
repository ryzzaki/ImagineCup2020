import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { TokenPayloadInterface } from '../../interfaces/token-payload.interface';
import { UserRepository } from '../repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import appConfig from '../../config/configuration.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(appConfig.jwtSettings.accessPublicKey, 'base64'),
      algorithm: ['RS256'],
    });
  }

  async validate(jwt: TokenPayloadInterface, done: (err: any, result: any) => void) {
    try {
      const user: User = await this.userRepository.findUserById(jwt.id);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
