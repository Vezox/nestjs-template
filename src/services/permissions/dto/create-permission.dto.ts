import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @MaxLength(25)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly key: string;

  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly description: string;
}
