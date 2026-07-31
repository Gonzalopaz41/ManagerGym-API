import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateExerciseDto {

  @ApiProperty({ description: 'Name of the exercise. Must be unique', example: 'press banca' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Description of how the exercise is performed. Must be unique when provided', example: 'press de banca con barra, agarre medio' })
  @IsOptional()
  @IsString()
  description!: string;

  @ApiProperty({ description: 'UUID of the category the exercise belongs to', example: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7', format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  categoryId!: string;
}
