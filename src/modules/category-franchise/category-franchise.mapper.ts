import { mapBaseResponse } from "../../core/mappers";
import { ICategoryFranchise } from "./category-franchise.interface";
import { CategoryFranchiseItemDto, PublicCategoryFranchiseItemDto } from "./dto/item.dto";

export const mapItemToResponse = (item: ICategoryFranchise): CategoryFranchiseItemDto => {
  const base = mapBaseResponse(item);
  const commonFields = mapItemToPublicResponse(item);
  return {
    ...base,
    ...commonFields,
  };
};

export const mapItemToPublicResponse = (item: ICategoryFranchise): PublicCategoryFranchiseItemDto => {
  return {
    category_id: String(item.category_id),
    category_name: item.category_name,
    category_code: item.category_code,
    franchise_id: String(item.franchise_id),
    franchise_name: item.franchise_name,
    franchise_code: item.franchise_code,
    display_order: item.display_order,
  };
};
