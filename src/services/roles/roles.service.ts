import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto';
import { PermissionsService } from '../permissions/permissions.service'; // Import the PermissionService class
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly permissionsService: PermissionsService, // Inject the PermissionService class
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const permissions = await this.permissionsService.findByIds(
      createRoleDto.permission_ids,
    );
    const role = new Role();
    role.name = createRoleDto.name;
    role.permissions = permissions;
    return this.roleRepository.save(role);
  }
}
