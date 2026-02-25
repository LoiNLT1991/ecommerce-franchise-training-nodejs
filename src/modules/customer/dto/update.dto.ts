import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { PHONE_LENGTH_MIN } from "../../../core";

export default class UpdateCustomerDto {
  @IsOptional()
  @IsEmail()
  public email!: string;

  @IsOptional()
  @IsString()
  public name!: string;

  @IsOptional()
  @MinLength(PHONE_LENGTH_MIN)
  public phone!: string;

  @IsOptional()
  @IsString()
  public avatar_url!: string;

  @IsOptional()
  @IsString()
  public address!: string;
}
