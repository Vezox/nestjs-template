import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  ArrayMinSize,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(4, { each: true })
  readonly role_ids: string[];
}
