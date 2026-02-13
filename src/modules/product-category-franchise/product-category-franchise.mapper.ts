import { mapBaseResponse } from "../../core";
import { ProductCategoryFranchiseItemDto } from "./dto/item.dto";
import { IProductCategoryFranchise } from "./product-category-franchise.interface";

export const mapItemToResponse = (item: IProductCategoryFranchise): ProductCategoryFranchiseItemDto => {
  const base = mapBaseResponse(item);
  return {
    ...base,
    category_franchise_id: String(item.category_franchise_id),
    product_franchise_id: String(item.product_franchise_id),
    display_order: item.display_order,

    franchise_id: String(item.franchise_id),
    franchise_name: item.franchise_name,
    category_id: String(item.category_id),
    category_name: item.category_name,
    product_id: String(item.product_id),
    product_name: item.product_name,
    size: item.size,
    price_base: item.price_base,
  };
};
