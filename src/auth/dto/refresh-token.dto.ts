import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class RefreshTokenDto {

  @ApiProperty({ example: 'eyJ...', description: 'The refreshToken returned by POST auth/login, sent back exactly as received' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
