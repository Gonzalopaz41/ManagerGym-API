import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { PaymentMethod } from "../entities/payment.entity";

export class CreatePaymentDto {
  
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsNotEmpty()
  @IsDateString()
  paymentDate!: string;
}
