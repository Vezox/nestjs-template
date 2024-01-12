import { Body, Controller, Post } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionsService) {}

  @Post('create')
  @Public()
  async create(@Body() permissionData: CreatePermissionDto) {
    const is_exist = await this.permissionService.isExist(permissionData.name);
    if (is_exist) {
      throw new Error('Permission name already exist');
    }
    const data = await this.permissionService.create(permissionData);
    return data;
  }
}
