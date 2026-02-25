import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { PASSWORD_LENGTH_MIN } from "../../../core/constants";

export default class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @IsNotEmpty()
  @MinLength(PASSWORD_LENGTH_MIN)
  public password!: string;

  public name!: string;
  public phone!: string;
  public avatar_url!: string;
}
