import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateProgressDto {
  @ApiProperty({ description: 'UUID of the exercise the record belongs to', example: 'b7e6d5c4-3a2b-41c0-9d8e-7f6a5b4c3d2e', format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  exerciseId!: string;

  @ApiProperty({ description: 'Number of sets performed', example: 4, type: 'integer' })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  sets!: number;

  @ApiProperty({ description: 'Number of repetitions per set', example: 10, type: 'integer' })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  reps!: number;

  @ApiPropertyOptional({ description: 'Weight lifted in kg. Optional, there are exercises without weight', example: 60.5, type: 'number' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  weight?: number;

  @ApiPropertyOptional({ description: 'Observations of the day about the record', example: 'le costó la última serie' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Date the exercise was performed (ISO 8601)', example: '2026-06-13' })
  @IsNotEmpty()
  @IsDateString()
  recordedAt!: string;
}
