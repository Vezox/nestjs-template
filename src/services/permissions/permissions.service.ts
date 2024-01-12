import { Injectable } from '@nestjs/common';
import { Permission } from './permission.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePermissionDto } from './dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createUserDto: CreatePermissionDto) {
    const permission = new Permission();
    permission.name = createUserDto.name;
    return this.permissionRepository.save(permission);
  }

  async isExist(name: string) {
    const permission = await this.permissionRepository.findOneBy({ name });
    return !!permission;
  }

  async findByIds(ids: string[]) {
    return this.permissionRepository.findBy({ id: In(ids) });
  }
}
