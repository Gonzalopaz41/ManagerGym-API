import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class CreateClientDto {

  @ApiProperty({ description: 'Full name of the client', example: 'Carlos Perez' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  fullname!: string;

  @ApiProperty({ description: 'Phone number of the client', example: 3811234567 })
  @IsNumber()
  @IsPositive()
  phone!: number;

  @ApiProperty({ description: 'Email address of the client', example: 'email@example.com' })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Address of the client', example: 'san martin 333' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'Birth date of the client', example: '1990-06-23' })
  @IsOptional()
  @IsDateString()
  birth_date?: Date;

  @ApiProperty({ description: 'Observations or goals about the client', example: 'Client is interested in personal training sessions' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @IsOptional()
  observation?: string;
}