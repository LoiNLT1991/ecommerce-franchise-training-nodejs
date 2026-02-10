import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class UpdateProductFranchiseDto {  
  @IsNotEmpty()
  @IsString()
  size!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price_base!: number;
}