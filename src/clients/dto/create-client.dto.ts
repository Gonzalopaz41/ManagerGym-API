import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class CreateClientDto {

  @ApiProperty({ description: 'Full name of the client', example: 'Carlos Perez', minLength: 1, maxLength: 30 })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  fullname!: string;

  @ApiProperty({ description: 'Phone number of the client', example: 3811234567, type: 'number' })
  @IsNumber()
  @IsPositive()
  phone!: number;

  @ApiPropertyOptional({ description: 'Email address of the client', example: 'email@example.com' })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Address of the client', example: 'San Martin 333', minLength: 1, maxLength: 30 })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Birth date of the client (ISO 8601)', example: '1990-06-23' })
  @IsOptional()
  @IsDateString()
  birth_date?: Date;

  @ApiPropertyOptional({ description: 'Observations or goals about the client', example: 'Interested in personal training sessions', maxLength: 500 })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  observation?: string;
}