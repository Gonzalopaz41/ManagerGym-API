import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateRoutineStatusDto{

  @ApiProperty({ description: 'true activates the routine and deactivates any other active routine of the same client. false only deactivates this one, leaving the client without an active routine', example: true })
  @IsNotEmpty()
  @IsBoolean()
  isActive!: boolean;
}
