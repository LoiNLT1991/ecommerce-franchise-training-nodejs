import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { PASSWORD_LENGTH_MIN, PHONE_LENGTH_MIN } from "../../../core";

export default class CreateCustomerDto {
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @IsNotEmpty()
  @MinLength(PASSWORD_LENGTH_MIN)
  public password!: string;

  @IsNotEmpty()
  @MinLength(PHONE_LENGTH_MIN)
  public phone!: string;

  public name!: string;
  public avatar_url!: string;
  public address!: string;
}
