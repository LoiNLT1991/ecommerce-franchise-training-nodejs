import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export default class UpdateCategoryFranchiseDto {
  @IsNotEmpty()
  @IsMongoId()
  franchise_id: string;

  @IsNotEmpty()
  @IsMongoId()
  category_id: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  display_order?: number;

  constructor(franchise_id: string, category_id: string, display_order?: number) {
    this.franchise_id = franchise_id;
    this.category_id = category_id;
    this.display_order = display_order;
  }
}
