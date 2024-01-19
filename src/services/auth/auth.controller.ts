import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto, SignInDto, SignOutDto, RefreshTokenDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('create-user')
  @Public()
  async create(@Body() userData: CreateUserDto) {
    const data = await this.authService.createUser(userData);
    return data;
  }

  @Post('sign-in')
  @Public()
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    const data = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    return data;
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(@Body() signOutDto: SignOutDto, @Req() req: any) {
    await this.authService.signOut(signOutDto.refresh_token, req.user.id);
    return {};
  }

  @Post('refresh-token')
  @Public()
  async refreshToken(@Body() body: RefreshTokenDto) {
    return await this.authService.refreshToken(body.refresh_token);
  }
}
