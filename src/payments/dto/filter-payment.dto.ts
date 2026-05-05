import { IsEnum, IsOptional, IsPositive, IsUUID, Min } from "class-validator";
import { PaymentStatus } from "../entities/payment.entity";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class FilterPaymentDto {

  @ApiProperty({ description: 'Status of the payment', example: PaymentStatus.ARCHIVED, required: false })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiProperty({ description: 'Client ID', example: 'client-123', required: false })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiProperty({ description: 'Page number', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @ApiProperty({ description: 'Number of items per page', example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}