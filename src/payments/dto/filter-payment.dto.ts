import { IsEnum, IsOptional, IsPositive, IsUUID, Min } from "class-validator";
import { PaymentStatus } from "../entities/payment.entity";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FilterPaymentDto {

  @ApiPropertyOptional({ description: 'Filter by payment status', enum: PaymentStatus, example: PaymentStatus.ACTIVE })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({ description: 'Filter by client UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of results per page', example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}