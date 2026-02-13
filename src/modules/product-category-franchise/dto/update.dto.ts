import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateProductCategoryFranchiseDto {
  @IsNotEmpty()
  @IsMongoId()
  category_franchise_id!: string;

  @IsNotEmpty()
  @IsMongoId()
  product_franchise_id!: string;
  
  @IsOptional()
  @IsNumber()
  display_order?: number;
}