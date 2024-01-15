import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';

export class UpdatePermissionDto {
  @IsNotEmpty()
  readonly role_id: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  readonly permission_ids: string[];
}
