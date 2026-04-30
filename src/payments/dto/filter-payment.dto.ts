import { IsEnum, IsOptional, IsPositive, IsUUID, Min } from "class-validator";
import { PaymentStatus } from "../entities/payment.entity";
import { Type } from "class-transformer";

export class FilterPaymentDto {

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}