import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UserEmailRepository } from './repositories/user-email.repository';
import { UserFacebookRepository } from './repositories/user-facebook.repository';
import { UserGoogleRepository } from './repositories/user-google.repository';
import { AuthenticateEmailDto } from './dto/authenticate-email.dto';
import { User } from './entities/user.entity';
import { AuthSourceEnums, AuthTypeEnums } from './enums/auth.enum';
import { UserRoleEnums } from './enums/user-roles.enum';
import { UrlEnums } from './enums/urls.enum';
import { RedisService } from 'nestjs-redis';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadInterface } from '../interfaces/token-payload.interface';
import { UserDataInterface } from '../interfaces/user-data.interface';
import * as uuid from 'uuid';
import appConfig from '../config/configuration.config';
import { cookieConfig } from '../config/cookie.config';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(UserEmailRepository)
    private readonly userEmailRepository: UserEmailRepository,
    @InjectRepository(UserFacebookRepository)
    private readonly userFacebookRepository: UserFacebookRepository,
    @InjectRepository(UserGoogleRepository)
    private readonly userGoogleRepository: UserGoogleRepository,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async signUpEmail(authenticateEmailDto: AuthenticateEmailDto): Promise<void> {
    const { email, password, displayName } = authenticateEmailDto;
    if (!displayName || displayName.trim().length === 0) {
      this.logger.error('Display Name cannot be empty');
      throw new BadRequestException('Display Name cannot be empty');
    }
    const user: User = await this.userRepository.signUpEmail(
      email,
      displayName,
    );
    await this.userEmailRepository.createEmailIdentity(user, password);
  }

  async signInEmail(authenticateEmailDto: AuthenticateEmailDto): Promise<User> {
    const { email, password } = authenticateEmailDto;
    try {
      const user: User = await this.userRepository.findUserByEmail(email);
      if (await this.userEmailRepository.isValidPassword(user, password)) {
        return user;
      }
    } catch (error) {
      this.logger.log('Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async signOutUser(req: any, res: any): Promise<void> {
    const existingToken = req.signedCookies.refresh_tkn_v1;
    if (!existingToken) {
      this.logger.error('Token not found in signed cookies');
      res
        .status(400)
        .send({
          statusCode: 400,
          message: 'Token not found in signed cookies',
          success: false,
        });
    }

    await this.blackListToken(existingToken);
    res
      .clearCookie('refresh_tkn_v1')
      .status(200)
      .send({ success: true });
  }

  async authenticateExternalSource(userData: UserDataInterface): Promise<User> {
    const { id, email, displayName, source } = userData;
    try {
      const user: User = await this.userRepository.externalAuthentication(
        email,
        displayName,
      );
      source === AuthSourceEnums.FACEBOOK
        ? await this.userFacebookRepository.createFacebookIdentity(user, id)
        : await this.userGoogleRepository.createGoogleIdentity(user, id);
      return user;
    } catch (error) {
      this.logger.error(
        `Unable to authenticate from external source on error: ${error}`,
      );
      throw new InternalServerErrorException(
        `Unable to authenticate from external source on error: ${error}`,
      );
    }
  }

  async sendCredentials(
    req: any,
    res: any,
    user: User,
    source?: AuthSourceEnums,
  ): Promise<void> {
    const existingToken = req.signedCookies.refresh_tkn_v1;
    if (existingToken) {
      res.clearCookie('refresh_tkn_v1');
      throw new BadRequestException(
        `Client is already logged in with an active token`,
      );
    }
    const refreshToken = await this.generateToken(
      user.id,
      AuthTypeEnums.REFRESH,
      user.tokenVer,
    );
    const accessToken = await this.generateToken(user.id, AuthTypeEnums.ACCESS);
    if (source === AuthSourceEnums.LOCAL) {
      res
        .cookie('refresh_tkn_v1', refreshToken, cookieConfig)
        .status(200)
        .send({ accessToken });
    } else {
      res
        .cookie('refresh_tkn_v1', refreshToken, cookieConfig)
        .redirect(
          `${UrlEnums.REDIRECT_URL}/auth/redirect?access_token=${accessToken}`,
        );
    }
    return;
  }

  async refreshCredentials(req: any, res: any): Promise<void> {
    const { id, ver } = await this.validateRefreshToken(
      req.signedCookies.refresh_tkn_v1,
    );
    const refreshToken = await this.generateToken(
      id,
      AuthTypeEnums.REFRESH,
      ver,
    );
    const accessToken = await this.generateToken(id, AuthTypeEnums.ACCESS);

    res
      .clearCookie('refresh_tkn_v1')
      .cookie('refresh_tkn_v1', refreshToken, cookieConfig)
      .status(200)
      .send({ accessToken });
    return;
  }

  async updateUserRole(id: number, role: UserRoleEnums): Promise<void> {
    return await this.userRepository.updateUserRole(id, role);
  }

  private async generateToken(
    id: number,
    type: AuthTypeEnums,
    ver?: number,
  ): Promise<string> {
    const payload: TokenPayloadInterface = { id, ver, type };
    const generatedToken = await this.jwtService.signAsync(payload, {
      expiresIn:
        type === AuthTypeEnums.REFRESH
          ? appConfig.serverSettings.refreshTokenAge
          : '15m',
      jwtid: uuid.v4(),
    });
    return generatedToken;
  }

  private async blackListToken(blackListedToken: any): Promise<void> {
    const client = this.redisService.getClient();
    const { jti, exp }: any = this.jwtService.decode(blackListedToken);
    const expirationTime: number = Number(exp) - Date.now() / 1000;
    return client.set(
      jti,
      blackListedToken,
      'EX',
      Math.floor(expirationTime),
      (err, result) => {
        if (err) {
          this.logger.error(err);
          throw new InternalServerErrorException(err);
        }
        return;
      },
    );
  }

  private async validateRefreshToken(
    refreshJwtToken: any,
  ): Promise<{ id: number; ver: number }> {
    try {
      const { jti, id, ver } = await this.jwtService.verifyAsync(
        refreshJwtToken,
      );
      const client = this.redisService.getClient();
      const token: string = await client.get(String(jti));
      if (token) {
        throw new Error('Token is invalid');
      }
      await this.userRepository.findUserByIdToken(id, ver);
      return { id, ver };
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException(err);
    }
  }
}
