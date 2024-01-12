import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required_permission = this.reflector.getAllAndOverride<any[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required_permission) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return required_permission.some(
      (permission) => user.permissions?.includes(permission),
    );
  }
}
