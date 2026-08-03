import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested } from "class-validator";

export class CreateRoutineItemDto {
  @ApiProperty({ description: 'UUID of the exercise to perform. It must already exist in the workout module', example: 'b7e6d5c4-3a2b-41c0-9d8e-7f6a5b4c3d2e', format: 'uuid' })
  @IsUUID()
  exerciseId!: string;

  @ApiProperty({ description: 'Number of sets prescribed', example: 4, type: 'integer' })
  @IsInt()
  @IsPositive()
  sets!: number;

  @ApiProperty({ description: 'Number of repetitions prescribed per set', example: 10, type: 'integer' })
  @IsInt()
  @IsPositive()
  reps!: number;

  @ApiPropertyOptional({ description: 'Suggested weight in kg. Optional, there are exercises without weight', example: 60.5, type: 'number' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  suggestedWeight?: number;

  @ApiPropertyOptional({ description: 'Instructions for this exercise', example: 'bajar la barra hasta el pecho, sin rebote' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Position of the exercise inside the day. Results are returned sorted by this field, ascending', example: 1, type: 'integer' })
  @IsInt()
  order!: number;
}

export class CreateRoutineDayDto {
  @ApiProperty({ description: 'Name of the training day', example: 'día 1 - pecho y tríceps' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Position of the day inside the routine. Results are returned sorted by this field, ascending', example: 1, type: 'integer' })
  @IsInt()
  order!: number;

  @ApiProperty({ description: 'Exercises of this day. They are created together with the day', type: () => [CreateRoutineItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoutineItemDto)
  items!: CreateRoutineItemDto[];
}

export class CreateRoutineDto {
  @ApiProperty({ description: 'Name of the routine', example: 'rutina de volumen - 4 días' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: 'Goal or general notes about the routine', example: 'enfocada en hipertrofia, 8 semanas' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Days of the routine. They are created together with the routine, along with their exercises', type: () => [CreateRoutineDayDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoutineDayDto)
  days!: CreateRoutineDayDto[];
}
