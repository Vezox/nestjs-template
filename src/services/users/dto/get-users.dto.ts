import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class GetUsersDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  readonly page: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  readonly limit: number;

  readonly search: string = '';

  @IsEnum(['created_at'])
  readonly sort: string = 'created_at';

  @IsEnum([-1, 1])
  readonly order: number = -1;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  readonly start_time: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  readonly end_time: number;
}
