import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'How may rows do you need',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // EnableImplicitConvertions: true
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'How may rows do you want to skip',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number) // EnableImplicitConvertions: true, con esto el parámetro limit se combierte a número porque llega como string
  offset?: number;
}
