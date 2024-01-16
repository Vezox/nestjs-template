import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  readonly permission_ids: string[];
}
