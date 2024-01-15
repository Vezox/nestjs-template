import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { FindOptionsOrderValue } from 'typeorm/find-options/FindOptionsOrder';

export class GetListDto {
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  readonly page: number = 1;

  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  readonly limit: number = 10;

  readonly search: string = '';

  @IsEnum(['created_at'])
  readonly sort: string = 'created_at';

  @IsEnum(['ASC', 'DESC', 'asc', 'desc'])
  readonly order: FindOptionsOrderValue = 'DESC';

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  readonly start_time: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  readonly end_time: number;
}
