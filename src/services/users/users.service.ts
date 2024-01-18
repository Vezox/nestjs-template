import { Injectable } from '@nestjs/common';
import { Between, Like, Repository } from 'typeorm';
// import { CreateUserDto } from './dto';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../roles/role.entity';
import { Permission } from '../permissions/permission.entity';
import { GetListDto } from 'src/common/dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
  ) {}

  create(createUserDto: any) {
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.hash = createUserDto.hash;
    user.roles = createUserDto.roles;
    return this.usersRepository.save(user);
  }

  async getList(getListDto: GetListDto) {
    const conditions = { name: Like(`%${getListDto.search}%`) };
    if (getListDto.start_time && getListDto.end_time) {
      conditions['created_at'] = Between(
        new Date(getListDto.start_time),
        new Date(getListDto.end_time),
      );
    }
    const [rows, total] = await this.usersRepository.findAndCount({
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

  async findById(id: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'roles.id',
        'roles.name',
        'permissions.id',
        'permissions.key',
        'permissions.description',
      ])
      .where('user.id = :id', { id: id })
      .getOne();
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }
}
