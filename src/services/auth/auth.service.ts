import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto';
import { PermissionsService } from '../permissions/permissions.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
  ) {}

  async createUser(user_data: CreateUserDto) {
    const existing_user = await this.usersService.findOne({
      email: user_data.email,
    });
    if (existing_user) {
      throw new HttpException('Email exists', HttpStatus.CONFLICT);
    }
    const roles = await this.rolesService.findByIds(user_data.role_ids);
    if (!roles.length) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    const hash = await this.hashPassword(user_data.password);
    const user = await this.usersService.create({
      name: user_data.name,
      email: user_data.email,
      hash,
      roles,
    });
    delete user.hash;
    return user;
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne({ email });
    const check_password = await this.comparePassword(password, user.hash);
    if (!check_password) {
      throw new UnauthorizedException('password is incorrect');
    }
    const payload = {
      id: user.id,
      email: user.email,
    };
    const token = this.generateAccessToken(payload);
    return {
      user: payload,
      token,
    };
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
