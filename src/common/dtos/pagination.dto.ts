import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // EnableImplicitConvertions: true
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number) // EnableImplicitConvertions: true, con esto el parámetro limit se combierte a número porque llega como string
  offset?: number;
}
