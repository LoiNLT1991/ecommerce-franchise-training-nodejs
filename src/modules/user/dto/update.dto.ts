import { IsEmail, IsOptional, IsString } from "class-validator";

export default class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  public email!: string;

  @IsOptional()
  @IsString()
  public name!: string;

  @IsOptional()
  @IsString()
  public phone!: string;

  @IsOptional()
  @IsString()
  public avatar_url!: string;
}
