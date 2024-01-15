import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdatePermissionDto } from './dto';
import { Public } from '../auth/decorators/public.decorator';
import { GetListDto } from '../../common/dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('create')
  @Public()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const data = await this.rolesService.create(createRoleDto);
    return data;
  }

  @Get('all')
  @Public()
  async all(@Query() getListDto: GetListDto) {
    const data = await this.rolesService.getList(getListDto);
    return data;
  }

  @Patch('update-permissions')
  @Public()
  async updatePermission(@Body() updateRoleDto: UpdatePermissionDto) {
    const data = await this.rolesService.updatePermissions(
      updateRoleDto.role_id,
      updateRoleDto.permission_ids,
    );
    return data;
  }

  @Get(':id')
  @Public()
  async findById(@Param() params: { id: string }) {
    const data = await this.rolesService.findById(params.id);
    return data;
  }
}
