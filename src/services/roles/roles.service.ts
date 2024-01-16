import { Between, Like, Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto';
import { PermissionsService } from '../permissions/permissions.service'; // Import the PermissionService class
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { GetListDto } from 'src/common/dto/get-list.dto';

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

  async getList(getListDto: GetListDto) {
    const conditions = { name: Like(`%${getListDto.search}%`) };
    if (getListDto.start_time && getListDto.end_time) {
      conditions['created_at'] = Between(
        new Date(getListDto.start_time),
        new Date(getListDto.end_time),
      );
    }
    const [rows, total] = await this.roleRepository.findAndCount({
      where: conditions,
      take: getListDto.limit,
      skip: (getListDto.page - 1) * getListDto.limit,
      order: {
        [getListDto.sort]: getListDto.order,
      },
    });
    return {
      rows,
      total,
      total_page: Math.ceil(total / getListDto.limit),
      page: getListDto.page,
      limit: getListDto.limit,
    };
  }

  findById(id: string) {
    return this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .select([
        'role.id',
        'role.name',
        'permissions.id',
        'permissions.key',
        'permissions.description',
      ])
      .where('role.id = :id', { id: id })
      .getOne();
  }

  findByIds(ids: string[]) {
    return this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .select([
        'role.id',
        'role.name',
        'permissions.id',
        'permissions.key',
        'permissions.description',
      ])
      .where('role.id IN (:...ids)', { ids })
      .getMany();
  }

  async updatePermissions(role_id: string, permission_id: string[]) {
    const permissions = await this.permissionsService.findByIds(permission_id);
    const role = await this.roleRepository.findOneBy({ id: role_id });
    role.permissions = permissions;
    return this.roleRepository.save(role);
  }
}
