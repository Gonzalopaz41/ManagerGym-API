import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "../entities/user.entity";

export class CreateUserDto {

  @ApiProperty({ example: 'john_doe', minLength: 4, maxLength: 20 })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  userName!: string;

  @ApiProperty({ example: 'Password1', minLength: 4, maxLength: 20, description: 'Must contain uppercase, lowercase and a number or special character' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  password!: string;

  @ApiPropertyOptional({ enum: Role, default: Role.Base })
  @IsOptional()
  Role?: Role;
}
