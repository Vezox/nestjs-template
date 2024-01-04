import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async findById(id: string) {
    return {
      name: 'John Doe',
      email: '',
      id,
    };
  }

  async findOne(username: string) {
    return {
      _id: '1',
      username,
      email: 'test@gmail.com',
      password: 'test',
      roles: ['user'],
    };
  }
}
