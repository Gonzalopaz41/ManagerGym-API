import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateExerciseDto {
  
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId!: string;
}