import { IsUUID, IsInt, IsPositive, IsOptional, IsNumber, IsString, IsDateString } from "class-validator";

export class CreateProgressDto {
   @IsUUID()
  exerciseId!: string;

  @IsInt()
  @IsPositive()
  sets!: number;

  @IsInt()
  @IsPositive()
  reps!: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  weight?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  recordedAt!: string;  // el recepcionista elige la fecha del registro
}