import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Permission } from '../auth/decorators/permission.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  @Permission('user.read')
  @HttpCode(HttpStatus.OK)
  getUserDetails(@Param() params: { id: string }) {
    const data = this.userService.findById(params.id);
    return data;
  }

  @Get('list')
  @Permission('user.read')
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    const data = await this.userService.findAll();
    return data;
  }
}
