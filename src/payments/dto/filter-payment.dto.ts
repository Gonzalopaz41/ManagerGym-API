import { IsEnum, IsOptional, IsPositive, Min } from "class-validator";
import { PaymentStatus } from "../entities/payment.entity";
import { Type } from "class-transformer";

export class FilterPaymentDto {

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}