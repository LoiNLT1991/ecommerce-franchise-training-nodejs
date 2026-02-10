import { mapBaseResponse } from "../../core/mappers";
import { ProductFranchiseItemDto } from "./dto/item.dto";
import { IProductFranchise } from "./product-franchise.interface";

export const mapItemToResponse = (item: IProductFranchise): ProductFranchiseItemDto => {
  const base = mapBaseResponse(item);
  return {
    ...base,
    product_id: item.product_id,
    product_name: item.product_name,
    franchise_id: item.franchise_id,
    franchise_name: item.franchise_name,
    size: item.size,
    price_base: item.price_base,
  };
};
