import { IsOptional, IsString } from "class-validator";

export class CheckoutCartDto {
  @IsOptional()
  @IsString()
  address!: string;

  @IsOptional()
  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  message!: string;
}