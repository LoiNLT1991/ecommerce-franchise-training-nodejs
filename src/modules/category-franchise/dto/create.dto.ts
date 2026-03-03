import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export default class CreateCategoryFranchiseDto {
  @IsNotEmpty()
  @IsMongoId()
  franchise_id!: string;

  @IsNotEmpty()
  @IsMongoId()
  category_id!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  display_order?: number;
}
