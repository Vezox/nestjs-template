import { IsNotEmpty } from 'class-validator';

export class SignOutDto {
  @IsNotEmpty()
  readonly refresh_token: string;
}
