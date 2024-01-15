import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from '../auth/decorators/public.decorator';
// import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  @Public()
  getUserDetails(@Param() params: { id: string }) {
    return this.userService.findById(params.id);
  }

  @Get('list')
  getUsers() {
    return this.userService.findAll();
  }
}
