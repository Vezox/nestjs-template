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
    user.email = createUserDto.email;
    user.hash = createUserDto.hash;
    user.role = createUserDto.role;
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(conditions: object) {
    const user = await this.usersRepository.findOneBy(conditions);
    const permissions = await this.permissionsRepository.find({
      where: { roles: user.role },
    });
    user.role.permissions = permissions;
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findById(id: string) {
    return {
      name: 'John Doe',
      email: '',
      id,
    };
  }
}
