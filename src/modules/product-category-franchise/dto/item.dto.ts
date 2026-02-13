import { BaseItemDto } from "../../../core/dto";

export interface ProductCategoryFranchiseItemDto extends BaseItemDto {
  category_franchise_id: string;
  product_franchise_id: string;
  display_order?: number;

  franchise_id: string;
  franchise_name: string;
  category_id: string;
  category_name: string;
  product_id: string;
  product_name: string;
  size?: string;
  price_base?: number;
}
