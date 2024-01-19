import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
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
    const existing_user = await this.usersService.findByEmail(user_data.email);
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

  hashPassword(password: string, salt_or_rounds: string | number = 10) {
    return bcrypt.hash(password, salt_or_rounds);
  }

  comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    const check_password = await this.comparePassword(password, user.hash);
    if (!check_password) {
      throw new UnauthorizedException('password is incorrect');
    }
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    const token = this.generateToken(payload);
    await this.usersService.updateRefreshToken(
      user.id,
      user.refresh_tokens.concat(token.refresh_token),
    );
    return {
      user: payload,
      token,
    };
  }

  generateToken(payload: object) {
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async signOut(refresh_token: string, user_id: string) {
    const decode = await this.jwtService.decode(refresh_token);
    if (!decode) {
      throw new UnauthorizedException('refresh_token is invalid');
    }
    if (decode['id'] !== user_id) {
      throw new ForbiddenException('you do not have permission');
    }
    const user = await this.usersService.getRefreshTokensById(user_id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const refresh_tokens = this.removeRefreshTokenExpired(
      user.refresh_tokens,
      refresh_token,
    );
    await this.usersService.updateRefreshToken(user.id, refresh_tokens);
  }

  removeRefreshTokenExpired(refresh_tokens: string[], remove: string) {
    const now = Date.now();
    console.log(refresh_tokens);
    return refresh_tokens.filter((refresh_token) => {
      if (refresh_token === remove) {
        return false;
      }
      const payload = this.jwtService.decode(refresh_token);
      return payload['exp'] * 1000 > now;
    });
  }

  async refreshToken(refresh_token: string) {
    const payload = await this.jwtService
      .verifyAsync(refresh_token)
      .catch(() => {
        throw new UnauthorizedException('refresh_token is invalid');
      });
    const user = await this.usersService.getRefreshTokensById(payload['id']);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (!user.refresh_tokens.includes(refresh_token)) {
      throw new UnauthorizedException('refresh_token is invalid');
    }
    const refresh_tokens = this.removeRefreshTokenExpired(
      user.refresh_tokens,
      refresh_token,
    );
    if (!refresh_tokens.length) {
      throw new UnauthorizedException('refresh_token is expired');
    }
    delete payload['iat'];
    delete payload['exp'];
    const token = this.generateToken(payload);
    await this.usersService.updateRefreshToken(
      user.id,
      refresh_tokens.concat(token.refresh_token),
    );
    return {
      user: payload,
      token,
    };
  }
}
