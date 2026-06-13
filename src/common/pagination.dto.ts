import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto {

  @ApiPropertyOptional({ description: 'Number of results per page', example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number;

  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number;
}