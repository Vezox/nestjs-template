import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;
}
