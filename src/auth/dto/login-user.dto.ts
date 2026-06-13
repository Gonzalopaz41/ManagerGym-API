import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class LoginUserDto{

  @ApiProperty({ example: 'john_doe', minLength: 4, maxLength: 20 })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  userName!: string;

  @ApiProperty({ example: 'Password1', minLength: 6, maxLength: 20, description: 'Must contain uppercase, lowercase and a number or special character' })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  password!: string;

}