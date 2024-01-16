import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
// import { CreateUserDto } from './dto';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../roles/role.entity';
import { Permission } from '../permissions/permission.entity';

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

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(conditions: object) {
    return this.usersRepository.findOneBy(conditions);
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
}
