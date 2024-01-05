import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (!this.validPassword(password, user.salt, user.hash)) {
      throw new UnauthorizedException();
    }
    const payload = {
      id: user.id,
      username: user.username,
      roles: user.roles,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  generateSalt() {
    return CryptoJS.lib.WordArray.random(16);
  }

  hashPassword(password: string, salt: string) {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: 512 / 32,
      iterations: 1000,
    }).toString();
  }

  validPassword = function (password: string, salt: string, hash: string) {
    return this.hashPassword(password, salt) === hash;
  };

  async createUser(userData: any) {
    const salt = this.generateSalt();
    const hash = this.hashPassword(userData.password, salt);
    const user = await this.usersService.create({
      ...userData,
      salt: salt.toString(),
      hash: hash,
    });
    const payload = {
      id: user.id,
      username: user.username,
      roles: user.roles,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
