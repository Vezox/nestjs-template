import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto';
import { Public } from '../auth/decorators/public.decorator';
import { GetListDto } from '../../common/dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionsService) {}

  @Post('create')
  @Public()
  async create(@Body() permissionData: CreatePermissionDto) {
    const is_exist = await this.permissionService.isExistByKey(
      permissionData.key,
    );
    if (is_exist) {
      throw new HttpException(
        'Permission name already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.permissionService.create(permissionData);
  }

  @Delete('delete/:id')
  @Public()
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    const is_exist = await this.permissionService.isExistById(id);
    if (!is_exist) {
      throw new HttpException('Permission not found', HttpStatus.BAD_REQUEST);
    }
    return await this.permissionService.softDelete(id);
  }

  @Get('all')
  @Public()
  @HttpCode(HttpStatus.OK)
  async all(@Query() getListDto: GetListDto) {
    return await this.permissionService.getList(getListDto);
  }
}
