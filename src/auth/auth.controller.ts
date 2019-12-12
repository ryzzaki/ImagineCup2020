import { Controller, Post, Body, ValidationPipe, Get, UseGuards, Req, Res, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticateEmailDto } from './dto/authenticate-email.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { AuthSourceEnums } from './enums/auth.enum';

@Controller('/api/v1/auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  signUpEmail(@Body(ValidationPipe) authenticateEmailDto: AuthenticateEmailDto): Promise<void> {
    this.logger.verbose('POST on /signup called');
    return this.authService.signUpEmail(authenticateEmailDto);
  }

  @Post('/signin')
  signInEmail(@Req() req, @Res() res, @Body(ValidationPipe) authenticateEmailDto: AuthenticateEmailDto): Promise<void> {
    this.logger.verbose('POST on /signin called');
    return this.authService.signInEmail(authenticateEmailDto).then(user => {
      this.authService.sendCredentials(req, res, user, AuthSourceEnums.LOCAL);
    });
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  authenticateFacebook(): Promise<void> {
    // start the authentication flow
    return;
  }

  @Get('/facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookCallBack(@Req() req, @Res() res, @GetUser() user: User): Promise<void> {
    this.logger.verbose('GET on /facebook/callback called');
    return this.authService.sendCredentials(req, res, user);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  authenticateGoogle(): Promise<void> {
    // start the authentication flow
    return;
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallBack(@Req() req, @Res() res, @GetUser() user: User): Promise<void> {
    this.logger.verbose('GET on /google/callback called');
    return this.authService.sendCredentials(req, res, user);
  }

  @Get('/signout')
  signOutUser(@Req() req, @Res() res): Promise<void> {
    this.logger.verbose('GET on /signout called');
    return this.authService.signOutUser(req, res);
  }

  @Get('/user/refresh')
  getRefreshedUser(@Req() req, @Res() res): Promise<void> {
    this.logger.verbose('GET on /user/refresh called');
    return this.authService.refreshCredentials(req, res);
  }
}
