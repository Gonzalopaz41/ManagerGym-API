import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { PaymentMethod } from "../entities/payment.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentDto {

  @ApiProperty({ description: 'Amount of the payment', example: 5000, type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty({ description: 'Payment method', example: PaymentMethod.CASH, enum: PaymentMethod })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @ApiProperty({ description: 'Date of the payment (ISO 8601)', example: '2026-06-13' })
  @IsNotEmpty()
  @IsDateString()
  paymentDate!: string;
}
