import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permissions';
export const Permissions = (...permissions: any[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
