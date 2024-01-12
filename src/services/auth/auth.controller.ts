import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto, SignInDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('create-user')
  async create(@Body() userData: CreateUserDto) {
    const data = await this.authService.createUser(userData);
    return data;
  }

  @Post('sign-in')
  @Public(true)
  async signIn(@Body() signInDto: SignInDto) {
    const data = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    return data;
  }
}
