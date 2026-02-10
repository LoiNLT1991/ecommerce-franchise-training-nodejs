import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";

export class CreateProductFranchiseDto {
  @IsNotEmpty()
  @IsMongoId()
  franchise_id!: string;

  @IsNotEmpty()
  @IsMongoId()
  product_id!: string;
  
  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  size!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price_base!: number;
}
