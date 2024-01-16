import { Injectable } from '@nestjs/common';
import { Permission } from './permission.entity';
import { Between, In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePermissionDto } from './dto';
import { GetListDto } from 'src/common/dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createUserDto: CreatePermissionDto) {
    const permission = new Permission();
    permission.key = createUserDto.key;
    permission.description = createUserDto.description;
    return this.permissionRepository.save(permission);
  }

  async isExist(key: string) {
    const permission = await this.permissionRepository.findOneBy({ key });
    return !!permission;
  }

  async findByIds(ids: string[]) {
    return this.permissionRepository.findBy({ id: In(ids) });
  }

  async getList(getListDto: GetListDto) {
    const conditions = { key: Like(`%${getListDto.search}%`) };
    if (getListDto.start_time && getListDto.end_time) {
      conditions['created_at'] = Between(
        new Date(getListDto.start_time),
        new Date(getListDto.end_time),
      );
    }
    const [rows, total] = await this.permissionRepository.findAndCount({
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
}
