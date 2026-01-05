import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Convierte "10" (string) a 10 (number)
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number) // Convierte "0" (string) a 0 (number)
  offset?: number;
}