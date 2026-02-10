import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export default class CreateCategoryFranchiseDto {
  @IsNotEmpty()
  @IsMongoId()
  franchise_id!: string;

  @IsNotEmpty()
  @IsMongoId()
  category_id!: string;

  @IsOptional()
  @IsNumber()
  display_order?: number;
}
