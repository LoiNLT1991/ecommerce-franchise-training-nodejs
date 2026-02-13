import { BaseItemDto } from "../../../core/dto";

export interface CategoryFranchiseItemDto extends BaseItemDto {
  category_id: string;
  category_name: string;
  franchise_id: string;
  franchise_name: string;
  display_order: number;
}
