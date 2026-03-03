import { BaseItemDto } from "../../../core/dto";

export interface CategoryFranchiseItemDto extends BaseItemDto, PublicCategoryFranchiseItemDto {}
export interface PublicCategoryFranchiseItemDto {
  category_id: string;
  category_name: string;
  category_code: string;
  franchise_id: string;
  franchise_name: string;
  franchise_code: string;
  display_order: number;
}
