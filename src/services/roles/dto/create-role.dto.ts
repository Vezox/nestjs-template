import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  readonly permission_ids: string[];
}
