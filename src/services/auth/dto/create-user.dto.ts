import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  ArrayMinSize,
  IsArray,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-zA-z])[0-9A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'password containing at least 8 characters, 1 number and 1 letter',
  })
  readonly password: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(4, { each: true })
  readonly role_ids: string[];
}
