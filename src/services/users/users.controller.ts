import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from './enum/role.enum';
// import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  @Roles(Role.User, Role.Admin)
  getUserDetails(@Req() request: Request) {
    return this.userService.findById(request.params.id);
  }
}
