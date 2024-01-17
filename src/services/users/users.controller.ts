import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Permission } from '../auth/decorators/permission.decorator';
import { GetListDto } from '../../common/dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  @Permission('user.read')
  @HttpCode(HttpStatus.OK)
  async getUserDetails(@Param() params: { id: string }) {
    return await this.userService.findById(params.id);
  }

  @Get('list')
  @Permission('user.read')
  @HttpCode(HttpStatus.OK)
  async getUsers(@Query() getListDto: GetListDto) {
    return await this.userService.getList(getListDto);
  }
}
