import { BaseItemDto } from "../../../core/dtos";

export interface CategoryFranchiseItemDto extends BaseItemDto {
  category_id: string;
  category_name: string;
  franchise_id: string;
  franchise_name: string;
  display_order: number;
}
