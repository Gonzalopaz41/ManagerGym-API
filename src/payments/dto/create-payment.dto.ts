import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { PaymentMethod } from "../entities/payment.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentDto {
  
  @ApiProperty({ description: 'Amount of the payment', example: 100.50 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty({ description: 'Payment method', example: PaymentMethod.CASH })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @ApiProperty({ description: 'Date of the payment', example: '2023-10-15' })
  @IsNotEmpty()
  @IsDateString()
  paymentDate!: string;
}
