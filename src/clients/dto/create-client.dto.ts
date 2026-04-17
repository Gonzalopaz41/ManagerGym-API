import { IsDateString, IsEmail, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class CreateClientDto {

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  fullname!: string;

  @IsNumber()
  @IsPositive()
  phone!: number;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @IsOptional()
  address?: string;

  @IsOptional()
  @IsDateString()
  birth_date?: Date;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @IsOptional()
  observation?: string;
}