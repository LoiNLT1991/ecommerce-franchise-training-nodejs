import { mapBaseResponse } from "../../core/mappers";
import { ICategoryFranchise } from "./category-franchise.interface";
import { CategoryFranchiseItemDto } from "./dto/item.dto";

export const mapItemToResponse = (item: ICategoryFranchise): CategoryFranchiseItemDto => {
  const base = mapBaseResponse(item);
  return {
    ...base,
    category_id: String(item.category_id),
    category_name: item.category_name,
    franchise_id: String(item.franchise_id),
    franchise_name: item.franchise_name,
    display_order: item.display_order,
  };
};
