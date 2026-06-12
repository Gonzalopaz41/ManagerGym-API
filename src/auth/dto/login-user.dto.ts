import { IsString, Matches, MaxLength, MinLength } from "class-validator";


export class LoginUserDto{

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  userName!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  password!: string;

}