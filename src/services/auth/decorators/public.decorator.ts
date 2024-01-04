import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'public_key';
export const Public = (is_public: boolean = true) =>
  SetMetadata(IS_PUBLIC_KEY, is_public);
