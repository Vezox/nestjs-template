import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto } from '../users/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: Record<string, string>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('sign-up')
  @Public()
  create(@Body() userData: CreateUserDto) {
    console.log('userData', userData);
    return this.authService.createUser(userData);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
