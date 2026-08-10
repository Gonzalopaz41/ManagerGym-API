import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";


export class AssignRoutineDto {
  @ApiProperty({ description: 'UUID of the client the template is being assigned to', example: '9c1e2b1a-7c4b-4a2e-9f3d-1b2c3d4e5f60', format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  clientId!: string;
}
