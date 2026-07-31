import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ description: 'Name of the muscle group or category. Must be unique', example: 'pecho' })
  @IsNotEmpty()
  @IsString()
  name!: string;
}
