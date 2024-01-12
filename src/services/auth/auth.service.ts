import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createUser(user_data: CreateUserDto) {
    const existing_user = await this.usersService.findOne({
      email: user_data.email,
    });
    if (existing_user) {
      throw new UnauthorizedException('User already exists');
    }
    const hash = await this.hashPassword(user_data.password);
    const user = await this.usersService.create({
      ...user_data,
      hash: hash,
    });
    delete user.hash;
    return user;
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne({ email });
    if (!this.comparePassword(password, user.hash)) {
      throw new UnauthorizedException('password is incorrect');
    }
    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };
    return this.generateAccessToken(payload);
  }

  generateAccessToken(payload: object) {
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  hashPassword(password: string, salt_or_rounds: string | number = 10) {
    return bcrypt.hash(password, salt_or_rounds);
  }

  comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
