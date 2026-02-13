import { BaseItemDto } from "../../../core/dto";

export interface ProductFranchiseItemDto extends BaseItemDto {
  product_id: string;
  product_name: string;
  franchise_id: string;
  franchise_name: string;
  size: string;
  price_base: number;
}
